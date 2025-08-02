import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PomodoroTimer } from '@/components/timer/PomodoroTimer'

export function FocusTimer() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-8">Focus Session</h1>
        <PomodoroTimer />
      </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
