'use client'

import { Card } from '@/shared/ui'
import type { Plan } from '@/shared/types'

interface PlanCardWidgetProps {
  plan: Plan
  onClick?: () => void
}

export function PlanCardWidget({ plan, onClick }: PlanCardWidgetProps) {
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={onClick}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold">{plan.hobby_name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{plan.goal}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {plan.progress}% Complete
          </span>
          <span className="text-xs font-medium">{plan.status}</span>
        </div>
      </div>
    </Card>
  )
}
