import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useWalletStore } from '@/stores/useWalletStore'
import { User, Save, Camera } from 'lucide-react'
import { useToast } from '@/components/ui/toast-simple'

export function ProfileEditor() {
  const { currentProfile, updateProfile } = useWalletStore()
  const { toast } = useToast()
  const [username, setUsername] = useState(currentProfile?.username || '')
  const [profilePicture, setProfilePicture] = useState(currentProfile?.profilePicture || '')
  const [isEditing, setIsEditing] = useState(false)

  if (!currentProfile) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            Connect your wallet to edit your profile
          </p>
        </CardContent>
      </Card>
    )
  }

  const handleSave = () => {
    if (!username.trim()) {
      toast({ type: 'error', title: 'Username Required', description: 'Please enter a username' })
      return
    }

    updateProfile({
      username: username.trim(),
      profilePicture: profilePicture.trim() || undefined
    })

    setIsEditing(false)
    toast({ type: 'success', title: 'Profile Updated', description: 'Your profile has been saved successfully' })
  }

  const handleCancel = () => {
    setUsername(currentProfile.username)
    setProfilePicture(currentProfile.profilePicture || '')
    setIsEditing(false)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture Section */}
        <div className="space-y-3">
          <Label>Profile Picture</Label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {currentProfile.profilePicture ? (
                <img 
                  src={currentProfile.profilePicture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <User className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            {isEditing && (
              <div className="flex-1">
                <Input
                  placeholder="Profile picture URL (optional)"
                  value={profilePicture}
                  onChange={(e) => setProfilePicture(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter a URL to an image (HTTPS recommended)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Username Section */}
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          {isEditing ? (
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              maxLength={50}
            />
          ) : (
            <div className="p-2 bg-muted rounded font-medium">
              {currentProfile.username}
            </div>
          )}
        </div>

        {/* ENS Name (if available) */}
        {currentProfile.ensName && (
          <div className="space-y-2">
            <Label>ENS Name</Label>
            <div className="p-2 bg-muted rounded font-mono text-sm">
              {currentProfile.ensName}
            </div>
          </div>
        )}

        {/* Wallet Address */}
        <div className="space-y-2">
          <Label>Wallet Address</Label>
          <div className="p-2 bg-muted rounded font-mono text-sm">
            {currentProfile.address}
          </div>
        </div>

        {/* Account Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <Label className="text-xs text-muted-foreground">Joined</Label>
            <div>{formatDate(currentProfile.joinedAt)}</div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Last Login</Label>
            <div>{formatDate(currentProfile.lastLoginAt)}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="w-full">
              <Camera className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
