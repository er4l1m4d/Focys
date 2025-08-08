import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Download, Upload, BarChart3, Loader2, Link2, AlertTriangle } from 'lucide-react'
import useTimerStore from '../../stores/useTimerStore'
import { useToast } from '../ui/toast-simple'
import useSessionStore from '../../stores/useSessionStore'

interface SessionStats {
  totalSessions: number
  totalFocusTime: number
  totalBreakTime: number
  streakDays: number
  lastSessionDate: string
}

const SessionManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState<SessionStats | null>(null)
  const { toast } = useToast()
  const sessions = useSessionStore((state) => state.sessions);

  const {
    sessionLogs,
    exportSessionsAsFile,
    exportSessionsAsJson,
    importSessionsFromJson,
    getSessionStats,
    saveSessionsToStorage
  } = useTimerStore()

  const loadStats = async () => {
    try {
      const sessionStats = await getSessionStats()
      setStats(sessionStats)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  React.useEffect(() => {
    loadStats()
  }, [sessionLogs])

  const handleExportFile = () => {
    try {
      exportSessionsAsFile()
      toast({ title: 'Success', description: 'Sessions exported successfully!', type: 'success' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to export sessions', type: 'error' })
    }
  }

  const handleExportJson = async () => {
    try {
      setIsLoading(true)
      const jsonData = await exportSessionsAsJson()
      
      // Copy to clipboard
      await navigator.clipboard.writeText(jsonData)
      toast({ title: 'Success', description: 'Session data copied to clipboard!', type: 'success' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to export session data', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        setIsLoading(true)
        const text = await file.text()
        await importSessionsFromJson(text)
        await saveSessionsToStorage() // Save to localStorage too
        toast({ title: 'Success', description: `Successfully imported ${sessionLogs.length} sessions!`, type: 'success' })
        loadStats() // Refresh stats
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to import sessions. Please check the file format.', type: 'error' })
      } finally {
        setIsLoading(false)
      }
    }
    
    input.click()
  }



  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return 'Never'
    }
  }

  return (
    <div className="space-y-6">
      {/* Session Statistics */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Session Statistics</h3>
        </div>
        
        {stats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalSessions}</div>
              <div className="text-sm text-gray-600">Total Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatTime(stats.totalFocusTime)}</div>
              <div className="text-sm text-gray-600">Focus Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{formatTime(stats.totalBreakTime)}</div>
              <div className="text-sm text-gray-600">Break Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.streakDays}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>No session data available</p>
            <p className="text-sm">Complete your first focus session to see statistics</p>
          </div>
        )}
        
        {stats && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Last session: {formatDate(stats.lastSessionDate)}
            </p>
          </div>
        )}
      </Card>

      {/* Session Management */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Session Data Management</h3>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleExportFile}
              disabled={isLoading || sessionLogs.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export as File
            </Button>
            
            <Button 
              onClick={handleExportJson}
              disabled={isLoading || sessionLogs.length === 0}
              variant="default"
              className="flex items-center gap-2 hover:bg-[#169183] hover:text-white transition-colors"
            >
              <Link2 className="w-4 h-4" />
              Copy to Clipboard
            </Button>
            
            <Button 
              onClick={handleImport}
              disabled={isLoading}
              variant="default"
              className="flex items-center gap-2 hover:bg-[#169183] hover:text-white transition-colors"
            >
              <Upload className="w-4 h-4" />
              Import Sessions
            </Button>
          </div>

        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>• Export: Download your session data as a JSON file</p>
          <p>• Import: Restore sessions from a previously exported file</p>
          <p>• Data is automatically saved to your browser's local storage</p>
        </div>
      </Card>

      {/* Recent Sessions Preview */}
      {/* Irys-powered Sessions Preview */}
      {sessions.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Sessions</h3>
          <div className="space-y-2">
            {sessions.slice(0, 5).map((session: any) => (
              <div key={session.id} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${
                    session.sessionType === 'focus' ? 'bg-blue-500' : 
                    session.sessionType === 'shortBreak' ? 'bg-green-500' : 'bg-orange-500'
                  }`} />
                  <span className="capitalize">{session.sessionType.replace('Break', ' Break')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {formatTime((session.duration ?? 0) * 60)} • {formatDate(new Date(session.endTime || 0).toISOString())}
                  </span>
                  {/* Irys upload status */}
                  {session.irysTxId === undefined ? (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  ) : session.irysTxId ? (
                    <a
                      href={`https://gateway.irys.xyz/${session.irysTxId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-purple-600 hover:underline"
                    >
                      <Link2 className="w-4 h-4" />
                      Irys
                    </a>
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            ))}
            {sessions.length > 5 && (
              <p className="text-sm text-gray-500 text-center pt-2">
                And {sessions.length - 5} more sessions...
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}

export default SessionManager
