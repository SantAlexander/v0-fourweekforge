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

  const firstActivePlan = activePlans.length > 0 ? activePlans[0] : null
  const nextIncompleteTask = firstActivePlan?.tasks.find(t => !t.is_completed)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <OnboardingModal />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              {t('dashboard.welcome')} {user.name.split(' ')[0]}
            </h1>
            <p className="text-lg text-muted-foreground">
              {activePlans.length === 0
                ? t('dashboard.startSubtitle')
                : t('dashboard.learningSubtitle').replace('{hobby}', firstActivePlan?.hobby?.name || '')}
            </p>
          </div>

          {/* Primary CTA Section - "What to do next" */}
          {activePlans.length === 0 ? (
            <Card className="mb-12 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                  <Plus className="h-10 w-10 text-primary" />
                </div>
                <h2 className="mb-2 text-2xl font-bold">{t('dashboard.createFirstPlanTitle')}</h2>
                <p className="mb-8 max-w-sm text-muted-foreground">
                  {t('dashboard.createFirstPlanDesc')}
                </p>
                <Button size="lg" asChild>
                  <Link href="/planner">{t('header.newPlan')}</Link>
                </Button>
              </CardContent>
            </Card>
          ) : nextIncompleteTask ? (
            <Card className="mb-12 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm font-semibold text-primary mb-1">{t('dashboard.nextTask')}</p>
                    <h2 className="text-2xl font-bold mb-2">{nextIncompleteTask.title}</h2>
                    <p className="text-muted-foreground">{nextIncompleteTask.description}</p>
                  </div>
                  <Button size="lg" asChild className="w-full sm:w-auto">
                    <Link href={`/dashboard`}>{t('dashboard.startTask')}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-12 border-2 border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">{t('dashboard.planCompletedTitle')}</h2>
                <p className="text-muted-foreground mb-6">{t('dashboard.planCompletedDesc')}</p>
                <Button size="lg" asChild>
                  <Link href="/planner">{t('header.newPlan')}</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Progress Overview */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-4">{t('dashboard.progressTitle')}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{t('dashboard.activePlansLabel')}</p>
                      <p className="text-4xl font-bold">{activePlans.length}</p>
                    </div>
                    <Flame className="h-8 w-8 text-primary opacity-20" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{t('dashboard.tasksCompletedWeek')}</p>
                      <p className="text-4xl font-bold">{completedTasks}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {totalTasks > 0
                      ? t('dashboard.progressMessage').replace('{percent}', String(Math.round((completedTasks / totalTasks) * 100)))
                      : '—'}
                  </p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </div>
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
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {plansLoading ? (
                <div className="flex justify-center py-12">
                  <Spinner className="h-8 w-8" />
                </div>
              ) : activePlans.length === 0 ? null : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{t('dashboard.weeklyNote')}</p>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {activePlans.map(plan => (
                      <PlanCard key={plan.id} plan={plan} />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedPlans.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
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
          </Tabs>
        </div>
      </main>
    </div>
  )
}
