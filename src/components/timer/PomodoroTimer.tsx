import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import useTimerStore from '@/stores/useTimerStore'

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

  return (
    <div className="flex flex-col items-center justify-center space-y-6 sm:space-y-8 p-4 sm:p-6 max-w-lg mx-auto">
      {/* Timer Circle - Responsive sizing */}
      <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 flex items-center justify-center">
        {/* Circular progress background */}
        <div className="absolute w-full h-full rounded-full border-4 sm:border-6 border-gray-200 dark:border-gray-700">
          <div 
            className="absolute top-0 left-0 w-full h-full rounded-full border-4 sm:border-6 transition-all duration-1000 ease-linear"
            style={{
              backgroundColor: '#51FED6',
              clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((progress * 3.6 - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((progress * 3.6 - 90) * Math.PI / 180)}%, 50% 50%)`,
              borderRadius: '50%',
            }}
          />
        </div>
        
        {/* Timer display - Responsive text */}
        <div className="flex flex-col items-center z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 justify-center border-2 border-white/20 shadow-lg">
          <span className="text-3xl sm:text-4xl lg:text-5xl font-bold" style={{ color: '#51FED6' }}>
            {formatTime(timeLeft)}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 font-medium text-center px-2">
            {currentRound % 2 === 0 ? '🧘 Break Time' : '🎯 Focus Mode'}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Round {Math.ceil(currentRound / 2)} of {totalRounds / 2}
          </span>
        </div>
      </div>

      {/* Controls - Mobile-optimized touch targets */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-sm">
        {!isRunning ? (
          <Button 
            onClick={startTimer} 
            className="w-full sm:flex-1 h-12 sm:h-10 text-base sm:text-sm font-semibold shadow-lg"
            style={{ backgroundColor: '#51FED6', color: 'white' }}
          >
            ▶️ Start Focus
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={pauseTimer} 
            className="w-full sm:flex-1 h-12 sm:h-10 text-base sm:text-sm font-semibold border-2 hover:bg-gray-50"
            style={{ borderColor: '#51FED6', color: '#51FED6' }}
          >
            ⏸️ Pause
          </Button>
        )}
        <div className="flex gap-3 sm:gap-2">
          <Button 
            variant="outline" 
            onClick={resetTimer} 
            className="flex-1 sm:px-4 h-12 sm:h-10 text-base sm:text-sm border-2 border-gray-200 hover:bg-gray-50"
          >
            🔄 Reset
          </Button>
          <Button 
            variant="outline" 
            onClick={nextSession} 
            className="flex-1 sm:px-4 h-12 sm:h-10 text-base sm:text-sm border-2 border-gray-200 hover:bg-gray-50"
          >
            ⏭️ Skip
          </Button>
        </div>
      </div>

      {/* Progress bar - Enhanced mobile layout */}
      <div className="w-full max-w-sm">
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span className="font-medium">Session Progress</span>
          <span className="font-bold" style={{ color: '#51FED6' }}>{Math.round(100 - progress)}% Complete</span>
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
    </div>
  )
}
