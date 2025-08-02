import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SessionManager from "@/components/session/SessionManager"
import { WalletConnect } from "@/components/wallet/WalletConnect"
import { ProfileEditor } from "@/components/wallet/ProfileEditor"
import { useAccount } from 'wagmi'
import { useWalletStore } from '@/stores/useWalletStore'

export function Profile() {
  const { isConnected } = useAccount()
  const { currentProfile } = useWalletStore()

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Wallet Connection Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WalletConnect />
        {isConnected && currentProfile && <ProfileEditor />}
      </div>

      {/* Web3 Features Info */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>🌐 Web3 Features Unlocked!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <div className="font-medium">✅ Permanent Storage</div>
                <div className="text-muted-foreground">
                  Your sessions are saved to your wallet and can be uploaded to Irys for permanent storage.
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">🏆 NFT Achievements</div>
                <div className="text-muted-foreground">
                  Unlock special NFT badges for major milestones and achievements.
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">💎 Crystal Evolution</div>
                <div className="text-muted-foreground">
                  Your crystals can evolve and gain special abilities through Web3 interactions.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Management Section */}
      <SessionManager />
    </div>
  )
}
