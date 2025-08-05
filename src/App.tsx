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
import { useThemeStore } from './stores/useThemeStore'
import { useWalletStore } from './stores/useWalletStore'
import { ThemeToggle } from './components/theme/ThemeToggle'

function AppContent() {
  const isConnected = useWalletStore((state) => state.isConnected);
  const resetTimer = useTimerStore(state => state.resetTimer);
  
  // Get theme state and actions
  const { theme, resolvedTheme } = useThemeStore();

  // Initialize timer on mount
  useEffect(() => {
    resetTimer();
  }, [resetTimer]);

  // Apply theme classes to root element
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    
    // Remove any existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add the current theme class if available
    if (resolvedTheme) {
      root.classList.add(resolvedTheme);
    }
  }, [resolvedTheme]);
  
  // Initialize theme on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Set initial theme based on system preference if using 'system' theme
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      }
    };
    
    // Set initial theme
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', systemTheme === 'dark');
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        {/* Show navigation with integrated logo if connected and not on landing page */}
        {isConnected && window.location.pathname !== '/' && (
          <FocysNavigation />
        )}
        
        {/* Show minimal header only on landing page */}
        {(!isConnected || window.location.pathname === '/') && (
          <header className="border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <Link to="/" className="text-2xl font-outfit font-bold" style={{ color: '#169183' }}>
                Focys
              </Link>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                {isConnected && <UserProfile />}
              </div>
            </div>
          </header>
        )}

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
