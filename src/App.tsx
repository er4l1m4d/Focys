import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { ToastProvider } from './components/ui/toast-simple'
import { Web3Provider } from './providers/Web3Provider'
import { Dashboard } from './pages/Dashboard'
import { FocusTimer } from './pages/FocusTimer'
import { Crystals } from './pages/Crystals'
import { Profile } from './pages/Profile'
import { Achievements } from './pages/Achievements'
import { FocysNavigation } from './components/navigation/FocysNavigation'
import useTimerStore from './stores/useTimerStore'
import { useWalletStore } from './stores/useWalletStore'
import { useEffect } from 'react'
import { Wallet, User } from 'lucide-react'

function AppContent() {
  const initializeTimer = useTimerStore((state) => state.resetTimer)
  const { currentProfile } = useWalletStore()

  // Initialize app state
  useEffect(() => {
    initializeTimer()
  }, [initializeTimer])

  return (
    <Router>
      <div className="min-h-screen bg-background">
        {/* Header with App Title and Wallet Status */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Focys
            </Link>
            
            {/* Wallet Status */}
            <div className="flex items-center space-x-2">
              {currentProfile && currentProfile.isConnected ? (
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <User className="h-4 w-4 text-green-700" />
                  <span className="text-sm font-medium text-green-700">{currentProfile.username}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-muted-foreground">
                  <Wallet className="h-4 w-4" />
                  <span className="text-sm">Not Connected</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Navigation */}
        <FocysNavigation />

        {/* Main content */}
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/timer" element={<FocusTimer />} />
            <Route path="/crystals" element={<Crystals />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

function App() {
  return (
    <Web3Provider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </Web3Provider>
  )
}

export default App
