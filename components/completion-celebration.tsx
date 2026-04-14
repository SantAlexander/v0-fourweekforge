'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CompletionCelebrationProps {
  show: boolean
  taskTitle?: string
}

export function CompletionCelebration({ show, taskTitle = 'Task completed!' }: CompletionCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => setIsVisible(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [show])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
      <div className="animate-achievement space-y-4">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-check inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-lg shadow-accent/40">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <p className="text-lg font-bold text-foreground text-center whitespace-nowrap">
            🎉 {taskTitle}
          </p>
        </div>
      </div>
    </div>
  )
}
