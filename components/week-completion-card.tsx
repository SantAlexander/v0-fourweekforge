'use client'

import { useI18n } from '@/lib/i18n-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WeekCompletionProps {
  weekNumber: number
  completedTasks: number
  totalTasks: number
  isCurrentWeek?: boolean
  isCompleted?: boolean
}

export function WeekCompletionCard({
  weekNumber,
  completedTasks,
  totalTasks,
  isCurrentWeek = false,
  isCompleted = false,
}: WeekCompletionProps) {
  const { t, locale } = useI18n()
  const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <Card
      className={cn(
        'border-2 transition-all duration-300',
        isCurrentWeek && 'border-primary shadow-lg shadow-primary/20 bg-gradient-to-br from-primary/5 to-transparent',
        isCompleted && 'border-accent bg-gradient-to-br from-accent/5 to-transparent',
        !isCurrentWeek && !isCompleted && 'border-border opacity-60'
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className={cn('text-lg', isCurrentWeek && 'text-primary')}>
              {locale === 'ru' ? `Неделя ${weekNumber}` : `Week ${weekNumber}`}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {completedTasks} / {totalTasks} {t('plan.taskCount')}
            </p>
          </div>
          {isCompleted && (
            <div className="flex items-center gap-2 text-accent font-semibold">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm">{locale === 'ru' ? 'Готово' : 'Done'}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Progress value={percentage} className="h-2 bg-secondary" />
        <p className="text-xs text-muted-foreground mt-2">
          {Math.round(percentage)}% {locale === 'ru' ? 'завершено' : 'complete'}
        </p>
      </CardContent>
    </Card>
  )
}
