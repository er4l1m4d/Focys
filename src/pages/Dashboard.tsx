import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import LevelProgress from "@/components/gamification/LevelProgress"
import useGamificationStore from "@/stores/useGamificationStore"
import { Trophy, Target, Flame } from "lucide-react"

export function Dashboard() {
  const {
    totalSessions,
    consecutiveDays,
    totalFocusMinutes,
    getUnlockedAchievements
  } = useGamificationStore()

  const recentAchievements = getUnlockedAchievements().slice(0, 3)

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Welcome to your Focys dashboard. Track your focus sessions and progress here.
          </p>
          <Button className="w-full sm:w-auto">
            <Target className="w-4 h-4 mr-2" />
            Start Focus Session
          </Button>
        </CardContent>
      </Card>

      {/* Level Progress */}
      <LevelProgress />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{totalSessions}</div>
              <div className="text-sm text-gray-600">Total Sessions</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{consecutiveDays}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{Math.floor(totalFocusMinutes / 60)}h</div>
              <div className="text-sm text-gray-600">Focus Time</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold">Recent Achievements</h3>
          </div>
          <div className="space-y-2">
            {recentAchievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                <span className="text-xl">{achievement.icon}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{achievement.title}</h4>
                  <p className="text-xs text-gray-600">{achievement.description}</p>
                </div>
                <div className="text-xs text-yellow-600 font-medium">
                  +{achievement.xpReward} XP
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
