import React from 'react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Trophy, Lock, Star } from 'lucide-react'
import useGamificationStore from '../../stores/useGamificationStore'
import type { Achievement } from '../../stores/useGamificationStore'

interface AchievementCardProps {
  achievement: Achievement
  isUnlocked: boolean
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, isUnlocked }) => {
  const progressPercentage = (achievement.progress / achievement.maxProgress) * 100

  return (
    <div className={`p-3 rounded-lg border transition-all ${
      isUnlocked 
        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-sm' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`text-2xl ${isUnlocked ? 'grayscale-0' : 'grayscale opacity-50'}`}>
          {achievement.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-medium text-sm ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
              {achievement.title}
            </h4>
            {isUnlocked && (
              <Trophy className="w-3 h-3 text-yellow-600" />
            )}
            {!isUnlocked && achievement.progress > 0 && (
              <Badge variant="outline" className="text-xs px-1 py-0">
                {Math.round(progressPercentage)}%
              </Badge>
            )}
          </div>
          
          <p className={`text-xs mb-2 ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
            {achievement.description}
          </p>
          
          {!isUnlocked && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Progress</span>
                <span>{achievement.progress}/{achievement.maxProgress}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-2">
            <Badge 
              variant={achievement.category === 'milestone' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {achievement.category}
            </Badge>
            
            <div className="flex items-center gap-1 text-xs text-yellow-600">
              <Star className="w-3 h-3 fill-current" />
              <span>{achievement.xpReward} XP</span>
            </div>
          </div>
          
          {isUnlocked && achievement.unlockedAt && (
            <p className="text-xs text-gray-500 mt-1">
              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const Achievements: React.FC = () => {
  const {
    getUnlockedAchievements,
    getPendingAchievements,
    unlockedAchievements
  } = useGamificationStore()

  const unlockedList = getUnlockedAchievements()
  const pendingList = getPendingAchievements()

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
            <h3 className="font-semibold text-black dark:text-white">Achievements</h3>
          </div>
          <Badge variant="outline">
            {unlockedList.length}/{unlockedList.length + pendingList.length}
          </Badge>
        </div>
        
        <div className="mt-3 flex gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600">{unlockedList.length}</div>
            <div className="text-gray-600">Unlocked</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{pendingList.length}</div>
            <div className="text-black dark:text-white">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {unlockedList.reduce((sum, achievement) => sum + achievement.xpReward, 0)}
            </div>
            <div className="text-gray-600">XP Earned</div>
          </div>
        </div>
      </Card>

      {/* Unlocked Achievements */}
      {unlockedList.length > 0 && (
        <div>
          <h4 className="font-medium text-black dark:text-white mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
            Unlocked Achievements
          </h4>
          <div className="grid gap-3">
            {unlockedList.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isUnlocked={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Pending Achievements */}
      {pendingList.length > 0 && (
        <div>
          <h4 className="font-medium text-black dark:text-white mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            In Progress
          </h4>
          <div className="grid gap-3">
            {pendingList.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isUnlocked={false}
              />
            ))}
          </div>
        </div>
      )}

      {unlockedList.length === 0 && pendingList.length === 0 && (
        <Card className="p-6 text-center">
          <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-medium text-gray-600 mb-2">No Achievements Yet</h3>
          <p className="text-sm text-gray-500">
            Complete your first focus session to start earning achievements!
          </p>
        </Card>
      )}
    </div>
  )
}

export default Achievements
