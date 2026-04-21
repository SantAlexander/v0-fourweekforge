// Widgets - Plan Card Widget
// Reusable plan card widget

import type { Plan } from '@/shared/types'
import { Card, CardContent, CardTitle } from '@/shared/ui'

interface PlanCardWidgetProps {
  plan: Plan
  onClick?: () => void
}

export function PlanCardWidget({ plan, onClick }: PlanCardWidgetProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent>
        <CardTitle>{plan.hobbyName}</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">{plan.goal}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-medium">{plan.progress}% Complete</span>
          <span className="text-xs px-2 py-1 rounded bg-muted">{plan.status}</span>
        </div>
      </CardContent>
    </Card>
  )
}
