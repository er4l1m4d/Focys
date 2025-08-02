import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CrystalCollection from "@/components/gamification/CrystalCollection"
import Achievements from "@/components/gamification/Achievements"

export function Crystals() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Page Header */}
      <Card>
        <CardHeader>
          <CardTitle>Crystals & Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Collect powerful crystals and unlock achievements as you build your focus habits.
          </p>
        </CardContent>
      </Card>

      {/* Crystal Collection */}
      <CrystalCollection />
      
      {/* Achievements */}
      <Achievements />
    </div>
  )
}
