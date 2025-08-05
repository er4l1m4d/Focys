'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '../ui/button';
import { useThemeStore } from '@/stores/useThemeStore';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  
  // Ensure the component is mounted before rendering to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        aria-label="Toggle theme"
      />
    );
  }
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-full bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent border-none shadow-none"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
