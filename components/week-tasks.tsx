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
  const incompleteTasks = tasks.filter(t => !t.is_completed)
  const completedTasks = tasks.filter(t => t.is_completed)

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
      isWeekComplete && 'border-accent/50 bg-accent/5'
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            {t('planner.week')} {weekNumber}
            {isWeekComplete && (
              <CheckCircle2 className="h-5 w-5 text-accent" />
            )}
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            {completedCount}/{totalCount} {t('planCard.tasks')}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">{t('weekTasks.noTasks')}</p>
        ) : (
          <>
            {/* Incomplete tasks - prominent */}
            {incompleteTasks.length > 0 && (
              <div className="space-y-2">
                {incompleteTasks.map((task, idx) => (
                  <div
                    key={task.id}
                    className={cn(
                      'flex items-start gap-2 rounded-md p-2.5 transition-all',
                      idx === 0 && 'border-l-2 border-primary bg-primary/3 border-l-primary'
                    )}
                  >
                    <Checkbox
                      checked={false}
                      disabled={loadingTasks.has(task.id)}
                      onCheckedChange={() => handleToggle(task.id, false)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      {idx === 0 && <p className="text-xs font-semibold text-primary mb-1">NOW</p>}
                      <p className="text-sm font-medium">
                        {task.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Completed tasks - collapsed */}
            {completedTasks.length > 0 && (
              <div className="pt-2 space-y-1 opacity-60">
                {completedTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-start gap-2 rounded-md p-2 transition-all"
                  >
                    <Checkbox
                      checked={true}
                      disabled={loadingTasks.has(task.id)}
                      onCheckedChange={() => handleToggle(task.id, true)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs line-through text-muted-foreground">
                        {task.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
