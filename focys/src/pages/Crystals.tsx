import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Crystals() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Crystals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Placeholder for crystal collection */}
            <div className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-4xl">💎</span>
            </div>
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center opacity-50">
              <span className="text-4xl">🔒</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
