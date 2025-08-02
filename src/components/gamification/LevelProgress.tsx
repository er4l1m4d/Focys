import React from 'react'
import { Progress } from '../ui/progress'
import { Card } from '../ui/card'
import { Star, Zap } from 'lucide-react'
import useGamificationStore from '../../stores/useGamificationStore'

const LevelProgress: React.FC = () => {
  const {
    level,
    totalXp,
    getXpProgress,
    getNextLevelXp,
    getCurrentLevel
  } = useGamificationStore()

  const progressPercentage = getXpProgress()
  const nextLevelXp = getNextLevelXp()
  const currentLevelXp = level === 1 ? 0 : totalXp - Math.floor(progressPercentage / 100 * nextLevelXp)

  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-bold">
            {level}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Level {level}</h3>
            <p className="text-xs text-gray-600">Focus Master</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-yellow-600">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-medium">{totalXp.toLocaleString()} XP</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Progress to Level {level + 1}</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        
        <Progress 
          value={progressPercentage} 
          className="h-2 bg-gray-200"
        />
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>{Math.floor(progressPercentage / 100 * nextLevelXp)} XP</span>
          <span>{nextLevelXp} XP</span>
        </div>
      </div>

      {progressPercentage > 80 && (
        <div className="mt-3 flex items-center gap-1 text-purple-600 text-xs">
          <Zap className="w-3 h-3" />
          <span>Almost there! Keep focusing to level up!</span>
        </div>
      )}
    </Card>
  )
}

export default LevelProgress
