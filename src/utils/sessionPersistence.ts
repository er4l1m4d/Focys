import type { SessionLog } from '../stores/useTimerStore'

export interface SessionData {
  sessions: SessionLog[]
  totalSessions: number
  totalFocusTime: number // in seconds
  totalBreakTime: number // in seconds
  streakDays: number
  lastSessionDate: string
  exportedAt?: string
}

class SessionPersistenceService {
  private readonly STORAGE_KEY = 'focys-session-data'
  private readonly BACKUP_KEY = 'focys-session-backup'

  // Save sessions to localStorage with backup
  async saveSessions(sessions: SessionLog[]): Promise<void> {
    try {
      const sessionData: SessionData = {
        sessions,
        totalSessions: sessions.length,
        totalFocusTime: this.calculateTotalTime(sessions, 'focus'),
        totalBreakTime: this.calculateTotalTime(sessions, ['shortBreak', 'longBreak']),
        streakDays: this.calculateStreakDays(sessions),
        lastSessionDate: sessions.length > 0 ? new Date(sessions[0].endTime).toISOString() : new Date().toISOString()
      }

      // Save current data
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData))
      
      // Create backup of previous data
      const existingData = localStorage.getItem(this.STORAGE_KEY)
      if (existingData) {
        localStorage.setItem(this.BACKUP_KEY, existingData)
      }
      
      console.log(`Saved ${sessions.length} sessions to localStorage`)
    } catch (error) {
      console.error('Failed to save sessions:', error)
      throw new Error('Failed to save session data')
    }
  }

  // Load sessions from localStorage
  async loadSessions(): Promise<SessionLog[]> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      if (!data) {
        return []
      }

      const sessionData: SessionData = JSON.parse(data)
      return sessionData.sessions || []
    } catch (error) {
      console.error('Failed to load sessions:', error)
      
      // Try to load from backup
      try {
        const backupData = localStorage.getItem(this.BACKUP_KEY)
        if (backupData) {
          const sessionData: SessionData = JSON.parse(backupData)
          console.log('Loaded sessions from backup')
          return sessionData.sessions || []
        }
      } catch (backupError) {
        console.error('Failed to load backup sessions:', backupError)
      }
      
      return []
    }
  }

  // Get session statistics
  async getSessionStats(): Promise<SessionData | null> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      if (!data) {
        return null
      }

      return JSON.parse(data) as SessionData
    } catch (error) {
      console.error('Failed to get session stats:', error)
      return null
    }
  }

  // Export sessions as JSON
  async exportSessions(): Promise<string> {
    try {
      const sessions = await this.loadSessions()
      const stats = await this.getSessionStats()
      
      const exportData = {
        ...stats,
        sessions,
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        app: 'Focys'
      }

      return JSON.stringify(exportData, null, 2)
    } catch (error) {
      console.error('Failed to export sessions:', error)
      throw new Error('Failed to export session data')
    }
  }

  // Import sessions from JSON
  async importSessions(jsonData: string): Promise<SessionLog[]> {
    try {
      const data = JSON.parse(jsonData)
      
      // Validate the data structure
      if (!data.sessions || !Array.isArray(data.sessions)) {
        throw new Error('Invalid session data format')
      }

      // Validate each session
      const validSessions = data.sessions.filter((session: any) => 
        session.id && 
        session.type && 
        typeof session.startTime === 'number' && 
        typeof session.endTime === 'number' &&
        typeof session.duration === 'number' &&
        typeof session.completed === 'boolean'
      )

      await this.saveSessions(validSessions)
      return validSessions
    } catch (error) {
      console.error('Failed to import sessions:', error)
      throw new Error('Failed to import session data')
    }
  }

  // Clear all session data
  async clearAllSessions(): Promise<void> {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
      localStorage.removeItem(this.BACKUP_KEY)
      console.log('Cleared all session data')
    } catch (error) {
      console.error('Failed to clear sessions:', error)
      throw new Error('Failed to clear session data')
    }
  }

  // Helper methods
  private calculateTotalTime(sessions: SessionLog[], types: string | string[]): number {
    const targetTypes = Array.isArray(types) ? types : [types]
    return sessions
      .filter(session => targetTypes.includes(session.type) && session.completed)
      .reduce((total, session) => total + session.duration, 0)
  }

  private calculateStreakDays(sessions: SessionLog[]): number {
    if (sessions.length === 0) return 0

    const completedSessions = sessions
      .filter(session => session.completed && session.type === 'focus')
      .sort((a, b) => b.endTime - a.endTime)

    if (completedSessions.length === 0) return 0

    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    for (const session of completedSessions) {
      const sessionDate = new Date(session.endTime)
      sessionDate.setHours(0, 0, 0, 0)

      const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff === streak) {
        streak++
        currentDate = new Date(sessionDate)
      } else if (daysDiff > streak) {
        break
      }
    }

    return streak
  }

  // Download sessions as file
  downloadSessionsAsFile(filename?: string): void {
    this.exportSessions().then(jsonData => {
      const blob = new Blob([jsonData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      
      link.href = url
      link.download = filename || `focys-sessions-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
    }).catch(error => {
      console.error('Failed to download sessions:', error)
    })
  }
}

export const sessionPersistence = new SessionPersistenceService()
export default sessionPersistence
