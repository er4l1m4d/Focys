import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import useTimerStore from '@/stores/useTimerStore'
import { IconTargetArrow } from "@tabler/icons-react"
import { X } from 'lucide-react'
import { IconYoga } from "@tabler/icons-react"
import useFullscreen from '@/hooks/useFullscreen'
import { cn } from '@/lib/utils'


export function PomodoroTimer() {
  const {
    isRunning,
    timeLeft,
    currentRound,
    totalRounds,
    startTimer,
    pauseTimer,
    resetTimer,
    nextSession,
    formatTime,
  } = useTimerStore()
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        const { timeLeft: currentTimeLeft } = useTimerStore.getState()
        if (currentTimeLeft <= 0) {
          clearInterval(timerRef.current!)
          useTimerStore.getState().completeSession()
          // Show notification
          if (Notification.permission === 'granted') {
            new Notification('Session Complete!', {
              body: currentRound % 2 === 0 ? 'Time for a break!' : 'Time to focus!',
              icon: '/favicon.ico',
            })
          }
        } else {
          useTimerStore.getState().tick()
        }
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRunning, currentRound])

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission()
    }
  }, [])

  const progress = ((useTimerStore.getState().timeLeft / (useTimerStore.getState().currentRound % 2 === 0 ? 300 : 1500)) * 100)

  // Calculate the circle circumference and offset for the SVG stroke
  const radius = 120; // Increased for smoother animation
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Fullscreen functionality
  const fullscreenRef = useRef<HTMLDivElement>(null)
  const [showExitModal, setShowExitModal] = useState(false)
  const {
    isFullscreen,
    isSupported,
    enter,
    exit,
    error: fullscreenError,
  } = useFullscreen()

  // Handle fullscreen state changes
  useEffect(() => {
    if (isRunning && isSupported && !isFullscreen) {
      // Small delay to allow UI to update before entering fullscreen
      const timer = setTimeout(() => {
        if (fullscreenRef.current) {
          enter(fullscreenRef.current).catch(console.error)
        }
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isRunning, isSupported, enter, isFullscreen])

  const handleExitFocus = () => {
    setShowExitModal(true)
  }

  const confirmExitFocus = () => {
    setShowExitModal(false)
    pauseTimer()
    resetTimer() // Reset the timer to initial state
    exit().catch(console.error)
  }

  const cancelExitFocus = () => {
    setShowExitModal(false)
  }

  // Handle Escape key to show exit modal
  useEffect(() => {
    if (!isFullscreen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleExitFocus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  // Show error if fullscreen fails
  useEffect(() => {
    if (fullscreenError) {
      console.error('Fullscreen error:', fullscreenError)
      // You might want to show a toast notification here
    }
  }, [fullscreenError])

  return (
    <div 
      ref={fullscreenRef}
      className={cn(
        "relative flex flex-col items-center justify-start w-full max-w-2xl mx-auto",
        isFullscreen 
          ? "min-h-screen bg-background pt-8 px-4" 
          : "py-8 px-4"
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Header Section - shown in both normal and fullscreen modes */}
      <div className={cn("text-center w-full mb-2")}>
        <h1 
          className={cn(
            "text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 text-[#169183]"
          )}
        >
          Focus Session
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Start your focused work session and track your progress
        </p>
      </div>
      
      {/* Exit button - only shown in fullscreen */}
      {isFullscreen && (
        <button
          onClick={handleExitFocus}
          className="absolute top-2 right-2 p-2 rounded-full hover:bg-[#169183]/20 dark:hover:bg-[#169183]/30 transition-colors"
          aria-label="Exit focus mode"
        >
          <X className="w-5 h-5 text-[#169183] dark:text-[#169183]" />
        </button>
      )}

      {/* Timer Circle - Responsive sizing */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 flex items-center justify-center">
        {/* Circular progress SVG */}
        <svg 
          className="absolute w-full h-full transform -rotate-90"
          viewBox="0 0 300 300"
        >
          {/* Background circle */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            className="stroke-gray-200 dark:stroke-gray-700"
            strokeWidth="12"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            className="transition-all duration-1000 ease-in-out stroke-[#169183]"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              filter: 'drop-shadow(0 0 8px rgba(22, 145, 131, 0.4))',
              transitionProperty: 'stroke-dashoffset',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </svg>
        
        {/* Timer display - Responsive text */}
        <div className="flex flex-col items-center justify-center z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 border-2 border-white/20 shadow-lg">
          <span className="text-3xl sm:text-4xl lg:text-5xl font-bold" style={{ color: '#169183' }}>
            {formatTime(timeLeft)}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 font-medium text-center px-2">
            {currentRound % 2 === 0 ? (
              <>
                <IconYoga size={20} className="inline-block mr-2 text-foreground" />
                <span className="text-foreground">Break Time</span>
              </>
            ) : (
              <>
                <IconTargetArrow size={20} className="inline-block mr-2 text-foreground" />
                <span className="text-foreground">Focus Mode</span>
              </>
            )}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Round {Math.ceil(currentRound / 2)} of {totalRounds / 2}
          </span>
        </div>
      </div>

      {/* Controls - Mobile-optimized touch targets */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-sm mt-4">
        {!isRunning ? (
          <Button 
            onClick={startTimer} 
            className="w-full sm:flex-1 h-12 sm:h-10 text-base sm:text-sm font-semibold border-2 bg-transparent"
            style={{ backgroundColor: '#169183', borderColor: '#169183', color: 'white' }}
          >
            Start Focus
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={pauseTimer} 
            className="w-full sm:flex-1 h-12 sm:h-10 text-base sm:text-sm font-semibold border-2 bg-transparent"
            style={{ borderColor: '#169183', color: '#169183' }}
          >
            Pause
          </Button>
        )}
        <div className="flex gap-3 sm:gap-2">
          <Button 
            variant="outline" 
            onClick={resetTimer} 
            className="flex-1 sm:px-4 h-12 sm:h-10 text-base sm:text-sm border-2 bg-transparent"
            style={{ borderColor: '#169183', color: '#169183' }}
          >
            Reset
          </Button>           
          <Button 
            variant="outline" 
            onClick={nextSession} 
            className="flex-1 sm:px-4 h-12 sm:h-10 text-base sm:text-sm border-2 bg-transparent"
            style={{ borderColor: '#169183', color: '#169183' }}
          >
            Skip
          </Button>
        </div>
      </div>

      {/* Progress bar - Enhanced mobile layout */}
      <div className="w-full max-w-sm mt-8">
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span className="font-medium">Session Progress</span>
          <span className="font-bold" style={{ color: '#169183' }}>{Math.round(100 - progress)}% Complete</span>
        </div>
        <Progress 
          value={100 - progress} 
          className="h-3 sm:h-2 bg-gray-200 dark:bg-gray-700" 
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-1">
          <span>Started</span>
          <span>Finished</span>
        </div>
      </div>
      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl p-6 max-w-sm w-full mx-4 border border-border shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-foreground">End Your Focus Session?</h3>
            <p className="text-muted-foreground mb-6">
              You're in the middle of a focus session. Leaving now will end your session.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={cancelExitFocus}
                variant="outline"
                className="flex-1 border-[#169183] text-[#169183] hover:bg-[#169183]/10 dark:border-[#169183] dark:text-[#169183] dark:hover:bg-[#169183]/20"
              >
                Stay Focused
              </Button>
              <Button
                onClick={confirmExitFocus}
                variant="destructive"
                className="flex-1"
              >
                End Session
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
