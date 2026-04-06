'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { useAuth } from '@/lib/auth-context'
import { useI18n } from '@/lib/i18n-context'
import { Header } from '@/components/header'
import { PlanCard } from '@/components/plan-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Spinner } from '@/components/ui/spinner'
import { PlanWithTasks } from '@/lib/db'
import { Plus, Flame, Target, CheckCircle2, Clock } from 'lucide-react'

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {t('dashboard.welcome')} {user.name.split(' ')[0]}!
              </h1>
              <p className="text-muted-foreground">
                {t('dashboard.subtitle')}
              </p>
            </div>
            <Button asChild>
              <Link href="/planner">
                <Plus className="mr-2 h-4 w-4" />
                {t('header.newPlan')}
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Flame className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activePlans.length}</p>
                  <p className="text-sm text-muted-foreground">{t('dashboard.activePlans')}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedTasks}</p>
                  <p className="text-sm text-muted-foreground">{t('dashboard.tasksDone')}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10 text-chart-3">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalTasks - completedTasks}</p>
                  <p className="text-sm text-muted-foreground">{t('dashboard.tasksLeft')}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10 text-chart-4">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedPlans.length}</p>
                  <p className="text-sm text-muted-foreground">{t('dashboard.completed')}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plans Tabs */}
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList>
              <TabsTrigger value="active">
                {t('dashboard.active')} ({activePlans.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                {t('dashboard.completed')} ({completedPlans.length})
              </TabsTrigger>
              <TabsTrigger value="paused">
                {t('dashboard.paused')} ({pausedPlans.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {plansLoading ? (
                <div className="flex justify-center py-12">
                  <Spinner className="h-8 w-8" />
                </div>
              ) : activePlans.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                      <Flame className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{t('dashboard.noActivePlans')}</h3>
                    <p className="mb-6 max-w-sm text-muted-foreground">
                      {t('dashboard.noActivePlansSubtitle')}
                    </p>
                    <Button asChild>
                      <Link href="/planner">
                        <Plus className="mr-2 h-4 w-4" />
                        {t('dashboard.createFirstPlan')}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activePlans.map(plan => (
                    <PlanCard key={plan.id} plan={plan} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedPlans.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                      <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{t('dashboard.noCompletedPlans')}</h3>
                    <p className="max-w-sm text-muted-foreground">
                      {t('dashboard.noCompletedPlansSubtitle')}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {completedPlans.map(plan => (
                    <PlanCard key={plan.id} plan={plan} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="paused" className="space-y-4">
              {pausedPlans.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                      <Clock className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{t('dashboard.noPausedPlans')}</h3>
                    <p className="max-w-sm text-muted-foreground">
                      {t('dashboard.noPausedPlansSubtitle')}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pausedPlans.map(plan => (
                    <PlanCard key={plan.id} plan={plan} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
