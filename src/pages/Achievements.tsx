import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Star, Target, Zap, Calendar, Flame } from "lucide-react"
import useUserStore from "@/stores/useUserStore"

export function Achievements() {
  const { achievements, level, streak, totalSessions, totalFocusTime } = useUserStore()

  const achievementsList = [
    {
      id: 'first_session',
      title: 'First Steps',
      description: 'Complete your first focus session',
      icon: Target,
      unlocked: achievements.first_session || totalSessions > 0,
      progress: Math.min(totalSessions, 1),
      target: 1
    },
    {
      id: 'streak_5',
      title: 'Consistency Champion',
      description: 'Maintain a 5-day focus streak',
      icon: Flame,
      unlocked: achievements.streak_5 || streak >= 5,
      progress: Math.min(streak, 5),
      target: 5
    },
    {
      id: 'level_5',
      title: 'Rising Star',
      description: 'Reach level 5',
      icon: Star,
      unlocked: achievements.level_5 || level >= 5,
      progress: Math.min(level, 5),
      target: 5
    },
    {
      id: 'sessions_25',
      title: 'Focus Master',
      description: 'Complete 25 focus sessions',
      icon: Trophy,
      unlocked: achievements.sessions_25 || totalSessions >= 25,
      progress: Math.min(totalSessions, 25),
      target: 25
    },
    {
      id: 'time_1000',
      title: 'Time Lord',
      description: 'Focus for 1000 minutes total',
      icon: Zap,
      unlocked: achievements.time_1000 || totalFocusTime >= 1000,
      progress: Math.min(totalFocusTime, 1000),
      target: 1000
    },
    {
      id: 'streak_30',
      title: 'Unstoppable',
      description: 'Maintain a 30-day focus streak',
      icon: Calendar,
      unlocked: achievements.streak_30 || streak >= 30,
      progress: Math.min(streak, 30),
      target: 30
    }
  ]

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Achievements
        </h1>
        <p className="text-muted-foreground">
          Track your progress and unlock rewards for your focus journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievementsList.map((achievement) => {
          const Icon = achievement.icon
          const progressPercentage = (achievement.progress / achievement.target) * 100

          return (
            <Card 
              key={achievement.id} 
              className={`transition-all duration-300 ${
                achievement.unlocked 
                  ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg' 
                  : 'border-gray-200 bg-gray-50 opacity-75'
              }`}
            >
              <CardHeader className="text-center pb-2">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white' 
                    : 'bg-gray-300 text-gray-500'
                }`}>
                  <Icon size={32} />
                </div>
                <CardTitle className={`text-lg ${
                  achievement.unlocked ? 'text-purple-700' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>
                
                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{achievement.progress}</span>
                    <span>{achievement.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                          : 'bg-gray-400'
                      }`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                {achievement.unlocked && (
                  <div className="flex items-center justify-center gap-1 text-purple-600 text-sm font-medium">
                    <Trophy size={16} />
                    <span>Unlocked!</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Stats Summary */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-center text-purple-700">Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">{level}</div>
              <div className="text-sm text-muted-foreground">Level</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{totalSessions}</div>
              <div className="text-sm text-muted-foreground">Sessions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m</div>
              <div className="text-sm text-muted-foreground">Focus Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{streak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
