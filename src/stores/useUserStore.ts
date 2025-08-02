import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  
  // Crystal collection
  unlockedCrystals: string[]
  activeCrystal: string | null
  
  // Achievements
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
      setWalletAddress: (address) => set({ walletAddress: address }),
      
      setUsername: (name) => set({ username: name }),
      
      addXp: (amount) => {
        const { xp, level } = get()
        const newXp = xp + amount
        const xpForNextLevel = level * 100
        
        if (newXp >= xpForNextLevel) {
          set({
            xp: newXp - xpForNextLevel,
            level: level + 1
          })
        } else {
          set({ xp: newXp })
        }
      },
      
      addFocusTime: (minutes) => set((state) => ({
        totalFocusTime: state.totalFocusTime + minutes
      })),
      
      incrementSessions: () => set((state) => ({
        totalSessions: state.totalSessions + 1
      })),
      
      updateStreak: () => {
        const { lastSessionDate, streak } = get()
        const today = new Date().toDateString()
        
        if (lastSessionDate === today) return
        
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toDateString()
        
        set({
          lastSessionDate: today,
          streak: lastSessionDate === yesterdayStr ? streak + 1 : 1
        })
      },
      
      unlockCrystal: (crystalId) => set((state) => ({
        unlockedCrystals: [...new Set([...state.unlockedCrystals, crystalId])]
      })),
      
      setActiveCrystal: (crystalId) => set({ activeCrystal: crystalId }),
      
      unlockAchievement: (achievementId) => set((state) => ({
        achievements: { ...state.achievements, [achievementId]: true }
      })),
      
      resetUser: () => set({
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
      })
    }),
    {
      name: 'focys-user-storage',
      partialize: (state) => ({
        username: state.username,
        level: state.level,
        xp: state.xp,
        totalFocusTime: state.totalFocusTime,
        totalSessions: state.totalSessions,
        streak: state.streak,
        lastSessionDate: state.lastSessionDate,
        unlockedCrystals: state.unlockedCrystals,
        activeCrystal: state.activeCrystal,
        achievements: state.achievements
      })
    }
  )
)

export default useUserStore
