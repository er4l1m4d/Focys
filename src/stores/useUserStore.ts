import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { supabase, TABLES } from '@/lib/supabase'

interface UserState {
  // User profile
  walletAddress: string | null
  username: string
  level: number
  xp: number
  totalFocusTime: number // in minutes
  totalSessions: number
  streak: number
  lastSessionDate: string | null
  unlockedCrystals: string[]
  activeCrystal: string | null
  achievements: Record<string, boolean>
  
  // Actions
  setWalletAddress: (address: string | null) => void
  setUsername: (name: string) => void
  addXp: (amount: number) => void
  addFocusTime: (minutes: number) => void
  incrementSessions: () => void
  updateStreak: () => void
  unlockCrystal: (crystalId: string) => void
  setActiveCrystal: (crystalId: string | null) => void
  unlockAchievement: (achievementId: string) => void
  resetUser: () => void
  syncFromRemote: (profile: any) => void // New method to sync from remote
}

// Helper function to handle Supabase operations
async function syncWithSupabase(state: any, action: 'get' | 'set', data?: any) {
  if (!state.walletAddress) return null;
  
  try {
    if (action === 'get') {
      const { data: profile, error } = await supabase
        .from(TABLES.PROFILES)
        .select('*')
        .eq('wallet_address', state.walletAddress.toLowerCase())
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return profile || null;
    } else if (action === 'set' && data) {
      const { error } = await supabase
        .from(TABLES.PROFILES)
        .upsert({
          ...data,
          wallet_address: state.walletAddress.toLowerCase(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'wallet_address' });
      
      if (error) {
        console.error('Error saving profile:', error);
        return false;
      }
      return true;
    }
  } catch (error) {
    console.error('Supabase operation failed:', error);
    return null;
  }
}

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      walletAddress: null,
      username: 'Focys User',
      level: 1,
      xp: 0,
      totalFocusTime: 0,
      totalSessions: 0,
      streak: 0,
      lastSessionDate: null,
      unlockedCrystals: ['base_crystal'],
      activeCrystal: 'base_crystal',
      achievements: {},

      // Actions
      setWalletAddress: async (address) => {
        set({ walletAddress: address });
        if (address) {
          // Try to load profile from Supabase
          const profile = await syncWithSupabase({ walletAddress: address }, 'get');
          if (profile) {
            set({
              username: profile.username,
              level: profile.level,
              xp: profile.xp,
              totalFocusTime: profile.total_focus_time,
              totalSessions: profile.total_sessions,
              streak: profile.streak,
              lastSessionDate: profile.last_session_date,
              unlockedCrystals: profile.unlocked_crystals,
              activeCrystal: profile.active_crystal,
              achievements: profile.achievements || {},
            });
          }
        }
      },
      
      setUsername: (name) => set({ username: name }),
      
      addXp: async (amount) => {
        const { xp, level } = get()
        const newXp = xp + amount
        const xpForNextLevel = level * 100
        
        if (newXp >= xpForNextLevel) {
          const newState = {
            xp: newXp - xpForNextLevel,
            level: level + 1
          }
          set(newState)
          await syncWithSupabase(get(), 'set', newState)
        } else {
          const newState = { xp: newXp }
          set(newState)
          await syncWithSupabase(get(), 'set', newState)
        }
      },
      
      addFocusTime: async (minutes) => {
        const newState = { totalFocusTime: get().totalFocusTime + minutes }
        set(newState)
        await syncWithSupabase(get(), 'set', newState)
      },
      
      incrementSessions: async () => {
        const newState = { totalSessions: get().totalSessions + 1 }
        set(newState)
        await syncWithSupabase(get(), 'set', newState)
      },
      
      updateStreak: async () => {
        const { lastSessionDate, streak } = get()
        const today = new Date().toDateString()
        
        if (lastSessionDate === today) return
        
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toDateString()
        
        const newState = {
          lastSessionDate: today,
          streak: lastSessionDate === yesterdayStr ? streak + 1 : 1
        }
        set(newState)
        await syncWithSupabase(get(), 'set', newState)
      },
      
      unlockCrystal: async (crystalId) => {
        const newState = { unlockedCrystals: [...new Set([...get().unlockedCrystals, crystalId])] }
        set(newState)
        await syncWithSupabase(get(), 'set', newState)
      },
      
      setActiveCrystal: async (crystalId) => {
        const newState = { activeCrystal: crystalId }
        set(newState)
        await syncWithSupabase(get(), 'set', newState)
      },
      
      unlockAchievement: async (achievementId) => {
        const newState = { achievements: { ...get().achievements, [achievementId]: true } }
        set(newState)
        await syncWithSupabase(get(), 'set', newState)
      },
      
      resetUser: async () => {
        const newState = {
          walletAddress: null,
          username: 'Focys User',
          level: 1,
          xp: 0,
          totalFocusTime: 0,
          totalSessions: 0,
          streak: 0,
          lastSessionDate: null,
          unlockedCrystals: ['base_crystal'],
          activeCrystal: 'base_crystal',
          achievements: {}
        }
        set(newState)
        await syncWithSupabase(get(), 'set', newState)
      },
      
      // New method to sync from remote
      syncFromRemote: async (profile) => {
        if (!profile) return;
        set({
          username: profile.username,
          level: profile.level,
          xp: profile.xp,
          totalFocusTime: profile.total_focus_time,
          totalSessions: profile.total_sessions,
          streak: profile.streak,
          lastSessionDate: profile.last_session_date,
          unlockedCrystals: profile.unlocked_crystals || ['base_crystal'],
          activeCrystal: profile.active_crystal || 'base_crystal',
          achievements: profile.achievements || {},
        });
      },
    }),
    {
      name: 'focys-user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields to localStorage as a fallback
        walletAddress: state.walletAddress,
        username: state.username,
        level: state.level,
        xp: state.xp,
        totalFocusTime: state.totalFocusTime,
        totalSessions: state.totalSessions,
        streak: state.streak,
        lastSessionDate: state.lastSessionDate,
        unlockedCrystals: state.unlockedCrystals,
        activeCrystal: state.activeCrystal,
        achievements: state.achievements,
      }),
    }
  )
)

export default useUserStore
