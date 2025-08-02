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
    <div className="flex flex-col items-center justify-center space-y-8 p-6 max-w-md mx-auto">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Circular progress */}
        <div className="absolute w-full h-full rounded-full border-4 border-gray-200">
          <div 
            className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-500 transition-all duration-1000 ease-linear"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
              transform: `rotate(${360 - (progress * 3.6)}deg)`,
              transformOrigin: 'center',
            }}
          />
        </div>
        
        {/* Timer display */}
        <div className="flex flex-col items-center z-10">
          <span className="text-5xl font-bold">
            {formatTime(timeLeft)}
          </span>
          <span className="text-gray-500 mt-2">
            {currentRound % 2 === 0 ? 'Break' : 'Focus'} • Round {Math.ceil(currentRound / 2)}/{totalRounds / 2}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex space-x-4">
        {!isRunning ? (
          <Button onClick={startTimer} className="px-6 py-3">
            Start
          </Button>
        ) : (
          <Button variant="outline" onClick={pauseTimer} className="px-6 py-3">
            Pause
          </Button>
        )}
        <Button variant="outline" onClick={resetTimer} className="px-6 py-3">
          Reset
        </Button>
        <Button variant="outline" onClick={nextSession} className="px-6 py-3">
          Skip
        </Button>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>Progress</span>
          <span>{Math.round(100 - progress)}%</span>
        </div>
        <Progress value={100 - progress} className="h-2" />
      </div>
    </div>
  )
}
