import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
    }),
    {
      name: 'focys-timer-storage',
      partialize: (state) => ({
        focusDuration: state.focusDuration,
        shortBreakDuration: state.shortBreakDuration,
        longBreakDuration: state.longBreakDuration,
        sessionsBeforeLongBreak: state.sessionsBeforeLongBreak,
      })
    }
  )
)

export default useTimerStore
