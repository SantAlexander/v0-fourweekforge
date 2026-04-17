'use client'

import { useEffect, use, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { format, addWeeks, isWithinInterval, startOfDay } from 'date-fns'
import { useAuth } from '@/lib/auth-context'
import { useI18n } from '@/lib/i18n-context'
import { Header } from '@/components/header'
import { WeekTasks } from '@/components/week-tasks'
import { CalendarView } from '@/components/calendar-view'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { getHobbyIcon } from '@/lib/hobby-icons'
import { PlanWithTasks } from '@/lib/db'
import { ExportDropdown } from '@/components/export-dropdown'
import { cn } from '@/lib/utils'
import { ArrowLeft, Calendar, Target, Trash2, Pause, Play, CheckCircle2 } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { t } = useI18n()
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  
  const { data, isLoading, mutate } = useSWR<{ plan: PlanWithTasks }>(
    user ? `/api/plans/${id}` : null,
    fetcher
  )

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  const handleTaskToggle = async (taskId: string, isCompleted: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: isCompleted }),
      })

      if (!response.ok) throw new Error('Failed to update task')

      mutate()
      
      if (isCompleted) {
        toast.success(t('toast.taskCompleted'))
      }
    } catch (error) {
      toast.error('Failed to update task')
      throw error
    }
  }

  const handleStatusChange = async (newStatus: 'active' | 'paused' | 'completed') => {
    try {
      const response = await fetch(`/api/plans/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update status')

      mutate()
      
      if (newStatus === 'paused') {
        toast.success(t('toast.planPaused'))
      } else if (newStatus === 'completed') {
        toast.success(t('toast.planCompleted'))
      } else {
        toast.success(t('toast.planResumed'))
      }
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/plans/${id}`, { method: 'DELETE' })
      
      if (!response.ok) throw new Error('Failed to delete plan')

      toast.success(t('toast.planDeleted'))
      router.push('/dashboard')
    } catch {
      toast.error('Failed to delete plan')
    }
  }

  if (authLoading || isLoading) {
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

  const plan = data?.plan

  if (!plan) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <h2 className="mb-2 text-lg font-semibold">{t('plan.notFound')}</h2>
              <p className="mb-6 text-muted-foreground">
                {t('plan.notFoundSubtitle')}
              </p>
              <Button asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('plan.backToDashboard')}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const Icon = getHobbyIcon(plan.hobby_icon)
  const startDate = new Date(plan.start_date)
  const endDate = addWeeks(startDate, 4)
  const today = startOfDay(new Date())

  // Calculate current week
  let currentWeek = 0
  for (let i = 1; i <= 4; i++) {
    const weekStart = addWeeks(startDate, i - 1)
    const weekEnd = addWeeks(startDate, i)
    if (isWithinInterval(today, { start: weekStart, end: weekEnd })) {
      currentWeek = i
      break
    }
  }
  if (today < startDate) currentWeek = 1
  if (today >= endDate) currentWeek = 4

  const statusColors = {
    active: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
    completed: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
    paused: 'bg-muted text-muted-foreground border-muted',
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('plan.backToDashboard')}
            </Link>
          </Button>

          {/* Plan Context — Minimal header */}
          <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <Icon className="h-4 w-4" />
            </div>
            <span className="font-medium text-foreground">
              {t(`hobby.${plan.hobby_icon}`) !== `hobby.${plan.hobby_icon}` ? t(`hobby.${plan.hobby_icon}`) : plan.hobby_name}
            </span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>{plan.goal}</span>
            <Badge variant="outline" className={cn('ml-auto', statusColors[plan.status])}>
              {plan.status === 'active' && t('planCard.statusActive')}
              {plan.status === 'completed' && t('planCard.statusDone')}
              {plan.status === 'paused' && t('planCard.statusPaused')}
            </Badge>
          </div>

          {/* PRIMARY FOCUS BLOCK — "What do I do next?" */}
          {plan.tasks.filter(t => !t.is_completed).length > 0 && (
            <div className="mb-10 p-8 md:p-10 rounded-xl border-2 border-primary bg-card space-y-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-primary uppercase tracking-wide">{t('plan.nextTask')}</p>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {plan.tasks.find(t => !t.is_completed)?.title || 'No tasks'}
                </h1>
                {plan.tasks.find(t => !t.is_completed)?.description && (
                  <p className="text-muted-foreground mt-2">
                    {plan.tasks.find(t => !t.is_completed)?.description}
                  </p>
                )}
              </div>
              <Button
                onClick={() => {
                  const task = plan.tasks.find(t => !t.is_completed)
                  if (task) handleTaskToggle(task.id, true)
                }}
                size="lg"
                className="gap-2"
              >
                <CheckCircle2 className="h-5 w-5" />
                {t('plan.markComplete')}
              </Button>
            </div>
          )}

          {/* Progress — Minimal, supporting signal */}
          <div className="mb-6 flex items-center gap-4 text-sm text-muted-foreground">
            <span>{t('planner.week')} {currentWeek} {t('plan.weekOf')}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>{format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>{plan.progress}% {t('plan.overallProgress').toLowerCase()}</span>
          </div>

          {/* View Toggle */}
          <div className="mb-6 flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              {t('plan.listView')}
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('calendar')}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {t('plan.calendarView')}
            </Button>
          </div>

          {/* Weekly Tasks or Calendar View */}
          {viewMode === 'list' ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((weekNumber) => (
                <WeekTasks
                  key={weekNumber}
                  weekNumber={weekNumber}
                  tasks={plan.tasks.filter(t => t.week_number === weekNumber)}
                  onTaskToggle={handleTaskToggle}
                />
              ))}
            </div>
          ) : (
            <CalendarView plan={plan} onTaskToggle={handleTaskToggle} />
          )}
        </div>
      </main>
    </div>
  )
}
