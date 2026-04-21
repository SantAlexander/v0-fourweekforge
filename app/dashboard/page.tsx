'use client'

import { useEffect, useState } from 'react'
import type { Plan, Task } from '@/shared/types'
import { Button, Card } from '@/shared/ui'
import { DashboardHeaderWidget, PlanCardWidget } from '@/widgets'
import { DashboardProcess } from '@/processes'

interface DashboardPageProps {
  params: { userId: string }
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const [state, setState] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeDashboard = async () => {
      const dashboardState = await DashboardProcess.initialize(params.userId)
      setState(dashboardState)
      setLoading(false)
    }

    initializeDashboard()
  }, [params.userId])

  if (loading) return <div className="p-6">Loading...</div>
  if (state?.error) return <div className="p-6 text-destructive">{state.error}</div>

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeaderWidget planName="Dashboard" />

      <main className="max-w-6xl mx-auto p-6">
        {/* Today's Task */}
        {state?.todayTask && (
          <Card className="mb-8 border-primary">
            <h2 className="text-xl font-bold mb-2">Today's Task</h2>
            <p className="text-lg">{state.todayTask.title}</p>
            <Button className="mt-4">Continue</Button>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card>
            <div className="text-3xl font-bold">{state?.stats.activePlans}</div>
            <p className="text-sm text-muted-foreground">Active Plans</p>
          </Card>
          <Card>
            <div className="text-3xl font-bold">{state?.stats.completedPlans}</div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </Card>
          <Card>
            <div className="text-3xl font-bold">{state?.stats.completedTasks}</div>
            <p className="text-sm text-muted-foreground">Tasks Done</p>
          </Card>
          <Card>
            <div className="text-3xl font-bold">
              {state?.stats.totalTasks > 0 
                ? Math.round((state.stats.completedTasks / state.stats.totalTasks) * 100)
                : 0}%
            </div>
            <p className="text-sm text-muted-foreground">Progress</p>
          </Card>
        </div>

        {/* Plans Grid */}
        <div>
          <h2 className="text-xl font-bold mb-4">Your Plans</h2>
          <div className="grid grid-cols-3 gap-4">
            {state?.plans.map((plan: Plan) => (
              <PlanCardWidget key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
