import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import LevelProgress from "@/components/gamification/LevelProgress"
import useGamificationStore from "@/stores/useGamificationStore"
import useUserStore from "@/stores/useUserStore"
import { Trophy, Target, Flame } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function Dashboard() {
  const {
    totalSessions,
    consecutiveDays,
    totalFocusMinutes,
    getUnlockedAchievements
  } = useGamificationStore()

  const { username } = useUserStore()
  const recentAchievements = getUnlockedAchievements().slice(0, 3)
  const navigate = useNavigate()

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-6xl">
      {/* Welcome Section - Enhanced mobile layout */}
      <div className="text-center py-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-[#169183]">
          Welcome to Focys{username ? `, ${username}` : ''}
        </h1>
        <p className="text-sm sm:text-base text-foreground/80 mb-6 max-w-2xl mx-auto">
          Track your focus sessions, earn XP, and build your focus streak. Your journey to better productivity starts here.
        </p>
        <Button 
          onClick={() => navigate('/timer')}
          className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm font-semibold shadow-lg px-8 bg-[#169183] hover:bg-[#0e6b5f] text-white"
        >
          <Target className="w-5 h-5 mr-2" />
          Start Focus Session
        </Button>
      </div>

      {/* Level Progress */}
      <LevelProgress />

      {/* Quick Stats - Enhanced mobile cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6 border-2 border-blue-100 hover:border-blue-200 dark:border-blue-900/30 dark:hover:border-blue-800/50 transition-colors bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{totalSessions}</div>
              <div className="text-sm sm:text-base text-foreground/80 font-medium">Total Sessions</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 border-2 border-orange-100 hover:border-orange-200 dark:border-orange-900/30 dark:hover:border-orange-800/50 transition-colors bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-900/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">{consecutiveDays}</div>
              <div className="text-sm sm:text-base text-foreground/80 font-medium">Day Streak</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 border-2 border-green-100 hover:border-green-200 dark:border-green-900/30 dark:hover:border-green-800/50 transition-colors bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-900/10 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">{Math.floor(totalFocusMinutes / 60)}h</div>
              <div className="text-sm sm:text-base text-foreground/80 font-medium">Focus Time</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Achievements - Enhanced mobile layout */}
      {recentAchievements.length > 0 && (
        <Card className="p-4 sm:p-6 border-2 border-yellow-100 bg-gradient-to-br from-yellow-50 to-amber-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-yellow-700 dark:text-yellow-400">Recent Achievements</h3>
          </div>
          <div className="space-y-3">
            {recentAchievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-4 p-3 sm:p-4 bg-white/80 rounded-xl border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-2xl sm:text-3xl">{achievement.icon}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base text-foreground truncate">{achievement.title}</h4>
                  <p className="text-xs sm:text-sm text-foreground/80 line-clamp-2">{achievement.description}</p>
                </div>
                <div className="text-sm sm:text-base text-yellow-600 dark:text-yellow-400 font-bold bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
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
