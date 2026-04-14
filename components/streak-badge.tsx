'use client'

import { Flame } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface StreakBadgeProps {
  days: number
  size?: 'sm' | 'md' | 'lg'
}

export function StreakBadge({ days, size = 'md' }: StreakBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1 gap-1',
    md: 'text-sm px-3 py-1.5 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2',
  }

  return (
    <Badge
      variant="default"
      className={`flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold animate-pulse ${sizeClasses[size]}`}
    >
      <Flame className={size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'} />
      <span>{days} day streak</span>
    </Badge>
  )
}
