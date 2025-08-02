import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import sessionPersistence from '../utils/sessionPersistence'
import useGamificationStore from './useGamificationStore'

export interface SessionLog {
  id: string
  type: 'focus' | 'shortBreak' | 'longBreak'
  startTime: number
  endTime: number
  duration: number // in seconds
  completed: boolean
}

type SessionType = 'focus' | 'shortBreak' | 'longBreak'

interface TimerState {
  // Timer state
  isRunning: boolean
  timeLeft: number
  currentRound: number
  totalRounds: number
  sessionType: SessionType
  
  // Timer settings
  focusDuration: number // in seconds
  shortBreakDuration: number // in seconds
  longBreakDuration: number // in seconds
  sessionsBeforeLongBreak: number
  sessionLogs: SessionLog[]
  
  // Actions
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  toggleTimer: () => void
  nextSession: () => void
  tick: () => void
  completeSession: () => void
  formatTime: (seconds?: number) => string
  setFocusDuration: (minutes: number) => void
  setShortBreakDuration: (minutes: number) => void
  setLongBreakDuration: (minutes: number) => void
  setSessionsBeforeLongBreak: (count: number) => void
  
  // Session logging
  logSession: (session: Omit<SessionLog, 'id'>) => void
  getRecentSessions: (limit?: number) => SessionLog[]
  clearSessionLogs: () => void
  
  // Session persistence
  loadSessionsFromStorage: () => Promise<void>
  saveSessionsToStorage: () => Promise<void>
  exportSessionsAsJson: () => Promise<string>
  exportSessionsAsFile: (filename?: string) => void
  importSessionsFromJson: (jsonData: string) => Promise<void>
  getSessionStats: () => Promise<any>
  
  // Computed values
  currentSessionDuration: () => number
  getProgressPercentage: () => number
  getSessionType: () => SessionType
  getRemainingTime: () => number
  getTotalRounds: () => number
  getCurrentRound: () => number
}

const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      // Initial state
      isRunning: false,
      timeLeft: 25 * 60, // 25 minutes in seconds
      currentRound: 1,
      totalRounds: 8, // 4 focus + 4 short breaks
      sessionLogs: [],
      sessionType: 'focus',
      focusDuration: 25 * 60, // 25 minutes in seconds
      shortBreakDuration: 5 * 60, // 5 minutes in seconds
      longBreakDuration: 15 * 60, // 15 minutes in seconds
      sessionsBeforeLongBreak: 4,

      // Actions
      startTimer: () => set({ isRunning: true }),
      pauseTimer: () => set({ isRunning: false }),
      toggleTimer: () => set((state) => ({ isRunning: !state.isRunning })),
      
      tick: () => {
        const { timeLeft } = get()
        if (timeLeft > 0) {
          set({ timeLeft: timeLeft - 1 })
        }
      },
      
      completeSession: () => {
        const { currentRound, totalRounds, sessionType, logSession } = get()
        const isLastRound = currentRound >= totalRounds
        const isFocusSession = sessionType === 'focus'
        const now = Date.now()
        const sessionDuration = get().currentSessionDuration()
        
        // Log the completed session
        logSession({
          type: sessionType,
          startTime: now - (sessionDuration * 1000),
          endTime: now,
          duration: sessionDuration,
          completed: true
        })
        
        // Award XP and update gamification stats for focus sessions
        if (isFocusSession) {
          const gamificationStore = useGamificationStore.getState()
          const focusMinutes = Math.floor(sessionDuration / 60)
          
          // Check if this is a new day for streak calculation
          const lastSessionDate = new Date(gamificationStore.totalSessions > 0 ? now - (24 * 60 * 60 * 1000) : 0)
          const today = new Date(now)
          const isNewDay = lastSessionDate.toDateString() !== today.toDateString()
          
          // Update gamification stats
          gamificationStore.updateSessionStats(focusMinutes, isNewDay)
        }
        
        if (isLastRound && isFocusSession) {
          // End of all sessions
          set({
            isRunning: false,
            currentRound: 1,
            sessionType: 'focus',
            timeLeft: get().focusDuration
          })
        } else if (isFocusSession) {
          // Move to short break or long break
          const nextBreakType = (currentRound % get().sessionsBeforeLongBreak === 0) ? 'longBreak' : 'shortBreak'
          const breakDuration = nextBreakType === 'longBreak' 
            ? get().longBreakDuration 
            : get().shortBreakDuration
            
          set({
            currentRound: currentRound + 1,
            sessionType: nextBreakType,
            timeLeft: breakDuration
          })
        } else {
          // Move to focus
          set({
            currentRound: currentRound + 1,
            sessionType: 'focus',
            timeLeft: get().focusDuration
          })
        }
      },
      
      formatTime: (seconds?: number) => {
        const time = seconds !== undefined ? seconds : get().timeLeft
        const mins = Math.floor(time / 60)
        const secs = time % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      },
      
      resetTimer: () => {
        const { sessionType } = get()
        set({
          timeLeft: sessionType === 'focus' ? 
            get().focusDuration : 
            sessionType === 'shortBreak' ? 
              get().shortBreakDuration : 
              get().longBreakDuration,
          isRunning: false
        })
      },
      
      nextSession: () => {
        const { currentRound, totalRounds, sessionType } = get()
        const isFocusSession = sessionType === 'focus'
        const isLastRound = currentRound >= totalRounds
        
        if (isLastRound && isFocusSession) {
          // End of all sessions
          set({
            currentRound: 1,
            sessionType: 'focus',
            timeLeft: get().focusDuration,
            isRunning: false
          })
        } else if (isFocusSession) {
          // Move to short break
          set({
            currentRound: currentRound + 1,
            sessionType: 'shortBreak',
            timeLeft: get().shortBreakDuration,
            isRunning: false
          })
        } else {
          // Move to next focus session
          set({
            sessionType: 'focus',
            timeLeft: get().focusDuration,
            isRunning: false
          })
        }
      },
      
      // Computed values
      currentSessionDuration: () => {
        const { sessionType, focusDuration, shortBreakDuration, longBreakDuration } = get()
        return sessionType === 'focus' ? 
          focusDuration : 
          sessionType === 'shortBreak' ? 
            shortBreakDuration : 
            longBreakDuration
      },
      
      getProgressPercentage: () => {
        const { timeLeft, currentSessionDuration } = get()
        return ((currentSessionDuration() - timeLeft) / currentSessionDuration()) * 100
      },
      
      getSessionType: () => get().sessionType,
      
      getRemainingTime: () => get().timeLeft,
      
      getTotalRounds: () => get().totalRounds,
      
      getCurrentRound: () => get().currentRound,
      
      // Settings actions
      setFocusDuration: (minutes) => set({ 
        focusDuration: minutes * 60,
        timeLeft: get().sessionType === 'focus' ? minutes * 60 : get().timeLeft
      }),
      
      setShortBreakDuration: (minutes) => set({ 
        shortBreakDuration: minutes * 60,
        timeLeft: get().sessionType === 'shortBreak' ? minutes * 60 : get().timeLeft
      }),
      
      setLongBreakDuration: (minutes) => set({ 
        longBreakDuration: minutes * 60,
        timeLeft: get().sessionType === 'longBreak' ? minutes * 60 : get().timeLeft
      }),
      
      setSessionsBeforeLongBreak: (count) => {
        set({ sessionsBeforeLongBreak: count })
      },
  
      // Session logging actions
      logSession: (session) => {
        const newLog = {
          ...session,
          id: Date.now().toString(),
        }
        set((state) => ({
          sessionLogs: [newLog, ...state.sessionLogs],
        }))
      },
      
      getRecentSessions: (limit = 10) => {
        return get().sessionLogs.slice(0, limit)
      },
      
      clearSessionLogs: () => {
        set({ sessionLogs: [] })
      },
      
      // Session persistence methods
      loadSessionsFromStorage: async () => {
        try {
          const sessions = await sessionPersistence.loadSessions()
          set({ sessionLogs: sessions })
          console.log(`Loaded ${sessions.length} sessions from storage`)
        } catch (error) {
          console.error('Failed to load sessions from storage:', error)
        }
      },
      
      saveSessionsToStorage: async () => {
        try {
          const { sessionLogs } = get()
          await sessionPersistence.saveSessions(sessionLogs)
          console.log(`Saved ${sessionLogs.length} sessions to storage`)
        } catch (error) {
          console.error('Failed to save sessions to storage:', error)
        }
      },
      
      exportSessionsAsJson: async () => {
        try {
          return await sessionPersistence.exportSessions()
        } catch (error) {
          console.error('Failed to export sessions:', error)
          throw error
        }
      },
      
      exportSessionsAsFile: (filename?: string) => {
        sessionPersistence.downloadSessionsAsFile(filename)
      },
      
      importSessionsFromJson: async (jsonData: string) => {
        try {
          const sessions = await sessionPersistence.importSessions(jsonData)
          set({ sessionLogs: sessions })
          console.log(`Imported ${sessions.length} sessions`)
        } catch (error) {
          console.error('Failed to import sessions:', error)
          throw error
        }
      },
      
      getSessionStats: async () => {
        try {
          return await sessionPersistence.getSessionStats()
        } catch (error) {
          console.error('Failed to get session stats:', error)
          return null
        }
      },
    }),
    {
      name: 'focys-timer-storage',
      partialize: (state) => ({
        focusDuration: state.focusDuration,
        shortBreakDuration: state.shortBreakDuration,
        longBreakDuration: state.longBreakDuration,
        sessionsBeforeLongBreak: state.sessionsBeforeLongBreak,
        sessionLogs: state.sessionLogs, // Now persist session logs too
      })
    }
  )
)

export default useTimerStore
