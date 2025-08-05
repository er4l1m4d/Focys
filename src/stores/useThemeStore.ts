import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  updateResolvedTheme: () => void
}

const getSystemTheme = (): 'light' | 'dark' => 
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const applyTheme = (theme: Theme): 'light' | 'dark' => {
  const root = window.document.documentElement
  const isDark = theme === 'dark' || (theme === 'system' && getSystemTheme() === 'dark')
  
  root.classList.toggle('dark', isDark)
  return isDark ? 'dark' : 'light'
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',
      setTheme: (theme: Theme) => {
        const resolvedTheme = applyTheme(theme);
        set({ theme, resolvedTheme });
      },
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        const resolvedTheme = applyTheme(newTheme);
        set({ theme: newTheme, resolvedTheme });
        return resolvedTheme;
      },
      updateResolvedTheme: () => {
        const { theme } = get();
        const resolvedTheme = applyTheme(theme);
        set({ resolvedTheme });
        return resolvedTheme;
      },
    }),
    {
      name: 'focys-theme',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.updateResolvedTheme()
        }
      },
    }
  )
)

// Create a custom hook to handle theme initialization
export const useThemeInitializer = () => {
  const updateResolvedTheme = useThemeStore(state => state.updateResolvedTheme)
  const theme = useThemeStore(state => state.theme)

  useEffect(() => {
    // Initialize theme on mount
    updateResolvedTheme()
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        updateResolvedTheme()
      }
    }
    
    mediaQuery.addEventListener('change', handleSystemThemeChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [theme, updateResolvedTheme])
}

// Initialize theme on store creation
if (typeof window !== 'undefined') {
  useThemeStore.getState().updateResolvedTheme()
}
