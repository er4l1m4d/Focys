import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: number
  progress: number
  maxProgress: number
  category: 'focus' | 'streak' | 'milestone' | 'special'
  xpReward: number
}

export interface DataShard {
  id: string
  name: string
  type: 'streak' | 'milestone' | 'web3' | 'irys' | 'contract'
  value: number
  earnedAt: number
  description: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  color: string
}

export interface Crystal {
  id: string
  name: string
  type: 'focus' | 'energy' | 'wisdom' | 'rare' | 'legendary'
  level: number
  evolutionStage: number // 0-5 (Base, Awakened, Enhanced, Perfected, Transcendent, Eternal)
  xpToNext: number
  totalXp: number
  unlockedAt: number
  description: string
  baseColor: string
  currentColor: string // Changes with evolution
  abilities: string[]
  dataShards: number // Required for evolution
  evolutionRequirements: {
    xp: number
    dataShards: number
    level: number
  }
  isEvolutionReady: boolean
}

interface GamificationState {
  // Core progression
  totalXp: number
  level: number
  xpToNextLevel: number
  
  // Achievements
  achievements: Achievement[]
  unlockedAchievements: string[]
  
  // Crystals & Data Shards
  crystals: Crystal[]
  activeCrystal: string | null
  dataShards: DataShard[]
  totalDataShardValue: number
  
  // Statistics for achievements
  totalSessions: number
  consecutiveDays: number
  longestStreak: number
  totalFocusMinutes: number
  
  // Actions
  addXp: (amount: number, source: string) => void
  unlockAchievement: (achievementId: string) => void
  checkAchievements: () => void
  addCrystal: (crystal: Crystal) => void
  setActiveCrystal: (crystalId: string) => void
  updateSessionStats: (focusMinutes: number, isNewDay: boolean) => void
  
  // Data Shards & Evolution
  earnDataShard: (shard: DataShard) => void
  evolveCrystal: (crystalId: string) => boolean
  checkCrystalEvolution: (crystalId: string) => void
  getCrystalEvolutionStage: (stage: number) => string
  
  // Computed values
  getCurrentLevel: () => number
  getXpProgress: () => number
  getNextLevelXp: () => number
  getUnlockedAchievements: () => Achievement[]
  getPendingAchievements: () => Achievement[]
}

// XP calculation: exponential growth
const calculateXpForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

const calculateLevelFromXp = (totalXp: number): number => {
  let level = 1
  let xpNeeded = 0
  
  while (xpNeeded <= totalXp) {
    xpNeeded += calculateXpForLevel(level)
    if (xpNeeded <= totalXp) {
      level++
    }
  }
  
  return level
}

// Crystal Evolution Helper Functions
const getEvolutionColor = (baseColor: string, stage: number): string => {
  const colorMap: { [key: string]: string[] } = {
    '#3B82F6': ['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE', '#EFF6FF', '#F0F9FF'], // Blue evolution
    '#10B981': ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5', '#ECFDF5'], // Green evolution
    '#F59E0B': ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#FEF3C7', '#FFFBEB'], // Amber evolution
    '#8B5CF6': ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE', '#F5F3FF']  // Purple evolution
  }
  
  const colors = colorMap[baseColor] || colorMap['#3B82F6']
  return colors[Math.min(stage, colors.length - 1)]
}

const getEvolutionAbility = (stage: number): string => {
  const abilities = [
    'Enhanced Focus',
    'Deep Concentration',
    'Flow State Mastery',
    'Transcendent Awareness',
    'Eternal Wisdom'
  ]
  
  return abilities[Math.min(stage - 1, abilities.length - 1)] || 'Unknown Ability'
}

// Default achievements
const defaultAchievements: Achievement[] = [
  {
    id: 'first-session',
    title: 'First Focus',
    description: 'Complete your first focus session',
    icon: '🎯',
    progress: 0,
    maxProgress: 1,
    category: 'milestone',
    xpReward: 50
  },
  {
    id: 'streak-3',
    title: 'Getting Started',
    description: 'Focus for 3 consecutive days',
    icon: '🔥',
    progress: 0,
    maxProgress: 3,
    category: 'streak',
    xpReward: 100
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Focus for 7 consecutive days',
    icon: '⚡',
    progress: 0,
    maxProgress: 7,
    category: 'streak',
    xpReward: 250
  },
  {
    id: 'sessions-10',
    title: 'Dedicated Learner',
    description: 'Complete 10 focus sessions',
    icon: '📚',
    progress: 0,
    maxProgress: 10,
    category: 'focus',
    xpReward: 150
  },
  {
    id: 'sessions-50',
    title: 'Focus Master',
    description: 'Complete 50 focus sessions',
    icon: '🏆',
    progress: 0,
    maxProgress: 50,
    category: 'focus',
    xpReward: 500
  },
  {
    id: 'hours-10',
    title: 'Time Keeper',
    description: 'Focus for 10 total hours',
    icon: '⏰',
    progress: 0,
    maxProgress: 600, // 10 hours in minutes
    category: 'milestone',
    xpReward: 300
  }
]

// Default starter crystal
const starterCrystal: Crystal = {
  id: 'starter-focus',
  name: 'Focus Crystal',
  type: 'focus',
  level: 1,
  evolutionStage: 0, // Base stage
  xpToNext: 100,
  totalXp: 0,
  unlockedAt: Date.now(),
  description: 'Your first crystal companion. Grows stronger with each focus session.',
  baseColor: '#3B82F6',
  currentColor: '#3B82F6',
  abilities: ['Basic Focus', 'Session Tracking'],
  dataShards: 0,
  evolutionRequirements: {
    xp: 500,
    dataShards: 5,
    level: 3
  },
  isEvolutionReady: false
}

const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      // Initial state
      totalXp: 0,
      level: 1,
      xpToNextLevel: 100,
      achievements: defaultAchievements,
      unlockedAchievements: [],
      crystals: [starterCrystal],
      activeCrystal: 'starter-focus',
      dataShards: [],
      totalDataShardValue: 0,
      totalSessions: 0,
      consecutiveDays: 0,
      longestStreak: 0,
      totalFocusMinutes: 0,

      // Actions
      addXp: (amount: number, source: string) => {
        const { totalXp } = get()
        const newTotalXp = totalXp + amount
        const newLevel = calculateLevelFromXp(newTotalXp)
        const currentLevel = get().level
        
        set({
          totalXp: newTotalXp,
          level: newLevel,
          xpToNextLevel: calculateXpForLevel(newLevel + 1)
        })
        
        // Level up notification could be handled here
        if (newLevel > currentLevel) {
          console.log(`🎉 Level up! You are now level ${newLevel}`)
        }
        
        console.log(`+${amount} XP from ${source}`)
      },

      unlockAchievement: (achievementId: string) => {
        const { unlockedAchievements, achievements } = get()
        
        if (!unlockedAchievements.includes(achievementId)) {
          const achievement = achievements.find(a => a.id === achievementId)
          if (achievement) {
            set({
              unlockedAchievements: [...unlockedAchievements, achievementId],
              achievements: achievements.map(a => 
                a.id === achievementId 
                  ? { ...a, unlockedAt: Date.now() }
                  : a
              )
            })
            
            // Award XP for unlocking achievement
            get().addXp(achievement.xpReward, `Achievement: ${achievement.title}`)
            console.log(`🏆 Achievement unlocked: ${achievement.title}`)
          }
        }
      },

      checkAchievements: () => {
        const { 
          achievements, 
          unlockedAchievements, 
          totalSessions, 
          consecutiveDays, 
          totalFocusMinutes 
        } = get()

        achievements.forEach(achievement => {
          if (unlockedAchievements.includes(achievement.id)) return

          let currentProgress = 0
          
          switch (achievement.id) {
            case 'first-session':
              currentProgress = totalSessions >= 1 ? 1 : 0
              break
            case 'streak-3':
              currentProgress = Math.min(consecutiveDays, 3)
              break
            case 'streak-7':
              currentProgress = Math.min(consecutiveDays, 7)
              break
            case 'sessions-10':
              currentProgress = Math.min(totalSessions, 10)
              break
            case 'sessions-50':
              currentProgress = Math.min(totalSessions, 50)
              break
            case 'hours-10':
              currentProgress = Math.min(totalFocusMinutes, 600)
              break
          }

          // Update progress
          set({
            achievements: achievements.map(a => 
              a.id === achievement.id 
                ? { ...a, progress: currentProgress }
                : a
            )
          })

          // Check if achievement should be unlocked
          if (currentProgress >= achievement.maxProgress) {
            get().unlockAchievement(achievement.id)
          }
        })
      },

      addCrystal: (crystal: Crystal) => {
        set((state) => ({
          crystals: [...state.crystals, crystal]
        }))
      },

      setActiveCrystal: (crystalId: string) => {
        set({ activeCrystal: crystalId })
      },

      updateSessionStats: (focusMinutes: number, isNewDay: boolean) => {
        const { totalSessions, consecutiveDays, longestStreak, totalFocusMinutes } = get()
        
        const newTotalSessions = totalSessions + 1
        const newTotalFocusMinutes = totalFocusMinutes + focusMinutes
        let newConsecutiveDays = consecutiveDays
        let newLongestStreak = longestStreak

        if (isNewDay) {
          newConsecutiveDays = consecutiveDays + 1
          newLongestStreak = Math.max(longestStreak, newConsecutiveDays)
        }

        set({
          totalSessions: newTotalSessions,
          totalFocusMinutes: newTotalFocusMinutes,
          consecutiveDays: newConsecutiveDays,
          longestStreak: newLongestStreak
        })

        // Award XP for completing session
        const baseXp = Math.floor(focusMinutes * 2) // 2 XP per minute focused
        const streakBonus = consecutiveDays > 0 ? Math.floor(consecutiveDays * 5) : 0
        const totalXp = baseXp + streakBonus
        
        get().addXp(totalXp, `Focus Session (${focusMinutes}m)`)
        
        // Check for new achievements
        get().checkAchievements()
      },

      // Data Shards & Evolution Methods
      earnDataShard: (shard: DataShard) => {
        set(state => ({
          dataShards: [...state.dataShards, shard],
          totalDataShardValue: state.totalDataShardValue + shard.value
        }))
        
        // Check if any crystals can evolve with new shard
        const { crystals } = get()
        crystals.forEach(crystal => {
          get().checkCrystalEvolution(crystal.id)
        })
        
        console.log(`💎 Earned ${shard.name} Data Shard (+${shard.value} value)`)
      },

      evolveCrystal: (crystalId: string) => {
        const state = get()
        const crystal = state.crystals.find(c => c.id === crystalId)
        
        if (!crystal || !crystal.isEvolutionReady) {
          return false
        }
        
        const newStage = crystal.evolutionStage + 1
        const stageName = get().getCrystalEvolutionStage(newStage)
        
        // Calculate new properties for evolved crystal
        const newColor = getEvolutionColor(crystal.baseColor, newStage)
        const newAbilities = [...crystal.abilities, getEvolutionAbility(newStage)]
        const newRequirements = {
          xp: crystal.evolutionRequirements.xp * 2,
          dataShards: crystal.evolutionRequirements.dataShards + 3,
          level: crystal.evolutionRequirements.level + 2
        }
        
        set(state => ({
          crystals: state.crystals.map(c => 
            c.id === crystalId 
              ? {
                  ...c,
                  evolutionStage: newStage,
                  currentColor: newColor,
                  abilities: newAbilities,
                  evolutionRequirements: newRequirements,
                  isEvolutionReady: false,
                  dataShards: 0, // Reset shards after evolution
                  description: `${c.description} [${stageName}]`
                }
              : c
          )
        }))
        
        console.log(`🌟 ${crystal.name} evolved to ${stageName} stage!`)
        return true
      },

      checkCrystalEvolution: (crystalId: string) => {
        const state = get()
        const crystal = state.crystals.find(c => c.id === crystalId)
        
        if (!crystal) return
        
        const canEvolve = 
          crystal.totalXp >= crystal.evolutionRequirements.xp &&
          crystal.dataShards >= crystal.evolutionRequirements.dataShards &&
          state.level >= crystal.evolutionRequirements.level
        
        if (canEvolve && !crystal.isEvolutionReady) {
          set(state => ({
            crystals: state.crystals.map(c => 
              c.id === crystalId ? { ...c, isEvolutionReady: true } : c
            )
          }))
          console.log(`✨ ${crystal.name} is ready to evolve!`)
        }
      },

      getCrystalEvolutionStage: (stage: number) => {
        const stages = ['Base', 'Awakened', 'Enhanced', 'Perfected', 'Transcendent', 'Eternal']
        return stages[stage] || 'Unknown'
      },

      // Computed values
      getCurrentLevel: () => get().level,
      
      getXpProgress: () => {
        const { totalXp, level } = get()
        const currentLevelXp = calculateXpForLevel(level)
        const nextLevelXp = calculateXpForLevel(level + 1)
        const progressXp = totalXp - (level === 1 ? 0 : currentLevelXp)
        return (progressXp / nextLevelXp) * 100
      },
      
      getNextLevelXp: () => calculateXpForLevel(get().level + 1),
      
      getUnlockedAchievements: () => {
        const { achievements, unlockedAchievements } = get()
        return achievements.filter(a => unlockedAchievements.includes(a.id))
      },
      
      getPendingAchievements: () => {
        const { achievements, unlockedAchievements } = get()
        return achievements.filter(a => !unlockedAchievements.includes(a.id))
      }
    }),
    {
      name: 'focys-gamification-storage',
      partialize: (state) => ({
        totalXp: state.totalXp,
        level: state.level,
        xpToNextLevel: state.xpToNextLevel,
        achievements: state.achievements,
        unlockedAchievements: state.unlockedAchievements,
        crystals: state.crystals,
        activeCrystal: state.activeCrystal,
        dataShards: state.dataShards,
        totalDataShardValue: state.totalDataShardValue,
        totalSessions: state.totalSessions,
        consecutiveDays: state.consecutiveDays,
        longestStreak: state.longestStreak,
        totalFocusMinutes: state.totalFocusMinutes
      })
    }
  )
)

export default useGamificationStore
