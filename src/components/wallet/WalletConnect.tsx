import { useEffect, useState, useCallback } from 'react';
import { useWalletStore } from '@/stores/useWalletStore';
import { Button } from '@/components/ui/button';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { AlertCircle, LogOut, Wallet } from 'lucide-react';
import walletConnector from '@/utils/wallet/walletConnector';

// Format address for display
const formatAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export function WalletConnect() {
  const { 
    isConnected, 
    address, 
    chainId, 
    setConnection, 
    disconnect: disconnectWallet,
    currentProfile,
  } = useWalletStore();
  
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Format chain name for display
  const formatChainName = useCallback((chainId: number | null): string => {
    if (!chainId) return 'Unknown Network';
    
    switch (chainId) {
      case 1: return 'Ethereum Mainnet';
      case 5: return 'Goerli Testnet';
      case 137: return 'Polygon Mainnet';
      case 80001: return 'Mumbai Testnet';
      case 11155111: return 'Sepolia Testnet';
      default: return `Network (${chainId})`;
    }
  }, []);

  // Handle wallet connection
  const connectWallet = useCallback(async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      const { address, chainId } = await walletConnector.connect();
      setConnection(address, parseInt(chainId, 16));
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      if (error.code !== 4001) { // Don't show error if user rejected the request
        setError(error.message || 'Failed to connect wallet');
      }
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, setConnection]);

  // Handle wallet disconnection
  const disconnect = useCallback(() => {
    disconnectWallet();
  }, [disconnectWallet]);

  // Check initial connection on mount
  useEffect(() => {
    const checkInitialConnection = async () => {
      try {
        const [accounts, chainId] = await Promise.all([
          walletConnector.getAccounts(),
          walletConnector.getChainId()
        ]);
        
        if (accounts.length > 0 && chainId) {
          setConnection(accounts[0], parseInt(chainId, 16));
        }
      } catch (error) {
        console.error('Error checking initial connection:', error);
      }
    };

    checkInitialConnection();
  }, [setConnection]);

  // Set up event listeners for account and chain changes
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        walletConnector.getChainId()
          .then(chainId => {
            if (chainId) {
              setConnection(accounts[0], parseInt(chainId, 16));
            }
          })
          .catch(console.error);
      }
    };

    const handleChainChanged = (newChainId: string) => {
      // The chainChanged event is handled by the walletConnector
      console.log('Chain changed to:', newChainId);
    };

    // Set up listeners
    const cleanupAccounts = walletConnector.onAccountsChanged(handleAccountsChanged);
    const cleanupChain = walletConnector.onChainChanged(handleChainChanged);

    // Clean up on unmount
    return () => {
      cleanupAccounts();
      cleanupChain();
    };
  }, [setConnection, disconnectWallet]);

  // Render error message if any
  if (error) {
    return (
      <div className="w-full">
        <div className="border border-red-200 dark:border-red-900 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 mb-2">
            <AlertCircle className="h-5 w-5" />
            <h3 className="font-medium">Connection Error</h3>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => setError(null)}
          >
            Dismiss
          </Button>
        </div>
      </div>
    );
  }

  if (isConnected && address) {
    const displayAddress = currentProfile?.username || formatAddress(address);
    const avatarFallback = displayAddress.slice(0, 2).toUpperCase();
    
    return (
      <div className="w-full">
        <div className="border rounded-lg overflow-hidden dark:bg-[#252425]">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={currentProfile?.profilePicture} alt={displayAddress} />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{displayAddress}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatChainName(chainId)}
                  </p>
                </div>
              </div>
              <Button 
                variant="default" 
                size="icon" 
                onClick={disconnect}
                disabled={isConnecting}
                className="h-8 w-8 bg-primary hover:bg-primary/90"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Wallet</span>
                <div className="flex items-center">
                  <Wallet className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{formatAddress(address)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Network</span>
                <span>{formatChainName(chainId)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Connect Wallet</h3>
      </div>
      <div className="space-y-4">
        <Button 
          onClick={connectWallet}
          disabled={isConnecting}
          className="w-full hover:bg-[#169183] hover:text-white transition-colors"
          variant="default"
        >
          <Wallet className="h-4 w-4 mr-2" />
          {window.ethereum ? 'Connect Wallet' : 'Install MetaMask'}
          {isConnecting && ' (Connecting...)'}
        </Button>
        
        <p className="text-xs text-center text-muted-foreground">
          Connect with MetaMask or another Web3 wallet
        </p>
        
        <div className="text-xs text-muted-foreground">
          Your wallet will be used to:
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Save your focus sessions permanently</li>
            <li>Unlock achievements and crystals</li>
            <li>Access Web3 features</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
