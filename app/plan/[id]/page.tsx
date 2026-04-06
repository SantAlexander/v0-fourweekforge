'use client'

import { useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { format, addWeeks, isWithinInterval, startOfDay } from 'date-fns'
import { useAuth } from '@/lib/auth-context'
import { Header } from '@/components/header'
import { WeekTasks } from '@/components/week-tasks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
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
import { ArrowLeft, Calendar, Target, Trash2, Pause, Play, CheckCircle2 } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  
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
        toast.success('Task completed!')
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
      toast.success(`Plan ${newStatus === 'paused' ? 'paused' : newStatus === 'completed' ? 'completed' : 'resumed'}!`)
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/plans/${id}`, { method: 'DELETE' })
      
      if (!response.ok) throw new Error('Failed to delete plan')

      toast.success('Plan deleted')
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
              <h2 className="mb-2 text-lg font-semibold">Plan Not Found</h2>
              <p className="mb-6 text-muted-foreground">
                This plan may have been deleted or you don&apos;t have access to it.
              </p>
              <Button asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
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
              Back to Dashboard
            </Link>
          </Button>

          {/* Plan Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-2xl">{plan.hobby_name}</CardTitle>
                      <Badge variant="outline" className={statusColors[plan.status]}>
                        {plan.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-muted-foreground">{plan.goal}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {plan.status === 'active' && (
                    <Button variant="outline" size="sm" onClick={() => handleStatusChange('paused')}>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </Button>
                  )}
                  {plan.status === 'paused' && (
                    <Button variant="outline" size="sm" onClick={() => handleStatusChange('active')}>
                      <Play className="mr-2 h-4 w-4" />
                      Resume
                    </Button>
                  )}
                  {plan.status !== 'completed' && plan.progress === 100 && (
                    <Button size="sm" onClick={() => handleStatusChange('completed')}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark Complete
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Plan?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete your {plan.hobby_name} plan and all its tasks. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">
                      {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Target className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Week</p>
                    <p className="font-medium">Week {currentWeek} of 4</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="font-medium">{plan.progress}%</span>
                  </div>
                  <Progress value={plan.progress} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Tasks */}
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
        </div>
      </main>
    </div>
  )
}
