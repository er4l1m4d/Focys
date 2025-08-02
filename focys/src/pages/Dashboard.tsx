import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome to your Focys dashboard. Track your focus sessions and progress here.</p>
          <Button className="mt-4">Start Focus Session</Button>
        </CardContent>
      </Card>
    </div>
  )
}
