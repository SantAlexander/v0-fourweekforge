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
      <DialogContent className="sm:max-w-lg border">
        <DialogHeader className="space-y-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-2xl">{t('onboarding.title')}</DialogTitle>
            <DialogDescription className="text-base">{t('onboarding.subtitle')}</DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-6 border-y border-border">
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

        <DialogFooter className="flex gap-3 pt-4">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="flex-1"
          >
            {t('onboarding.skip')}
          </Button>
          <Button
            onClick={handleCreatePlan}
            className="flex-1 gap-2"
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
    <div className="flex items-start gap-4 group">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
        {number}
      </div>
      <div className="flex flex-1 items-center pt-1">
        <p className="text-base font-medium text-foreground">{title}</p>
      </div>
      <div className="ml-2 flex-shrink-0 pt-1">
        <CheckCircle2 className="h-5 w-5 text-accent" />
      </div>
    </div>
  )
}