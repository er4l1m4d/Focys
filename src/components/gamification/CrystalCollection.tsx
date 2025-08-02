import React from 'react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Gem, Star, Zap, Crown, Sparkles } from 'lucide-react'
import useGamificationStore from '../../stores/useGamificationStore'
import type { Crystal } from '../../stores/useGamificationStore'

interface CrystalCardProps {
  crystal: Crystal
  isActive: boolean
  onActivate: (crystalId: string) => void
}

const CrystalCard: React.FC<CrystalCardProps> = ({ crystal, isActive, onActivate }) => {
  const getTypeIcon = (type: Crystal['type']) => {
    switch (type) {
      case 'focus': return <Zap className="w-4 h-4" />
      case 'energy': return <Sparkles className="w-4 h-4" />
      case 'wisdom': return <Crown className="w-4 h-4" />
      case 'rare': return <Gem className="w-4 h-4" />
      default: return <Star className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: Crystal['type']) => {
    switch (type) {
      case 'focus': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'energy': return 'text-green-600 bg-green-50 border-green-200'
      case 'wisdom': return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'rare': return 'text-orange-600 bg-orange-50 border-orange-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const xpProgress = crystal.xpToNext > 0 ? (crystal.totalXp / crystal.xpToNext) * 100 : 100

  return (
    <Card className={`p-4 transition-all cursor-pointer ${
      isActive 
        ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
        : 'hover:shadow-md border-gray-200'
    }`}>
      <div className="space-y-3">
        {/* Crystal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${getTypeColor(crystal.type)}`}
              style={{ backgroundColor: `${crystal.color}20`, borderColor: crystal.color }}
            >
              {getTypeIcon(crystal.type)}
            </div>
            <div>
              <h4 className="font-medium text-sm">{crystal.name}</h4>
              <p className="text-xs text-gray-500">Level {crystal.level}</p>
            </div>
          </div>
          
          {isActive && (
            <Badge variant="default" className="text-xs">
              Active
            </Badge>
          )}
        </div>

        {/* Crystal Description */}
        <p className="text-xs text-gray-600 leading-relaxed">
          {crystal.description}
        </p>

        {/* XP Progress */}
        {crystal.xpToNext > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>XP Progress</span>
              <span>{crystal.totalXp}/{crystal.xpToNext}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(xpProgress, 100)}%`,
                  backgroundColor: crystal.color 
                }}
              />
            </div>
          </div>
        )}

        {/* Abilities */}
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-gray-700">Abilities</h5>
          <div className="flex flex-wrap gap-1">
            {crystal.abilities.map((ability, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                {ability}
              </Badge>
            ))}
          </div>
        </div>

        {/* Activate Button */}
        {!isActive && (
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full text-xs"
            onClick={() => onActivate(crystal.id)}
          >
            Activate Crystal
          </Button>
        )}

        {/* Crystal Stats */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Unlocked</span>
            <span>{new Date(crystal.unlockedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

const CrystalCollection: React.FC = () => {
  const {
    crystals,
    activeCrystal,
    setActiveCrystal
  } = useGamificationStore()

  const activeCrystalData = crystals.find(c => c.id === activeCrystal)

  return (
    <div className="space-y-6">
      {/* Active Crystal Summary */}
      {activeCrystalData && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg"
              style={{ backgroundColor: activeCrystalData.color }}
            >
              <Gem className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">
                {activeCrystalData.name} (Active)
              </h3>
              <p className="text-sm text-gray-600">
                Level {activeCrystalData.level} • {activeCrystalData.type} type
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs text-gray-600">
                  {activeCrystalData.totalXp} XP
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Crystal Collection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Gem className="w-5 h-5 text-purple-600" />
            Crystal Collection
          </h3>
          <Badge variant="outline">
            {crystals.length} Crystal{crystals.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {crystals.map((crystal) => (
            <CrystalCard
              key={crystal.id}
              crystal={crystal}
              isActive={crystal.id === activeCrystal}
              onActivate={setActiveCrystal}
            />
          ))}
        </div>
      </div>

      {/* Collection Stats */}
      <Card className="p-4">
        <h4 className="font-medium text-gray-800 mb-3">Collection Stats</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">
              {crystals.filter(c => c.type === 'focus').length}
            </div>
            <div className="text-xs text-gray-600">Focus</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              {crystals.filter(c => c.type === 'energy').length}
            </div>
            <div className="text-xs text-gray-600">Energy</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">
              {crystals.filter(c => c.type === 'wisdom').length}
            </div>
            <div className="text-xs text-gray-600">Wisdom</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600">
              {crystals.filter(c => c.type === 'rare').length}
            </div>
            <div className="text-xs text-gray-600">Rare</div>
          </div>
        </div>
      </Card>

      {crystals.length === 0 && (
        <Card className="p-6 text-center">
          <Gem className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-medium text-gray-600 mb-2">No Crystals Yet</h3>
          <p className="text-sm text-gray-500">
            Complete focus sessions and achievements to discover new crystals!
          </p>
        </Card>
      )}
    </div>
  )
}

export default CrystalCollection
