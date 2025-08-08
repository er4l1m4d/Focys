import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWalletStore } from '@/stores/useWalletStore'
import { Wallet, LogOut, User, AlertCircle } from 'lucide-react'

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function WalletConnect() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  
  const { 
    currentProfile, 
    setConnection, 
    disconnect: storeDisconnect,
    createProfile 
  } = useWalletStore()

  // Handle account changes
  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      // Wallet disconnected
      handleDisconnect()
    } else {
      setAddress(accounts[0])
      // Re-fetch chain ID in case it changed
      window.ethereum.request({ method: 'eth_chainId' })
        .then((id: string) => setChainId(parseInt(id, 16)))
    }
  }, [])

  // Handle chain changes
  const handleChainChanged = useCallback((chainId: string) => {
    setChainId(parseInt(chainId, 16))
    // Reload the page to ensure all components update with the new chain
    window.location.reload()
  }, [])

  // Check if already connected on mount and set up event listeners
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          if (accounts.length > 0) {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' })
            setChainId(parseInt(chainId, 16))
            setAddress(accounts[0])
            setIsConnected(true)
            setConnection(accounts[0], parseInt(chainId, 16))
            
            if (!currentProfile) {
              createProfile(accounts[0])
            }
          }
        } catch (error) {
          console.error('Error checking connection:', error)
          setError('Failed to check wallet connection')
        }

        // Set up event listeners
        window.ethereum.on('accountsChanged', handleAccountsChanged)
        window.ethereum.on('chainChanged', handleChainChanged)
        
        return () => {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
          window.ethereum.removeListener('chainChanged', handleChainChanged)
        }
      } else {
        setError('No Ethereum wallet detected. Please install MetaMask or another Web3 wallet.')
      }
    }

    init()
  }, [currentProfile, handleAccountsChanged, handleChainChanged, setConnection, createProfile])

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('No Ethereum wallet detected. Please install MetaMask or another Web3 wallet.')
      return
    }

    setIsConnecting(true)
    setError(null)
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      if (accounts.length > 0) {
        // Get current chain ID
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        const numericChainId = parseInt(chainId, 16)
        
        setAddress(accounts[0])
        setChainId(numericChainId)
        setIsConnected(true)
        setConnection(accounts[0], numericChainId)
        
        if (!currentProfile) {
          await createProfile(accounts[0])
        }
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error)
      setError(
        error.code === 4001 
          ? 'Connection rejected. Please connect your wallet to continue.' 
          : 'Failed to connect wallet. Please try again.'
      )
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setAddress(null)
    setIsConnected(false)
    setChainId(null)
    setError(null)
    storeDisconnect()
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getNetworkName = (chainId: number | null) => {
    if (!chainId) return 'Unknown Network'
    switch (chainId) {
      case 1: return 'Ethereum Mainnet'
      case 5: return 'Goerli Testnet'
      case 11155111: return 'Sepolia Testnet'
      case 137: return 'Polygon Mainnet'
      case 80001: return 'Mumbai Testnet'
      default: return `Chain ID: ${chainId}`
    }
  }

  // Render error message if any
  if (error) {
    return (
      <Card className="w-full max-w-md border-destructive/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Wallet Connection Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          {!window.ethereum ? (
            <Button asChild>
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full"
              >
                Install MetaMask
              </a>
            </Button>
          ) : (
            <Button 
              onClick={connectWallet} 
              className="w-full hover:bg-[#169183] hover:text-white transition-colors" 
              disabled={isConnecting}
              variant="outline"
            >
              {isConnecting ? 'Connecting...' : 'Try Again'}
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  if (isConnected && address) {
    return (
      <Card className="w-full p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Connected Wallet</h3>
        </div>
        <CardContent className="space-y-4 p-0">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Address</div>
            <div className="font-mono text-sm bg-muted p-2 rounded">
              {formatAddress(address)}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Network</div>
            <div className="font-medium">
              {getNetworkName(chainId)}
              {chainId && chainId !== 1 && chainId !== 5 && chainId !== 11155111 && (
                <span className="ml-2 text-xs text-yellow-600 dark:text-yellow-400">
                  (Unsupported network)
                </span>
              )}
            </div>
          </div>
          
          {currentProfile?.username && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Username</div>
              <div className="font-medium">{currentProfile.username}</div>
            </div>
          )}
          
          <Button 
            onClick={handleDisconnect}
            variant="default"
            className="w-full mt-4 hover:bg-[#169183] hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full p-6">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Connect Wallet</h3>
      </div>
      <CardContent className="space-y-4">
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
      </CardContent>
    </Card>
  )
}
