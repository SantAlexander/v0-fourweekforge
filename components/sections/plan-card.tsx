'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { ru, enUS } from 'date-fns/locale'
import { useI18n } from '@/lib/i18n-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { getHobbyIcon } from '@/lib/hobby-icons'
import { cn } from '@/lib/utils'
import { Calendar, CheckCircle2, Circle } from 'lucide-react'
import { PlanWithTasks } from '@/lib/db'

interface PlanCardProps {
  plan: PlanWithTasks
}

export function PlanCard({ plan }: PlanCardProps) {
  const { t, locale } = useI18n()
  const dateLocale = locale === 'ru' ? ru : enUS
  const Icon = getHobbyIcon(plan.hobby_icon)
  const statusConfig = {
    active: { bg: 'bg-gradient-to-br from-primary/10 to-accent/5', border: 'border-primary/30', text: 'text-primary' },
    completed: { bg: 'bg-gradient-to-br from-accent/10 to-primary/5', border: 'border-accent/30', text: 'text-accent' },
    paused: { bg: 'bg-muted', border: 'border-border', text: 'text-muted-foreground' },
  }

  const config = statusConfig[plan.status]
  const completedTasks = plan.tasks.filter(t => t.is_completed).length
  const totalTasks = plan.tasks.length
  const isCompleted = plan.status === 'completed'

  return (
    <Link href={`/plan/${plan.id}`}>
      <Card className={`group transition-all duration-300 cursor-pointer border ${config.border}`}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ${config.text}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className={`text-xl font-bold group-hover:${config.text} transition-colors`}>
                  {t(`hobby.${plan.hobby_icon}`) !== `hobby.${plan.hobby_icon}` ? t(`hobby.${plan.hobby_icon}`) : plan.hobby_name}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(plan.start_date), 'd MMM yyyy', { locale: dateLocale })}</span>
                </div>
              </div>
            </div>
            <Badge variant="outline" className={cn('font-semibold border-2', config.text, isCompleted && 'bg-accent/20', !isCompleted && plan.status === 'active' && 'bg-primary/20')}>
              {plan.status === 'active' && `🔥 ${t('planCard.statusActive')}`}
              {plan.status === 'completed' && `✓ ${t('planCard.statusDone')}`}
              {plan.status === 'paused' && `⏸ ${t('planCard.statusPaused')}`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm text-muted-foreground line-clamp-2 font-medium">{plan.goal}</p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">{t('planCard.progress')}</span>
              <span className="font-bold text-primary">{plan.progress}%</span>
            </div>
            <Progress value={plan.progress} className="h-2.5 bg-secondary" />
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm pt-2 border-t border-border/50">
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground mb-1">{t('planCard.completed')}</span>
              <span className="text-lg font-bold text-accent">{completedTasks}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground mb-1">{t('planCard.remaining')}</span>
              <span className="text-lg font-bold text-primary">{totalTasks - completedTasks}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-background/50">
              <span className="text-xs text-muted-foreground mb-1">{t('planCard.total')}</span>
              <span className="text-lg font-bold">{totalTasks}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
