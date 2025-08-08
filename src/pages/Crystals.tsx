import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CrystalCollection from "../components/gamification/CrystalCollection"
import Achievements from "../components/gamification/Achievements"
import { DataShards } from "../components/gamification/DataShards"

export function Crystals() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#169183] dark:text-[#169183] mb-2">Crystal Collection & Data Shards</h1>
        <p className="text-black dark:text-white">Manage your crystals, collect Data Shards, and view your achievements</p>
      </div>
      
      <CrystalCollection />
      
      {/* Achievements */}
      <Achievements />
    </div>
  )
}
