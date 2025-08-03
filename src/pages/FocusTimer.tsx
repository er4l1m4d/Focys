import { PomodoroTimer } from '@/components/timer/PomodoroTimer'

export function FocusTimer() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col">
      {/* Header Section */}
      <div className="text-center py-6 px-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#51FED6' }}>
          Focus Session
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Start your focused work session and track your progress
        </p>
      </div>

      {/* Timer Section - Centered and responsive */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <PomodoroTimer />
        </div>
      </div>
    </div>
  )
}
