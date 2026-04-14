'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n-context'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export function OnboardingModal() {
  const router = useRouter()
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Check if user has seen the onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
    if (!hasSeenOnboarding) {
      setOpen(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem('hasSeenOnboarding', 'true')
    setOpen(false)
  }

  const handleCreatePlan = () => {
    handleClose()
    router.push('/planner')
  }

  if (!isMounted) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('onboarding.title')}</DialogTitle>
          <DialogDescription>{t('onboarding.subtitle')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <OnboardingStep
            number={1}
            title={t('onboarding.step1')}
          />
          <OnboardingStep
            number={2}
            title={t('onboarding.step2')}
          />
          <OnboardingStep
            number={3}
            title={t('onboarding.step3')}
          />
        </div>

        <DialogFooter className="flex gap-2 sm:flex-row">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="flex-1 sm:flex-initial"
          >
            {t('onboarding.skip')}
          </Button>
          <Button
            onClick={handleCreatePlan}
            className="flex-1 sm:flex-initial"
          >
            {t('onboarding.createPlan')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface OnboardingStepProps {
  number: number
  title: string
}

function OnboardingStep({ number, title }: OnboardingStepProps) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
        {number}
      </div>
      <div className="flex items-center">
        <p className="text-sm">{title}</p>
      </div>
      <div className="ml-auto flex-shrink-0">
        <CheckCircle2 className="h-5 w-5 text-green-500" />
      </div>
    </div>
  )
}
