'use client'

import { useState } from 'react'
import { Task } from '@/lib/db'
import { useI18n } from '@/lib/i18n-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

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
      isWeekComplete && 'opacity-50'
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t('planner.week')} {weekNumber}
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            {completedCount}/{totalCount}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">{t('weekTasks.noTasks')}</p>
        ) : (
          <>
            {/* Incomplete tasks — Focus on first */}
            {incompleteTasks.length > 0 && (
              <div className="space-y-1">
                {incompleteTasks.map((task, idx) => (
                  <div
                    key={task.id}
                    className={cn(
                      'flex items-start gap-3 rounded-md p-2 transition-all',
                      idx === 0 ? 'bg-primary/5 border border-primary/20' : 'opacity-60'
                    )}
                  >
                    <Checkbox
                      checked={false}
                      disabled={loadingTasks.has(task.id)}
                      onCheckedChange={() => handleToggle(task.id, false)}
                      className="mt-0.5"
                    />
                    <p className={cn(
                      'text-sm',
                      idx === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'
                    )}>
                      {task.title}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Completed tasks — Minimal */}
            {completedTasks.length > 0 && (
              <div className="pt-1 space-y-0.5 opacity-40">
                {completedTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-1.5"
                  >
                    <Checkbox
                      checked={true}
                      disabled={loadingTasks.has(task.id)}
                      onCheckedChange={() => handleToggle(task.id, true)}
                      className="mt-0.5"
                    />
                    <p className="text-xs line-through text-muted-foreground">
                      {task.title}
                    </p>
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
