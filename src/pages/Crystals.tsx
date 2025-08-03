import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CrystalCollection from "../components/gamification/CrystalCollection"
import Achievements from "../components/gamification/Achievements"
import { DataShards } from "../components/gamification/DataShards"

export function Crystals() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Crystal Collection & Data Shards</h1>
        <p className="text-gray-600">Manage your crystals, collect Data Shards, and view your achievements</p>
      </div>
      
      <CrystalCollection />
      
      {/* Achievements */}
      <Achievements />
    </div>
  )
}
