// src/utils/wallet/walletConnector.ts
import { useWalletStore } from '@/stores/useWalletStore';

type EthereumProvider = {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  removeListener: (event: string, handler: (...args: any[]) => void) => void;
  isMetaMask?: boolean;
  isOkxWallet?: boolean;
  isZerion?: boolean;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

// List of known wallet provider properties
const WALLET_PROVIDERS = ['isMetaMask', 'isOkxWallet', 'isZerion'] as const;

export class WalletConnector {
  private static instance: WalletConnector;
  private provider: EthereumProvider | null = null;
  private listeners: Record<string, ((...args: any[]) => void)[]> = {};
  private isInitialized = false;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): WalletConnector {
    if (!WalletConnector.instance) {
      WalletConnector.instance = new WalletConnector();
    }
    return WalletConnector.instance;
  }

  private initialize() {
    if (this.isInitialized) return;
    
    // Skip in non-browser environments
    if (typeof window === 'undefined') return;

    try {
      // Check if ethereum is available
      if (!window.ethereum) {
        console.warn('No Ethereum provider found');
        return;
      }

      // Create a proxy to handle multiple wallet extensions
      this.provider = new Proxy(window.ethereum, {
        get: (target, prop) => {
          // Handle specific wallet methods
          if (WALLET_PROVIDERS.includes(prop as any)) {
            return target[prop as keyof typeof target];
          }
          
          // Handle event listeners
          if (prop === 'on') {
            return (event: string, handler: (...args: any[]) => void) => {
              if (!this.listeners[event]) {
                this.listeners[event] = [];
              }
              this.listeners[event].push(handler);
              target.on?.(event, handler);
            };
          }
          
          if (prop === 'removeListener') {
            return (event: string, handler: (...args: any[]) => void) => {
              if (this.listeners[event]) {
                this.listeners[event] = this.listeners[event].filter(h => h !== handler);
              }
              target.removeListener?.(event, handler);
            };
          }
          
          // Forward other methods
          if (typeof target[prop as keyof EthereumProvider] === 'function') {
            return async (...args: any[]) => {
              try {
                const method = target[prop as keyof EthereumProvider];
                if (typeof method === 'function') {
                  return await method.apply(target, args);
                }
                throw new Error(`Method ${String(prop)} is not a function`);
              } catch (error) {
                console.error(`Wallet operation failed: ${String(prop)}`, error);
                throw error;
              }
            };
          }
          
          return target[prop as keyof EthereumProvider];
        },
        set: (target, prop, value) => {
          // Prevent modifying the ethereum property
          if (prop === 'ethereum') {
            console.warn('Prevented modification of window.ethereum');
            return true;
          }
          (target as any)[prop] = value;
          return true;
        },
      });

      // Replace the global ethereum with our proxy
      (window as any).ethereum = this.provider;
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize wallet connector:', error);
    }
  }

  public async connect(): Promise<{ address: string; chainId: string }> {
    if (!this.provider) {
      throw new Error('No wallet provider available');
    }

    try {
      // Request account access
      const accounts = await this.provider.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (!accounts || !accounts.length) {
        throw new Error('No accounts found');
      }

      const address = accounts[0];
      
      // Get chain ID
      const chainId = await this.provider.request({ 
        method: 'eth_chainId' 
      });

      return { address, chainId };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  public async getAccounts(): Promise<string[]> {
    if (!this.provider) return [];
    
    try {
      return await this.provider.request({ 
        method: 'eth_accounts' 
      }) || [];
    } catch (error) {
      console.error('Failed to get accounts:', error);
      return [];
    }
  }

  public async getChainId(): Promise<string | null> {
    if (!this.provider) return null;
    
    try {
      return await this.provider.request({ 
        method: 'eth_chainId' 
      });
    } catch (error) {
      console.error('Failed to get chain ID:', error);
      return null;
    }
  }

  public onAccountsChanged(handler: (accounts: string[]) => void): () => void {
    if (!this.provider) return () => {};
    
    const listener = (accounts: string[]) => {
      handler(accounts || []);
    };
    
    this.provider.on('accountsChanged', listener);
    
    return () => {
      this.provider?.removeListener('accountsChanged', listener);
    };
  }

  public onChainChanged(handler: (chainId: string) => void): () => void {
    if (!this.provider) return () => {};
    
    const listener = (chainId: string) => {
      handler(chainId);
      // Reload the page on chain change
      window.location.reload();
    };
    
    this.provider.on('chainChanged', listener);
    
    return () => {
      this.provider?.removeListener('chainChanged', listener);
    };
  }
}

// Initialize the singleton instance
const walletConnector = WalletConnector.getInstance();

export default walletConnector;
