import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { ToastProvider } from './components/ui/toast-simple'
import { Web3Provider } from './providers/Web3Provider'
import { Dashboard } from './pages/Dashboard'
import Landing from './pages/Landing'
import { FocusTimer } from './pages/FocusTimer'
import { Crystals } from './pages/Crystals'
import { Profile } from './pages/Profile'
import { Achievements } from './pages/Achievements'
import { FocysNavigation } from './components/navigation/FocysNavigation'
import { UserProfile } from './components/profile/UserProfile'
import useTimerStore from './stores/useTimerStore'
import { useEffect } from 'react'

import { useWalletStore } from './stores/useWalletStore'

function AppContent() {
  const isConnected = useWalletStore((state) => state.isConnected);
  const initializeTimer = useTimerStore((state) => state.resetTimer)

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
            <Link to="/" className="text-2xl font-bold" style={{ color: '#51FED6' }}>
              Focys
            </Link>
            {/* Only show UserProfile if connected and not on landing page */}
            {isConnected && window.location.pathname !== '/' && <UserProfile />}
          </div>
        </header>

        {/* Only show navigation if connected and not on landing page */}
        {isConnected && window.location.pathname !== '/' && <FocysNavigation />}

        {/* Main content - Mobile-optimized spacing */}
        <main className="pb-4 sm:pb-6">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={isConnected ? <Dashboard /> : <Landing />} />
            <Route path="/timer" element={<FocusTimer />} />
            <Route path="/crystals" element={<Crystals />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/achievements" element={<Achievements />} />
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
