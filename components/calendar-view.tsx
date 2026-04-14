'use client'

import { useState, useMemo } from 'react'
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
  const { t, locale } = useI18n()
  const [expandedDay, setExpandedDay] = useState<number | null>(null)

  const startDate = new Date(plan.start_date)
  const today = startOfDay(new Date())
  const isToday = (dayIndex: number) => {
    const dayDate = addDays(startDate, dayIndex)
    return dayDate.getTime() === today.getTime()
  }

  // Map tasks by day - use useMemo to prevent recalculation on each render
  // Distribute tasks deterministically based on task index within the week
  const tasksByDay = useMemo(() => {
    const result: Record<number, Task[]> = {}
    for (let i = 0; i < 28; i++) {
      result[i] = []
    }

    // Group tasks by week first
    const tasksByWeek: Record<number, Task[]> = { 1: [], 2: [], 3: [], 4: [] }
    plan.tasks.forEach((task) => {
      if (tasksByWeek[task.week_number]) {
        tasksByWeek[task.week_number].push(task)
      }
    })

    // Distribute tasks evenly across days in each week
    Object.entries(tasksByWeek).forEach(([weekNum, weekTasks]) => {
      const weekIndex = parseInt(weekNum) - 1
      weekTasks.forEach((task, idx) => {
        // Spread tasks across the week based on their index
        const dayInWeek = idx % 7
        const dayIndex = weekIndex * 7 + dayInWeek
        if (dayIndex < 28) {
          result[dayIndex].push(task)
        }
      })
    })

    return result
  }, [plan.tasks])

  return (
    <div className="space-y-8">
      {[0, 1, 2, 3].map((weekIdx) => {
        const weekStart = weekIdx * 7
        const weekEnd = weekStart + 7
        const weekDays = Array.from({ length: 7 }, (_, i) => weekStart + i)
        const weekTasks = weekDays.flatMap(day => tasksByDay[day] || [])
        const completedWeekTasks = weekTasks.filter(t => t.is_completed).length

        return (
          <div key={weekIdx} className="space-y-4">
            {/* Week Header with Progress */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-bold text-foreground">
                  {locale === 'ru' ? `Неделя ${weekIdx + 1}` : `Week ${weekIdx + 1}`}
                </h3>
                <span className="text-sm font-medium text-muted-foreground">
                  {format(addDays(startDate, weekStart), 'MMM d')} – {format(addDays(startDate, weekEnd - 1), 'MMM d')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${weekTasks.length > 0 ? (completedWeekTasks / weekTasks.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-muted-foreground min-w-fit">
                  {completedWeekTasks}/{weekTasks.length}
                </span>
              </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((dayIndex) => {
                const dayDate = addDays(startDate, dayIndex)
                const dayTasks = tasksByDay[dayIndex] || []
                const completedDayTasks = dayTasks.filter(t => t.is_completed).length
                const isExpandedDay = expandedDay === dayIndex
                const dayIsToday = isToday(dayIndex)
                const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex % 7]
                const dayOfWeekShort = locale === 'ru'
                  ? ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][dayIndex % 7]
                  : dayOfWeek

                return (
                  <button
                    key={dayIndex}
                    onClick={() => setExpandedDay(isExpandedDay ? null : dayIndex)}
                    className={cn(
                      'aspect-square rounded-lg p-2 transition-all duration-200 text-center flex flex-col items-center justify-center border',
                      dayIsToday && 'border-primary bg-primary/5',
                      !dayIsToday && completedDayTasks === dayTasks.length && dayTasks.length > 0 && 'bg-accent/5 border-accent',
                      !dayIsToday && completedDayTasks < dayTasks.length && dayTasks.length > 0 && 'bg-muted border-border hover:border-primary/50',
                      dayTasks.length === 0 && 'bg-muted/30 border-border opacity-50',
                      isExpandedDay && 'border-primary bg-primary/5'
                    )}
                  >
                    <span className="text-xs font-semibold text-muted-foreground">{dayOfWeekShort}</span>
                    <span className="text-sm font-bold">{format(dayDate, 'd')}</span>
                    {dayTasks.length > 0 && (
                      <span className={cn(
                        'text-xs font-semibold mt-1 px-1.5 py-0.5 rounded',
                        completedDayTasks === dayTasks.length ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'
                      )}>
                        {completedDayTasks}/{dayTasks.length}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Expanded Day Tasks */}
            {expandedDay !== null && expandedDay >= weekStart && expandedDay < weekEnd && (
              <div className="mt-4 p-4 rounded-lg bg-muted border space-y-3">
                <h4 className="font-semibold text-sm text-foreground">
                  {format(addDays(startDate, expandedDay), 'MMMM d, yyyy')} {locale === 'ru' ? 'Задачи' : 'Tasks'}
                </h4>
                {tasksByDay[expandedDay]?.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{locale === 'ru' ? 'Нет задач' : 'No tasks'}</p>
                ) : (
                  <div className="space-y-2">
                    {tasksByDay[expandedDay]?.map((task) => (
                      <div key={task.id} className="flex items-start gap-3 p-2 rounded hover:bg-background/50 transition-colors">
                        <Checkbox
                          checked={task.is_completed}
                          onCheckedChange={(checked) => {
                            onTaskToggle(task.id, checked as boolean)
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className={cn(
                            'text-sm font-medium',
                            task.is_completed && 'line-through text-muted-foreground'
                          )}>
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
