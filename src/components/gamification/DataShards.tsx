import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Gem, Zap, Trophy, Link, Coins, Sparkles } from 'lucide-react'
import useGamificationStore from '../../stores/useGamificationStore'
import type { DataShard } from '../../stores/useGamificationStore'

interface DataShardCardProps {
  shard: DataShard
}

const DataShardCard: React.FC<DataShardCardProps> = ({ shard }) => {
  const getShardIcon = (type: DataShard['type']) => {
    switch (type) {
      case 'streak': return <Zap className="w-4 h-4" />
      case 'milestone': return <Trophy className="w-4 h-4" />
      case 'web3': return <Link className="w-4 h-4" />
      case 'irys': return <Sparkles className="w-4 h-4" />
      case 'contract': return <Coins className="w-4 h-4" />
      default: return <Gem className="w-4 h-4" />
    }
  }

  const getRarityColor = (rarity: DataShard['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'rare': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'epic': return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'legendary': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card className="p-3 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        {/* Shard Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${getRarityColor(shard.rarity)}`}
              style={{ backgroundColor: `${shard.color}20`, borderColor: shard.color }}
            >
              {getShardIcon(shard.type)}
            </div>
            <div>
              <h4 className="font-medium text-sm">{shard.name}</h4>
              <p className="text-xs text-gray-500">{formatDate(shard.earnedAt)}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-semibold text-purple-600">+{shard.value}</div>
            <Badge variant="outline" className={`text-xs ${getRarityColor(shard.rarity)}`}>
              {shard.rarity}
            </Badge>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600">{shard.description}</p>
      </div>
    </Card>
  )
}

export function DataShards() {
  const { dataShards, totalDataShardValue, earnDataShard } = useGamificationStore()

  // Demo function to earn a sample Data Shard (for testing)
  const earnSampleShard = () => {
    const sampleShard: DataShard = {
      id: `shard_${Date.now()}`,
      name: 'Focus Streak Shard',
      type: 'streak',
      value: 3,
      earnedAt: Date.now(),
      description: 'Earned for completing a 7-day focus streak!',
      rarity: 'rare',
      color: '#3B82F6'
    }
    earnDataShard(sampleShard)
  }

  const getShardsByRarity = () => {
    const grouped = dataShards.reduce((acc, shard) => {
      acc[shard.rarity] = (acc[shard.rarity] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return grouped
  }

  const rarityStats = getShardsByRarity()

  return (
    <div className="space-y-6">
      {/* Data Shards Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gem className="h-5 w-5 text-purple-600" />
            Data Shards Collection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white dark:text-white">
            <div className="text-center">
              <div className="text-2xl font-bold">{dataShards.length}</div>
              <div className="text-xs">Total Shards</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalDataShardValue}</div>
              <div className="text-xs">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{rarityStats.legendary || 0}</div>
              <div className="text-xs">Legendary</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{rarityStats.epic || 0}</div>
              <div className="text-xs">Epic</div>
            </div>
          </div>

          {/* Demo Button */}
          <Button 
            onClick={earnSampleShard}
            variant="outline"
            className="w-full"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Earn Sample Data Shard (Demo)
          </Button>
        </CardContent>
      </Card>

      {/* How to Earn Data Shards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How to Earn Data Shards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Streak Shards</span>
              </div>
              <p className="text-gray-600 ml-6">Complete consecutive daily focus sessions</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">Milestone Shards</span>
              </div>
              <p className="text-gray-600 ml-6">Reach major XP and level milestones</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Link className="w-4 h-4 text-green-500" />
                <span className="font-medium">Web3 Shards</span>
              </div>
              <p className="text-gray-600 ml-6">Connect wallet and complete Web3 actions</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="font-medium">Irys Shards</span>
              </div>
              <p className="text-gray-600 ml-6">Upload session data to permanent storage</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Shards Collection */}
      <Card>
        <CardHeader>
          <CardTitle>Your Data Shards ({dataShards.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {dataShards.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Gem className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No Data Shards yet!</p>
              <p className="text-sm">Complete focus sessions and achievements to earn your first shards.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataShards
                .sort((a, b) => b.earnedAt - a.earnedAt)
                .map((shard) => (
                  <DataShardCard key={shard.id} shard={shard} />
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
