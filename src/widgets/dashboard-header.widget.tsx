// Widgets - Dashboard Header Widget
// Header widget for dashboard pages

interface DashboardHeaderWidgetProps {
  userName?: string
  planName?: string
}

export function DashboardHeaderWidget({ userName, planName }: DashboardHeaderWidgetProps) {
  return (
    <header className="border-b border-border bg-card py-4 px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">FourWeekForge</h1>
          {planName && <p className="text-sm text-muted-foreground">{planName}</p>}
        </div>
        {userName && <p className="text-sm text-foreground">{userName}</p>}
      </div>
    </header>
  )
}
