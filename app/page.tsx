'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Header } from '@/components/header'
import { useI18n } from '@/lib/i18n-context'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { 
  Flame, 
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
  ArrowRight
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
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-2 text-sm font-medium text-primary">
                <Flame className="h-4 w-4 animate-pulse" />
                <span>{t('landing.badge')}</span>
              </div>
              <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                {t('landing.title')}{' '}
                <span className="text-primary">
                  {t('landing.titleHighlight')}
                </span>
              </h1>
              <p className="mb-10 text-pretty text-lg text-muted-foreground md:text-xl leading-relaxed">
                {t('landing.subtitle')}
              </p>
              <div className="mb-8 inline-flex flex-col items-center gap-3 rounded-lg border border-border/50 bg-muted/30 px-6 py-4 sm:flex-row sm:gap-6">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="text-xl text-primary font-bold">8-12</span>
                  <span className="text-muted-foreground">{t('landing.tasksLabel')}</span>
                </div>
                <div className="hidden h-6 w-px bg-border/50 sm:block" />
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="text-xl text-primary font-bold">15-30</span>
                  <span className="text-muted-foreground">{t('landing.dailyLabel')}</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="gap-2">
                  <Link href={user ? "/planner" : "/register"}>
                    {t('landing.cta.start')}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                {!user && (
                  <Button asChild variant="outline" size="lg" className="gap-2">
                    <Link href="/login">{t('landing.cta.signin')}</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="border-b border-border py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-16 text-center space-y-3">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                {t('landing.howItWorks')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('landing.howItWorksSubtitle')}
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <div key={i} className="group relative">
                    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Card className="relative border-border hover:border-primary/50 transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <span className="text-sm font-bold text-primary/60">{String(i + 1).padStart(2, '0')}</span>
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                      </CardContent>
                    </Card>
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
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                {t('landing.examplesTitle')}
              </h2>
              <p className="text-lg text-muted-foreground">
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
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                {t('landing.popularHobbies')}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t('landing.popularHobbiesSubtitle')}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {hobbies.map((hobby) => (
                <Card key={hobby.key} className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary hover:scale-105">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${hobby.color} transition-all group-hover:shadow-lg group-hover:scale-110`}>
                      <hobby.icon className="h-8 w-8" />
                    </div>
                    <span className="text-sm font-semibold text-foreground text-center">{hobby.name}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-8 text-center text-base text-muted-foreground font-medium">
              {t('landing.moreHobbies')}
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4">
            <Card className="border">
              <CardContent className="flex flex-col items-center justify-center p-12 md:p-16 text-center space-y-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground">
                  <Flame className="h-10 w-10" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                    {t('landing.ctaTitle')}
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    {t('landing.ctaSubtitle')}
                  </p>
                </div>
                <Button asChild size="lg" className="gap-2 mt-4">
                  <Link href={user ? "/dashboard" : "/register"}>
                    {user ? t('landing.ctaButtonLoggedIn') : t('landing.ctaButton')}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
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
              <span className="font-semibold">FourWeekForge</span>
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
