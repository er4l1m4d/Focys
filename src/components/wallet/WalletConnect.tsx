import React from 'react'
import { useConnect, useDisconnect, useAccount, useEnsName } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWalletStore } from '@/stores/useWalletStore'
import { Wallet, LogOut, User } from 'lucide-react'

export function WalletConnect() {
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { address, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address })
  
  const { 
    currentProfile, 
    setConnection, 
    disconnect: storeDisconnect,
    createProfile 
  } = useWalletStore()

  // Handle successful connection
  React.useEffect(() => {
    if (isConnected && address) {
      setConnection(address, 1) // Default to mainnet, will be updated by chain detection
      
      // If no profile exists, create one with ENS name if available
      if (!currentProfile) {
        createProfile(address, ensName || undefined)
      }
    }
  }, [isConnected, address, ensName, setConnection, createProfile, currentProfile])

  const handleDisconnect = () => {
    disconnect()
    storeDisconnect()
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Connected Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Address</div>
            <div className="font-mono text-sm bg-muted p-2 rounded">
              {formatAddress(address)}
            </div>
          </div>
          
          {ensName && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">ENS Name</div>
              <div className="font-medium">{ensName}</div>
            </div>
          )}
          
          {currentProfile && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Username</div>
              <div className="font-medium">{currentProfile.username}</div>
            </div>
          )}
          
          <Button 
            onClick={handleDisconnect}
            variant="outline"
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Connect your wallet to save your progress permanently and unlock Web3 features.
        </p>
        
        <div className="space-y-2">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={isPending}
              variant="outline"
              className="w-full justify-start"
            >
              <Wallet className="h-4 w-4 mr-2" />
              {connector.name}
              {isPending && ' (Connecting...)'}
            </Button>
          ))}
        </div>
        
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
