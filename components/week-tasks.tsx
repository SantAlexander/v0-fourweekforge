'use client'

import { useState } from 'react'
import { Task } from '@/lib/db'
import { useI18n } from '@/lib/i18n-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { CheckCircle2 } from 'lucide-react'

interface WeekTasksProps {
  weekNumber: number
  tasks: Task[]
  onTaskToggle: (taskId: string, isCompleted: boolean) => Promise<void>
}

export function WeekTasks({ weekNumber, tasks, onTaskToggle }: WeekTasksProps) {
  const { t } = useI18n()
  const [loadingTasks, setLoadingTasks] = useState<Set<string>>(new Set())
  
  const completedCount = tasks.filter(t => t.is_completed).length
  const totalCount = tasks.length
  const isWeekComplete = completedCount === totalCount && totalCount > 0

  const handleToggle = async (taskId: string, currentState: boolean) => {
    setLoadingTasks(prev => new Set(prev).add(taskId))
    try {
      await onTaskToggle(taskId, !currentState)
    } finally {
      setLoadingTasks(prev => {
        const next = new Set(prev)
        next.delete(taskId)
        return next
      })
    }
  }

  return (
    <Card className={cn(
      'transition-all',
      isWeekComplete && 'border-chart-2/50 bg-chart-2/5'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            {t('planner.week')} {weekNumber}
            {isWeekComplete && (
              <CheckCircle2 className="h-5 w-5 text-chart-2" />
            )}
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {completedCount}/{totalCount} {t('planCard.tasks')}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('weekTasks.noTasks')}</p>
        ) : isWeekComplete ? (
          <p className="text-sm text-chart-2 font-medium">{t('weekTasks.allDone')}</p>
        ) : null}
        {tasks.map(task => (
          <div
            key={task.id}
            className={cn(
              'flex items-start gap-3 rounded-lg border p-3 transition-all',
              task.is_completed && 'bg-muted/50 border-muted'
            )}
          >
            <Checkbox
              checked={task.is_completed}
              disabled={loadingTasks.has(task.id)}
              onCheckedChange={() => handleToggle(task.id, task.is_completed)}
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <p className={cn(
                'text-sm font-medium',
                task.is_completed && 'line-through text-muted-foreground'
              )}>
                {task.title}
              </p>
              {task.description && (
                <p className={cn(
                  'text-sm text-muted-foreground mt-1',
                  task.is_completed && 'line-through'
                )}>
                  {task.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
