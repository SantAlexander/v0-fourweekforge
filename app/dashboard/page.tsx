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
import { Plus, Flame, Target, CheckCircle2, Clock, TrendingUp } from 'lucide-react'

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
          {/* Welcome Section — Tertiary Level (small, context) */}
          <div className="mb-12 space-y-2">
            <h1 className="hierarchy-tertiary">
              Learning progress
            </h1>
            <p className="text-sm text-muted-foreground">
              {activePlans.length === 0
                ? 'No plans yet. Start one to begin.'
                : `${completedTasks} of ${totalTasks} tasks completed`}
            </p>
          </div>

          {/* PRIMARY SECTION — Continue Plan / Create Plan */}
          {activePlans.length === 0 ? (
            <div className="mb-12 p-10 md:p-12 rounded-lg border bg-primary/5 text-center space-y-4 max-w-2xl">
              <h2 className="hierarchy-primary">Start learning</h2>
              <p className="hierarchy-secondary max-w-md mx-auto">
                Choose any hobby and we'll create a 4-week learning plan for you.
              </p>
              <Link href="/planner">
                <Button size="lg" className="gap-2 mt-4">
                  <Plus className="h-5 w-5" />
                  Create plan
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mb-12 p-10 md:p-12 rounded-lg border-2 border-primary bg-primary/5 space-y-6 max-w-2xl">
              <div className="space-y-1">
                <h2 className="hierarchy-primary mb-2">{firstActivePlan?.hobby?.name || 'Learning'}</h2>
                <p className="hierarchy-secondary">
                  Week {Math.ceil((firstActivePlan?.tasks.filter(t => !t.is_completed).length || 1) / 7)} of 4 • {nextIncompleteTask ? `${(firstActivePlan?.tasks.filter(t => !t.is_completed).length || 0)} task${(firstActivePlan?.tasks.filter(t => !t.is_completed).length || 0) !== 1 ? 's' : ''} left` : 'Complete'}
                </p>
              </div>
              
              {nextIncompleteTask && (
                <div className="space-y-2 pt-4 border-t border-primary/20">
                  <p className="hierarchy-tertiary">Today</p>
                  <p className="text-lg font-bold">{nextIncompleteTask.title}</p>
                </div>
              )}
              
              <Link href={`/plan/${firstActivePlan?.id}`} className="block">
                <Button size="lg" className="w-full">
                  Continue
                </Button>
              </Link>
            </div>
          )}

          {/* Achievement Stats Grid — SECONDARY Level */}
          {activePlans.length > 0 && (
            <div className="mb-12">
              <p className="hierarchy-tertiary mb-4">Stats</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 rounded-lg border bg-muted/50 space-y-2">
                  <p className="text-lg font-bold text-primary">{activePlans.length}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>

                <div className="p-4 rounded-lg border bg-muted/50 space-y-2">
                  <p className="text-lg font-bold text-accent">{completedPlans.length}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>

                <div className="p-4 rounded-lg border bg-muted/50 space-y-2">
                  <p className="text-lg font-bold">{completedTasks}</p>
                  <p className="text-xs text-muted-foreground">Tasks done</p>
                </div>

                <div className="p-4 rounded-lg border bg-muted/50 space-y-2">
                  <p className="text-lg font-bold">{totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%</p>
                  <p className="text-xs text-muted-foreground">Overall</p>
                </div>
              </div>
            </div>
          )}

          {/* Active Plans Grid — TERTIARY Level */}
          {activePlans.length > 1 && (
            <div className="mb-12">
              <p className="hierarchy-tertiary mb-4">Other plans</p>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {activePlans.slice(1).map(plan => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </div>
          )}

          {/* Completed Plans */}
          {completedPlans.length > 0 && (
            <div>
              <p className="hierarchy-tertiary mb-4">Completed</p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
