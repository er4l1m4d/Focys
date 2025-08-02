import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
  id: string
  address: string
  username: string
  profilePicture?: string
  ensName?: string
  joinedAt: number
  lastLoginAt: number
  isConnected: boolean
}

interface WalletState {
  // Connection state
  isConnected: boolean
  address: string | null
  chainId: number | null
  
  // User profile
  currentProfile: UserProfile | null
  profiles: UserProfile[]
  
  // Actions
  setConnection: (address: string, chainId: number) => void
  disconnect: () => void
  createProfile: (address: string, ensName?: string) => UserProfile
  updateProfile: (updates: Partial<Omit<UserProfile, 'id' | 'address'>>) => void
  switchProfile: (address: string) => void
  getProfileByAddress: (address: string) => UserProfile | undefined
}

const generateProfileId = (address: string): string => {
  return `profile_${address.toLowerCase()}_${Date.now()}`
}

const generateDefaultUsername = (address: string): string => {
  return `Focuser_${address.slice(2, 8)}`
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      // Initial state
      isConnected: false,
      address: null,
      chainId: null,
      currentProfile: null,
      profiles: [],

      // Set connection when wallet connects
      setConnection: (address: string, chainId: number) => {
        const state = get()
        let profile = state.profiles.find(p => p.address.toLowerCase() === address.toLowerCase())
        
        if (!profile) {
          // Create new profile for first-time user
          profile = get().createProfile(address)
        } else {
          // Update last login time for existing user
          profile = {
            ...profile,
            lastLoginAt: Date.now(),
            isConnected: true
          }
          
          set(state => ({
            profiles: state.profiles.map(p => 
              p.address.toLowerCase() === address.toLowerCase() ? profile! : p
            )
          }))
        }

        set({
          isConnected: true,
          address: address.toLowerCase(),
          chainId,
          currentProfile: profile
        })
      },

      // Disconnect wallet
      disconnect: () => {
        const state = get()
        if (state.currentProfile) {
          // Mark current profile as disconnected
          set(state => ({
            profiles: state.profiles.map(p => 
              p.id === state.currentProfile?.id 
                ? { ...p, isConnected: false }
                : p
            )
          }))
        }

        set({
          isConnected: false,
          address: null,
          chainId: null,
          currentProfile: null
        })
      },

      // Create new user profile
      createProfile: (address: string, ensName?: string) => {
        const newProfile: UserProfile = {
          id: generateProfileId(address),
          address: address.toLowerCase(),
          username: ensName || generateDefaultUsername(address),
          ensName,
          joinedAt: Date.now(),
          lastLoginAt: Date.now(),
          isConnected: true
        }

        set(state => ({
          profiles: [...state.profiles, newProfile]
        }))

        return newProfile
      },

      // Update current user profile
      updateProfile: (updates) => {
        const state = get()
        if (!state.currentProfile) return

        const updatedProfile = {
          ...state.currentProfile,
          ...updates
        }

        set(state => ({
          currentProfile: updatedProfile,
          profiles: state.profiles.map(p => 
            p.id === updatedProfile.id ? updatedProfile : p
          )
        }))
      },

      // Switch to different profile (for multi-wallet support)
      switchProfile: (address: string) => {
        const state = get()
        const profile = state.profiles.find(p => 
          p.address.toLowerCase() === address.toLowerCase()
        )

        if (profile) {
          // Mark previous profile as disconnected
          if (state.currentProfile) {
            set(state => ({
              profiles: state.profiles.map(p => 
                p.id === state.currentProfile?.id 
                  ? { ...p, isConnected: false }
                  : p
              )
            }))
          }

          // Set new profile as connected
          const updatedProfile = {
            ...profile,
            isConnected: true,
            lastLoginAt: Date.now()
          }

          set(state => ({
            currentProfile: updatedProfile,
            address: address.toLowerCase(),
            profiles: state.profiles.map(p => 
              p.id === profile.id ? updatedProfile : p
            )
          }))
        }
      },

      // Get profile by address
      getProfileByAddress: (address: string) => {
        const state = get()
        return state.profiles.find(p => 
          p.address.toLowerCase() === address.toLowerCase()
        )
      }
    }),
    {
      name: 'focys-wallet-storage',
      partialize: (state) => ({
        profiles: state.profiles,
        // Don't persist connection state - should reconnect on page load
      })
    }
  )
)
