// src/utils/walletUtils.ts

// Handle multiple wallet extensions trying to set window.ethereum
export function initializeWalletHandling() {
  // Only run in browser environment
  if (typeof window === 'undefined') return;

  // Skip if window.ethereum is not available
  if (!window.ethereum) return;

  // Store the original ethereum provider
  const originalEthereum = { ...window.ethereum };

  // Create a proxy to handle multiple wallet providers
  const proxyHandler = {
    get(target: any, prop: string) {
      // Handle specific wallet methods
      if (prop === 'isMetaMask' && originalEthereum.isMetaMask) {
        return true;
      }
      if (prop === 'isOkxWallet' && originalEthereum.isOkxWallet) {
        return true;
      }
      if (prop === 'isZerion' && originalEthereum.isZerion) {
        return true;
      }
      // Add other wallet checks as needed

      // Default to the original property
      return Reflect.get(target, prop);
    },
    set(target: any, prop: string, value: any) {
      // Prevent overwriting ethereum property
      if (prop === 'ethereum') {
        return true; // Silently fail
      }
      return Reflect.set(target, prop, value);
    }
  };

  // Create a proxy to handle the ethereum object
  try {
    window.ethereum = new Proxy(originalEthereum, proxyHandler);
  } catch (error) {
    console.warn('Failed to create ethereum proxy:', error);
  }
}

// Call this function early in your app's lifecycle
// to handle wallet conflicts before other extensions load
export function setupWalletConflictResolution() {
  // Run immediately
  initializeWalletHandling();

  // Also run when the page is fully loaded
  if (document.readyState === 'complete') {
    initializeWalletHandling();
  } else {
    window.addEventListener('load', initializeWalletHandling);
  }
}
