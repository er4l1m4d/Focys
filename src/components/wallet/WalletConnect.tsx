import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWalletStore } from '@/stores/useWalletStore'
import { Wallet, LogOut, User } from 'lucide-react'
import { ethers } from 'ethers'

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function WalletConnect() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  
  const { 
    currentProfile, 
    setConnection, 
    disconnect: storeDisconnect,
    createProfile 
  } = useWalletStore()

  // Check if already connected on mount
  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)
          setConnection(accounts[0], 1)
          
          if (!currentProfile) {
            createProfile(accounts[0])
          }
        }
      } catch (error) {
        console.error('Error checking connection:', error)
      }
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet!')
      return
    }

    setIsConnecting(true)
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if (accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
        setConnection(accounts[0], 1)
        
        if (!currentProfile) {
          createProfile(accounts[0])
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setAddress(null)
    setIsConnected(false)
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
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            variant="outline"
            className="w-full justify-start"
          >
            <Wallet className="h-4 w-4 mr-2" />
            {window.ethereum ? 'Connect MetaMask' : 'Install MetaMask'}
            {isConnecting && ' (Connecting...)'}
          </Button>
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
