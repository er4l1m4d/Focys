import { useState, useRef } from 'react'
import type { ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useWalletStore } from '@/stores/useWalletStore'
import { User, Save, Camera, X } from 'lucide-react'
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

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast({ type: 'error', title: 'Invalid File', description: 'Please upload an image file' })
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ type: 'error', title: 'File Too Large', description: 'Please upload an image smaller than 5MB' })
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setProfilePicture(base64String)
    }
    reader.readAsDataURL(file)
  }

  const removeProfilePicture = (e: React.MouseEvent) => {
    e.stopPropagation()
    setProfilePicture('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
          <span>Profile</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Profile Picture Section */}
        <div className="space-y-3">
          <Label>Profile Picture</Label>
          <div className="flex flex-col items-center">
            <div 
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
                {profilePicture ? (
                  <>
                    <img 
                      src={profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12 text-muted-foreground" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
              </div>
              {profilePicture && (
                <button
                  type="button"
                  onClick={removeProfilePicture}
                  className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/90 hover:scale-110 transition-all z-10"
                  title="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
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
              <Button 
                onClick={handleSave} 
                className="flex-1 hover:bg-[#169183] hover:text-white transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button 
                onClick={handleCancel} 
                variant="default"
                className="hover:bg-[#169183] hover:text-white transition-colors"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button   
              onClick={() => setIsEditing(true)}
              variant="default"
              className="hover:bg-[#169183] hover:text-white transition-colors"
            >
              <Camera className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
