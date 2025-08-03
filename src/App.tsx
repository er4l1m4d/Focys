import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { ToastProvider } from './components/ui/toast-simple'
import { Web3Provider } from './providers/Web3Provider'
import { Dashboard } from './pages/Dashboard'
import { FocusTimer } from './pages/FocusTimer'
import { Crystals } from './pages/Crystals'
import { Profile } from './pages/Profile'
import { Button } from './components/ui/button'
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
        {/* Navigation */}
        <nav className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">
              Focys
            </Link>
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost">
                <Link to="/">Dashboard</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/timer">Focus Timer</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/crystals">Crystals</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/profile">Profile</Link>
              </Button>
              
              {/* Wallet Status */}
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-border">
                {currentProfile && currentProfile.isConnected ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{currentProfile.username}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Wallet className="h-4 w-4" />
                    <span className="text-sm">Not Connected</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/timer" element={<FocusTimer />} />
            <Route path="/crystals" element={<Crystals />} />
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
