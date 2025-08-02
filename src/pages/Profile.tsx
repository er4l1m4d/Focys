import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SessionManager from "@/components/session/SessionManager"

export function Profile() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* User Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                👤
              </div>
              <div>
                <h3 className="text-lg font-medium">User</h3>
                <p className="text-sm text-muted-foreground">Level 1</p>
              </div>
            </div>
            <div className="pt-4">
              <h4 className="font-medium mb-2">Stats</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>XP Progress</span>
                    <span>0/100</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full">
                    <div className="h-full w-0 bg-primary rounded-full"></div>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm">Total Focus Time: 0m</p>
                  <p className="text-sm">Sessions Completed: 0</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Session Management Section */}
      <SessionManager />
    </div>
  )
}
