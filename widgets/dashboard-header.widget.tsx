'use client'

import type { ReactNode } from 'react'

interface DashboardHeaderWidgetProps {
  title: string
  subtitle?: string
  children?: ReactNode
}

export function DashboardHeaderWidget({
  title,
  subtitle,
  children,
}: DashboardHeaderWidgetProps) {
  return (
    <header className="mb-8 border-b border-border pb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
      {children}
    </header>
  )
}
