import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TimerState {
  // Timer state
  isRunning: boolean
  timeLeft: number
  sessionType: 'focus' | 'shortBreak' | 'longBreak'
  sessionCount: number
  
  // Timer settings
  focusDuration: number // in minutes
  shortBreakDuration: number // in minutes
  longBreakDuration: number // in minutes
  sessionsBeforeLongBreak: number
  
  // Actions
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  toggleTimer: () => void
  nextSession: () => void
  setFocusDuration: (minutes: number) => void
  setShortBreakDuration: (minutes: number) => void
  setLongBreakDuration: (minutes: number) => void
  setSessionsBeforeLongBreak: (count: number) => void
}

const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      // Initial state
      isRunning: false,
      timeLeft: 25 * 60, // 25 minutes in seconds
      sessionType: 'focus',
      sessionCount: 0,
      focusDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      sessionsBeforeLongBreak: 4,

      // Actions
      startTimer: () => set({ isRunning: true }),
      pauseTimer: () => set({ isRunning: false }),
      toggleTimer: () => set((state) => ({ isRunning: !state.isRunning })),
      
      resetTimer: () => {
        const { sessionType, focusDuration, shortBreakDuration, longBreakDuration } = get()
        const duration = 
          sessionType === 'focus' ? focusDuration :
          sessionType === 'shortBreak' ? shortBreakDuration :
          longBreakDuration
        set({ timeLeft: duration * 60 })
      },
      
      nextSession: () => {
        const { sessionCount, sessionsBeforeLongBreak } = get()
        const nextSessionCount = (sessionCount + 1) % (sessionsBeforeLongBreak + 1)
        const isLongBreak = nextSessionCount === 0 && sessionCount > 0
        
        set(state => ({
          sessionCount: nextSessionCount,
          sessionType: isLongBreak ? 'longBreak' : 
                       state.sessionType === 'focus' ? 'shortBreak' : 'focus',
          timeLeft: isLongBreak ? state.longBreakDuration * 60 :
                    state.sessionType === 'focus' ? state.shortBreakDuration * 60 :
                    state.focusDuration * 60,
          isRunning: false
        }))
      },
      
      // Settings actions
      setFocusDuration: (minutes) => set({ 
        focusDuration: minutes,
        timeLeft: get().sessionType === 'focus' ? minutes * 60 : get().timeLeft
      }),
      
      setShortBreakDuration: (minutes) => set({ 
        shortBreakDuration: minutes,
        timeLeft: get().sessionType === 'shortBreak' ? minutes * 60 : get().timeLeft
      }),
      
      setLongBreakDuration: (minutes) => set({ 
        longBreakDuration: minutes,
        timeLeft: get().sessionType === 'longBreak' ? minutes * 60 : get().timeLeft
      }),
      
      setSessionsBeforeLongBreak: (count) => set({ sessionsBeforeLongBreak: count })
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
