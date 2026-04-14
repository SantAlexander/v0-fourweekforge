'use client'

import { useState } from 'react'
import { addDays, format, startOfDay } from 'date-fns'
import { useI18n } from '@/lib/i18n-context'
import { Task, PlanWithTasks } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

interface CalendarViewProps {
  plan: PlanWithTasks
  onTaskToggle: (taskId: string, isCompleted: boolean) => void
}

export function CalendarView({ plan, onTaskToggle }: CalendarViewProps) {
  const { t } = useI18n()
  const [expandedDay, setExpandedDay] = useState<number | null>(null)

  const startDate = new Date(plan.start_date)
  const today = startOfDay(new Date())
  const isToday = (dayIndex: number) => {
    const dayDate = addDays(startDate, dayIndex)
    return dayDate.getTime() === today.getTime()
  }

  // Map tasks by day (based on week_number and approximate day distribution)
  const tasksByDay: Record<number, Task[]> = {}
  for (let i = 0; i < 28; i++) {
    tasksByDay[i] = []
  }

  plan.tasks.forEach((task) => {
    // Distribute tasks across days in their week
    // Week 1 = days 0-6, Week 2 = days 7-13, etc.
    const weekIndex = task.week_number - 1
    const dayInWeek = Math.floor(Math.random() * 7) // Simple distribution
    const dayIndex = weekIndex * 7 + dayInWeek
    if (dayIndex < 28) {
      tasksByDay[dayIndex].push(task)
    }
  })

  const days = Array.from({ length: 28 }, (_, i) => i)
  const dayLabels = [t('plan.sun'), t('plan.mon'), t('plan.tue'), t('plan.wed'), t('plan.thu'), t('plan.fri'), t('plan.sat')]

  return (
    <div className="space-y-4">
      {/* Week rows */}
      {[0, 1, 2, 3].map((weekIdx) => {
        const weekStart = weekIdx * 7
        const weekEnd = weekStart + 7
        const weekDays = days.slice(weekStart, weekEnd)

        return (
          <div key={weekIdx}>
            <h3 className="mb-3 font-semibold text-sm text-muted-foreground">
              {t('plan.weekOf')} {weekIdx + 1} ({format(addDays(startDate, weekStart), 'MMM d')} - {format(addDays(startDate, weekEnd - 1), 'MMM d')})
            </h3>
            <div className="grid grid-cols-7 gap-2 md:gap-3">
              {weekDays.map((dayIdx) => {
                const dayDate = addDays(startDate, dayIdx)
                const dayOfWeek = dayDate.getDay()
                const tasks = tasksByDay[dayIdx] || []
                const isCurrentDay = isToday(dayIdx)

                return (
                  <Card
                    key={dayIdx}
                    className={cn(
                      'cursor-pointer transition-all',
                      isCurrentDay && 'ring-2 ring-primary bg-primary/5',
                      expandedDay === dayIdx && 'ring-2 ring-primary'
                    )}
                    onClick={() => setExpandedDay(expandedDay === dayIdx ? null : dayIdx)}
                  >
                    <CardContent className="p-2 md:p-3">
                      <div className="space-y-2">
                        {/* Day header */}
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">{dayLabels[dayOfWeek]}</p>
                          <p className={cn(
                            'text-sm font-semibold',
                            isCurrentDay && 'text-primary'
                          )}>
                            {format(dayDate, 'd')}
                          </p>
                        </div>

                        {/* Task count badge */}
                        {tasks.length > 0 && (
                          <Badge variant="secondary" className="w-full justify-center text-xs">
                            {tasks.length} {t('plan.taskCount')}
                          </Badge>
                        )}

                        {/* Expanded view */}
                        {expandedDay === dayIdx && tasks.length > 0 && (
                          <div className="border-t pt-2 mt-2 space-y-2">
                            {tasks.map((task) => (
                              <div key={task.id} className="flex items-start gap-2">
                                <Checkbox
                                  checked={task.is_completed}
                                  onCheckedChange={(checked) => {
                                    onTaskToggle(task.id, checked as boolean)
                                  }}
                                  className="mt-1"
                                />
                                <label className={cn(
                                  'text-xs leading-tight cursor-pointer flex-1',
                                  task.is_completed && 'line-through text-muted-foreground'
                                )}>
                                  {task.title}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
