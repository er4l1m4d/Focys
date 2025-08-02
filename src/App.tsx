import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { ToastProvider } from './components/ui/toast-simple'
import { Dashboard } from './pages/Dashboard'
import { FocusTimer } from './pages/FocusTimer'
import { Crystals } from './pages/Crystals'
import { Profile } from './pages/Profile'
import { Button } from './components/ui/button'
import useTimerStore from './stores/useTimerStore'
import { useEffect } from 'react'

function App() {
  const initializeTimer = useTimerStore((state) => state.resetTimer)

  // Initialize app state
  useEffect(() => {
    initializeTimer()
    // In a real app, you would load the user's wallet address here
    // loadUser('user-wallet-address')
  }, [initializeTimer])

  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-background">
          {/* Navigation */}
          <nav className="border-b border-border bg-card">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <Link to="/" className="text-xl font-bold">
                Focys
              </Link>
              <div className="flex space-x-4">
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
    </ToastProvider>
  )
}

export default App
