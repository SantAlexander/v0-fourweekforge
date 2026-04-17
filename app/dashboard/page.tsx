'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { useAuth } from '@/lib/auth-context'
import { useI18n } from '@/lib/i18n-context'
import { Header } from '@/components/header'
import { PlanCard } from '@/components/plan-card'
import { OnboardingModal } from '@/components/onboarding-modal'
import { StreakBadge } from '@/components/streak-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Spinner } from '@/components/ui/spinner'
import { PlanWithTasks } from '@/lib/db'
import { Plus } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { t } = useI18n()
  const [isInitializing, setIsInitializing] = useState(true)
  
  const { data, isLoading: plansLoading, mutate } = useSWR<{ plans: PlanWithTasks[] }>(
    user ? '/api/plans' : null,
    fetcher
  )

  useEffect(() => {
    // Initialize database on first load
    const initDb = async () => {
      try {
        await fetch('/api/init-db')
      } catch (e) {
        console.error('Failed to initialize database:', e)
      } finally {
        setIsInitializing(false)
      }
    }
    initDb()
  }, [])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  // Refresh data periodically
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => mutate(), 30000)
      return () => clearInterval(interval)
    }
  }, [user, mutate])

  if (authLoading || isInitializing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Spinner className="h-8 w-8" />
        </main>
      </div>
    )
  }

  if (!user) return null

  const plans = data?.plans || []
  const activePlans = plans.filter(p => p.status === 'active')
  const completedPlans = plans.filter(p => p.status === 'completed')
  const pausedPlans = plans.filter(p => p.status === 'paused')

  const totalTasks = plans.reduce((acc, p) => acc + p.tasks.length, 0)
  const completedTasks = plans.reduce((acc, p) => acc + p.tasks.filter(t => t.is_completed).length, 0)

  const firstActivePlan = activePlans.length > 0 ? activePlans[0] : null
  const nextIncompleteTask = firstActivePlan?.tasks.find(t => !t.is_completed)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <OnboardingModal />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-12">
          {/* PRIMARY FOCUS BLOCK — "What do I do next?" */}
          {activePlans.length === 0 ? (
            <div className="mb-16 p-8 md:p-12 rounded-xl border-2 border-primary/20 bg-card space-y-6 max-w-xl">
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Get started</p>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">Start learning</h1>
                <p className="text-muted-foreground">
                  Choose any hobby. We create a 4-week plan.
                </p>
              </div>
              <Link href="/planner">
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Create plan
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mb-16 p-8 md:p-12 rounded-xl border-2 border-primary bg-card space-y-6 max-w-xl">
              <div className="space-y-1">
                <p className="text-sm font-medium text-primary uppercase tracking-wide">Today</p>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {nextIncompleteTask?.title || 'All tasks done'}
                </h1>
                {nextIncompleteTask?.description && (
                  <p className="text-muted-foreground mt-2">
                    {nextIncompleteTask.description}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{firstActivePlan?.hobby_name}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>{(firstActivePlan?.tasks.filter(t => !t.is_completed).length || 0)} tasks left</span>
              </div>
              
              <Link href={`/plan/${firstActivePlan?.id}`} className="block">
                <Button size="lg" className="w-full">
                  Continue
                </Button>
              </Link>
            </div>
          )}

          {/* Stats — Minimal, supporting signal only */}
          {activePlans.length > 0 && (
            <div className="mb-12 flex items-center gap-6 text-sm text-muted-foreground">
              <span>{completedTasks} of {totalTasks} tasks</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>{activePlans.length} active plan{activePlans.length !== 1 ? 's' : ''}</span>
              {completedPlans.length > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span>{completedPlans.length} completed</span>
                </>
              )}
            </div>
          )}

          {/* Other Plans — De-emphasized, minimal */}
          {activePlans.length > 1 && (
            <div className="mb-8">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Other active plans</p>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 opacity-70 hover:opacity-100 transition-opacity">
                {activePlans.slice(1).map(plan => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </div>
          )}

          {/* Completed Plans — Most de-emphasized */}
          {completedPlans.length > 0 && (
            <div className="opacity-50 hover:opacity-70 transition-opacity">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Completed</p>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {completedPlans.map(plan => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
