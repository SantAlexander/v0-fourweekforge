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
              {t('dashboard.welcome')} {user.name.split(' ')[0]}
            </h1>
            <p className="text-sm text-muted-foreground">
              {activePlans.length === 0
                ? t('dashboard.startSubtitle')
                : t('dashboard.learningSubtitle').replace('{hobby}', firstActivePlan?.hobby?.name || '')}
            </p>
          </div>

          {/* PRIMARY SECTION — Continue Plan / Create Plan */}
          {activePlans.length === 0 ? (
            <div className="mb-12 p-8 rounded-lg border text-center space-y-4">
              <h2 className="hierarchy-primary">{t('dashboard.createFirst') || 'Ready to start learning?'}</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {t('dashboard.createFirstDesc') || 'Choose any hobby and we\'ll create a 4-week learning plan just for you.'}
              </p>
              <Link href="/planner">
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  {t('dashboard.createPlan') || 'Create Your First Plan'}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mb-12 p-8 rounded-lg border bg-primary/5 space-y-6">
              <div>
                <h2 className="hierarchy-primary mb-1">{firstActivePlan?.hobby?.name || 'Learning Plan'}</h2>
                <p className="hierarchy-tertiary">Week {Math.ceil((firstActivePlan?.tasks.filter(t => !t.is_completed).length || 1) / 7)} of 4</p>
              </div>
              {nextIncompleteTask && (
                <div className="space-y-2">
                  <p className="hierarchy-tertiary">Next task:</p>
                  <p className="text-xl font-semibold">{nextIncompleteTask.title}</p>
                  {nextIncompleteTask.description && (
                    <p className="text-sm text-muted-foreground">{nextIncompleteTask.description}</p>
                  )}
                </div>
              )}
              <Link href={`/plan/${firstActivePlan?.id}`}>
                <Button size="lg" className="w-full sm:w-auto">
                  Continue Learning
                </Button>
              </Link>
            </div>
          )}

          {/* Achievement Stats Grid — Tertiary Level */}
          {activePlans.length > 0 && (
            <div className="mb-12">
              <p className="hierarchy-tertiary mb-4">Progress</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary">{activePlans.length}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t('dashboard.activePlans') || 'Active Plans'}</p>
                    </div>
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-2xl font-bold text-accent">{completedPlans.length}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t('dashboard.completedPlans') || 'Completed'}</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-2xl font-bold">{completedTasks}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t('dashboard.tasksCompleted') || 'Tasks Done'}</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-2xl font-bold">{totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%</p>
                      <p className="text-xs text-muted-foreground mt-1">{t('dashboard.progress') || 'Overall'}</p>
                    </div>
                    <Target className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
            </div>
          )}

          {/* Active Plans Grid — Secondary level */}
          {activePlans.length > 0 && (
            <div className="mb-12">
              <p className="hierarchy-tertiary mb-4">All plans</p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activePlans.map(plan => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </div>
          )}

          {/* Completed Plans */}
          {completedPlans.length > 0 && (
            <div className="mb-12">
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
