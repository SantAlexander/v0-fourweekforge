'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Header } from '@/components/common'
import { useI18n } from '@/lib/i18n-context'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { 
  Target, 
  Calendar, 
  CheckCircle2, 
  TrendingUp,
  Guitar,
  Palette,
  Camera,
  Code,
  ChefHat,
  Pencil,
  ArrowRight,
  Flame
} from 'lucide-react'

const featureIcons = [Target, Calendar, CheckCircle2, TrendingUp]
const hobbyData = [
  { icon: Guitar, key: 'guitar', color: 'bg-chart-1/10 text-chart-1' },
  { icon: Palette, key: 'painting', color: 'bg-chart-2/10 text-chart-2' },
  { icon: Camera, key: 'photography', color: 'bg-chart-3/10 text-chart-3' },
  { icon: Code, key: 'coding', color: 'bg-chart-4/10 text-chart-4' },
  { icon: ChefHat, key: 'cooking', color: 'bg-chart-5/10 text-chart-5' },
  { icon: Pencil, key: 'drawing', color: 'bg-chart-1/10 text-chart-1' },
]

const EXAMPLE_PLANS = [
  {
    hobby: 'guitar',
    hobbyName: 'Guitar',
    hobbyNameRu: 'Гитара',
    goal: 'Play 3 songs from start to finish',
    goalRu: 'Сыграть 3 песни от начала до конца',
    tasks: [
      { week: 1, title: 'Learn basic chords (C, G, D, Am)', titleRu: 'Выучить базовые аккорды (C, G, D, Am)' },
      { week: 1, title: 'Practice chord transitions', titleRu: 'Практиковать смену аккордов' },
      { week: 2, title: 'Learn your first song melody', titleRu: 'Выучить мелодию первой песни' },
      { week: 2, title: 'Practice strumming patterns', titleRu: 'Практиковать ритм-паттерны' },
      { week: 3, title: 'Learn second song', titleRu: 'Выучить вторую песню' },
      { week: 4, title: 'Polish and perform all 3 songs', titleRu: 'Отшлифовать и сыграть все 3 песни' },
    ]
  },
  {
    hobby: 'photography',
    hobbyName: 'Photography',
    hobbyNameRu: 'Фотография',
    goal: 'Create a portfolio with 10 great photos',
    goalRu: 'Создать портфолио из 10 отличных фото',
    tasks: [
      { week: 1, title: 'Learn camera basics (aperture, shutter, ISO)', titleRu: 'Изучить основы камеры (диафрагма, выдержка, ISO)' },
      { week: 1, title: 'Practice composition rules', titleRu: 'Практиковать правила композиции' },
      { week: 2, title: 'Golden hour photoshoot', titleRu: 'Фотосессия в золотой час' },
      { week: 3, title: 'Edit photos in Lightroom', titleRu: 'Обработать фото в Lightroom' },
      { week: 4, title: 'Curate final portfolio', titleRu: 'Собрать финальное портфолио' },
    ]
  }
]

export default function HomePage() {
  const { t, locale } = useI18n()
  const { user } = useAuth()
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null)
  
  const features = [
    {
      icon: featureIcons[0],
      title: t('landing.feature1.title'),
      description: t('landing.feature1.description'),
    },
    {
      icon: featureIcons[1],
      title: t('landing.feature2.title'),
      description: t('landing.feature2.description'),
    },
    {
      icon: featureIcons[2],
      title: t('landing.feature3.title'),
      description: t('landing.feature3.description'),
    },
    {
      icon: featureIcons[3],
      title: t('landing.feature4.title'),
      description: t('landing.feature4.description'),
    },
  ]

  const hobbies = hobbyData.map(h => ({
    ...h,
    name: t(`hobby.${h.key}`),
  }))

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section — Calm, focused */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
            <div className="mx-auto max-w-2xl text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight text-balance">
                  {t('landing.heroTitle')}
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                  {t('landing.heroSubtitle')}
                </p>
              </div>

              {/* Single CTA */}
              <div className="flex flex-col items-center gap-4 pt-4">
                <Button asChild size="lg" className="px-8">
                  <Link href={user ? "/planner" : "/register"}>
                    {t('landing.startLearning')}
                  </Link>
                </Button>
                {!user && (
                  <p className="text-sm text-muted-foreground">
                    {t('landing.alreadyHaveAccount')} <Link href="/login" className="text-primary hover:underline">{t('landing.signIn')}</Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works — Clean, minimal */}
        <section className="border-b border-border py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-4">
            <div className="mb-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                {t('landing.howItWorks')}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-4">
              {features.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <div key={i} className="text-center space-y-3">
                    <div className="flex items-center justify-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Example Plans Section */}
        <section className="border-b border-border py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-16 text-center space-y-3">
              <p className="hierarchy-tertiary">{t('landing.examplesTitle')}</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                {t('landing.learningExamples')}
              </h2>
              <p className="hierarchy-secondary max-w-2xl mx-auto">
                {t('landing.examplesSubtitle')}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              {EXAMPLE_PLANS.map((plan) => {
                const isExpanded = expandedPlan === plan.hobby
                const displayName = locale === 'ru' ? plan.hobbyNameRu : plan.hobbyName
                const displayGoal = locale === 'ru' ? plan.goalRu : plan.goal
                
                return (
                  <Card 
                    key={plan.hobby}
                    className={cn(
                      'cursor-pointer transition-all border group overflow-hidden',
                      isExpanded 
                        ? 'border-primary' 
                        : 'border-border hover:border-primary/50'
                    )}
                    onClick={() => setExpandedPlan(isExpanded ? null : plan.hobby)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <CardTitle className={cn('text-xl', isExpanded && 'text-primary transition-colors')}>
                            {displayName}
                          </CardTitle>
                          <CardDescription className="text-base font-medium mt-1 text-foreground/80">
                            {displayGoal}
                          </CardDescription>
                        </div>
                        <div className={cn('transition-transform duration-300', isExpanded && 'rotate-180')}>
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                        </div>
                      </div>
                      <div className="w-12 h-1 bg-primary rounded-full" />
                    </CardHeader>
                    {isExpanded && (
                      <CardContent className="space-y-4 border-t border-border pt-4">
                        {[1, 2, 3, 4].map((week) => {
                          const weekTasks = plan.tasks.filter(t => t.week === week)
                          return (
                            <div key={week} className="space-y-2">
                              <p className="text-sm font-bold text-primary">
                                {locale === 'ru' ? `Неделя ${week}` : `Week ${week}`}
                              </p>
                              <div className="space-y-1">
                                {weekTasks.map((task, i) => {
                                  const displayTaskTitle = locale === 'ru' ? task.titleRu : task.title
                                  return (
                                    <div key={i} className="flex items-start gap-2 text-sm">
                                      <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                                      <span className="text-muted-foreground">{displayTaskTitle}</span>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Popular Hobbies */}
        <section className="border-b border-border py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-16 text-center space-y-3">
              <p className="hierarchy-tertiary">{t('landing.popularHobbies')}</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                {t('landing.pickYourPassion')}
              </h2>
              <p className="hierarchy-secondary max-w-2xl mx-auto">
                {t('landing.plansAvailable')}
              </p>
            </div>
            <div className="space-y-6">
              {/* Top 3 — Large */}
              <div className="grid gap-4 md:grid-cols-3">
                {hobbies.slice(0, 3).map((hobby) => (
                  <Card key={hobby.key} className="group cursor-pointer transition-all border hover:border-primary/50">
                    <CardContent className="flex flex-col items-center justify-center p-8">
                      <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl ${hobby.color}`}>
                        <hobby.icon className="h-10 w-10" />
                      </div>
                      <span className="text-base font-bold text-foreground text-center">{hobby.name}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Rest — Small */}
              {hobbies.length > 3 && (
                <div className="grid gap-3 md:grid-cols-6">
                  {hobbies.slice(3).map((hobby) => (
                    <Card key={hobby.key} className="group cursor-pointer transition-all border hover:border-primary/50">
                      <CardContent className="flex flex-col items-center justify-center p-4">
                        <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-lg ${hobby.color}`}>
                          <hobby.icon className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-semibold text-foreground text-center">{hobby.name}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section — Simple, direct */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-xl px-4 text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              {t('landing.readyToStart')}
            </h2>
            <p className="text-muted-foreground">
              {t('landing.getStructuredPlan')}
            </p>
            <Button asChild size="lg" className="px-8">
              <Link href={user ? "/dashboard" : "/register"}>
                {user ? t('landing.goToDashboard') : t('landing.createAccount')}
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Flame className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">{t('landing.productName')}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('landing.footer')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}