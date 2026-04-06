'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { getHobbyIcon } from '@/lib/hobby-icons'
import { Calendar, CheckCircle2, Circle } from 'lucide-react'
import { PlanWithTasks } from '@/lib/db'

interface PlanCardProps {
  plan: PlanWithTasks
}

export function PlanCard({ plan }: PlanCardProps) {
  const Icon = getHobbyIcon(plan.hobby_icon)
  const statusColors = {
    active: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
    completed: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
    paused: 'bg-muted text-muted-foreground border-muted',
  }

  const completedTasks = plan.tasks.filter(t => t.is_completed).length
  const totalTasks = plan.tasks.length

  return (
    <Link href={`/plan/${plan.id}`}>
      <Card className="group transition-all hover:shadow-lg hover:border-primary/30 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {plan.hobby_name}
                </CardTitle>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Started {format(new Date(plan.start_date), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>
            <Badge variant="outline" className={statusColors[plan.status]}>
              {plan.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">{plan.goal}</p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{plan.progress}%</span>
            </div>
            <Progress value={plan.progress} className="h-2" />
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-chart-2" />
              <span>{completedTasks} completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Circle className="h-4 w-4" />
              <span>{totalTasks - completedTasks} remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
