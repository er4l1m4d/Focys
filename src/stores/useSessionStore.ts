import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Session {
  id: string
  startTime: number
  endTime: number | null
  duration: number // in minutes
  sessionType: 'focus' | 'shortBreak' | 'longBreak'
  xpEarned: number
  tags: string[]
  notes: string
  irysTxId?: string // For permanent storage on Irys
}

interface SessionState {
  sessions: Session[]
  currentSession: Omit<Session, 'endTime' | 'duration' | 'xpEarned'> | null
  
  // Actions
  startSession: (type: 'focus' | 'shortBreak' | 'longBreak', tags?: string[]) => string
  endCurrentSession: (notes?: string) => void
  updateSessionNotes: (sessionId: string, notes: string) => void
  deleteSession: (sessionId: string) => void
  addSessionTag: (sessionId: string, tag: string) => void
  removeSessionTag: (sessionId: string, tag: string) => void
  setIrysTxId: (sessionId: string, txId: string) => void
  clearSessions: () => void
}

const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSession: null,

      startSession: (type, tags = []) => {
        const sessionId = Math.random().toString(36).substr(2, 9)
        const newSession = {
          id: sessionId,
          startTime: Date.now(),
          endTime: null,
          duration: 0,
          sessionType: type,
          xpEarned: 0,
          tags,
          notes: ''
        }
        
        set({ currentSession: newSession })
        return sessionId
      },

      endCurrentSession: async (notes = '') => {
        const { currentSession } = get()
        if (!currentSession) return

        const endTime = Date.now()
        const duration = Math.floor((endTime - currentSession.startTime) / 60000) // in minutes
        
        // Calculate XP based on session type and duration
        let xpEarned = 0
        if (currentSession.sessionType === 'focus') {
          xpEarned = Math.max(10, Math.floor(duration * 1.5)) // At least 10 XP, more for longer sessions
        }

        const completedSession = {
          ...currentSession,
          endTime,
          duration,
          xpEarned,
          notes
        }

        set((state) => ({
          sessions: [completedSession, ...state.sessions],
          currentSession: null
        }))

        // Auto-upload session to Irys
        try {
          const { getIrysService } = await import("../utils/irys/irysService");
          const irys = getIrysService();
          await irys.initialize();

          // Get wallet address from user store
          const userStore = useUserStore.getState();
          const walletAddress = userStore.walletAddress || "";

          const sessionPayload = {
            ...completedSession,
            walletAddress,
            uploadedAt: new Date().toISOString()
          };

          const uploadRes = await irys.uploadData(JSON.stringify(sessionPayload), [
            { name: "Session-Id", value: completedSession.id },
            { name: "Wallet-Address", value: walletAddress },
            { name: "Session-Type", value: completedSession.sessionType },
          ]);
          // Save Irys txId to session
          set((state) => ({
            sessions: state.sessions.map((session) =>
              session.id === completedSession.id
                ? { ...session, irysTxId: uploadRes.id }
                : session
            )
          }));
        } catch (err) {
          console.error("Irys auto-upload failed:", err);
          // Optionally: set error on session or global state
        }

        // Update user stats
        const userStore = useUserStore.getState()
        userStore.addXp(xpEarned)
        userStore.addFocusTime(duration)
        userStore.incrementSessions()
        userStore.updateStreak()

        // Check for achievements
        if (userStore.totalSessions + 1 === 1) {
          userStore.unlockAchievement('first_session')
        }
        if (userStore.totalSessions + 1 >= 5) {
          userStore.unlockAchievement('five_sessions')
        }
        if (duration >= 60) {
          userStore.unlockAchievement('hour_long_session')
        }
      },

      updateSessionNotes: (sessionId, notes) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId ? { ...session, notes } : session
          )
        }))
      },

      deleteSession: (sessionId) => {
        set((state) => ({
          sessions: state.sessions.filter((session) => session.id !== sessionId)
        }))
      },

      addSessionTag: (sessionId, tag) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? { ...session, tags: [...new Set([...session.tags, tag])] }
              : session
          )
        }))
      },

      removeSessionTag: (sessionId, tag) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? { ...session, tags: session.tags.filter((t) => t !== tag) }
              : session
          )
        }))
      },

      setIrysTxId: (sessionId, txId) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId ? { ...session, irysTxId: txId } : session
          )
        }))
      },

      clearSessions: () => {
        set({ sessions: [], currentSession: null })
      }
    }),
    {
      name: 'focys-sessions-storage',
      partialize: (state) => ({
        sessions: state.sessions,
        currentSession: state.currentSession
      })
    }
  )
)

// Import user store for type checking
import useUserStore from './useUserStore'

export default useSessionStore
