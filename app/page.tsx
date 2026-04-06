import Link from 'next/link'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

const features = [
  {
    icon: Target,
    title: 'Set Clear Goals',
    description: 'Define what you want to achieve with your new hobby in just 4 weeks.',
  },
  {
    icon: Calendar,
    title: 'Weekly Milestones',
    description: 'Break down your learning into manageable weekly tasks and objectives.',
  },
  {
    icon: CheckCircle2,
    title: 'Track Progress',
    description: 'Check off completed tasks and watch your progress grow day by day.',
  },
  {
    icon: TrendingUp,
    title: 'Stay Motivated',
    description: 'Visual progress tracking keeps you engaged and motivated throughout.',
  },
]

const hobbies = [
  { icon: Guitar, name: 'Guitar', color: 'bg-chart-1/10 text-chart-1' },
  { icon: Palette, name: 'Painting', color: 'bg-chart-2/10 text-chart-2' },
  { icon: Camera, name: 'Photography', color: 'bg-chart-3/10 text-chart-3' },
  { icon: Code, name: 'Coding', color: 'bg-chart-4/10 text-chart-4' },
  { icon: ChefHat, name: 'Cooking', color: 'bg-chart-5/10 text-chart-5' },
  { icon: Pencil, name: 'Drawing', color: 'bg-chart-1/10 text-chart-1' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5" />
          <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
                <Flame className="h-4 w-4" />
                <span>Master any hobby in just 4 weeks</span>
              </div>
              <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Turn Your Passion Into{' '}
                <span className="text-primary">Progress</span>
              </h1>
              <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
                FourWeekForge helps you create structured learning plans for any hobby. 
                Set weekly goals, track your progress, and transform curiosity into skill.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/register">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="border-b border-border py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight">How It Works</h2>
              <p className="text-muted-foreground">
                Four simple steps to start mastering your new hobby
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card key={feature.title} className="relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 text-8xl font-bold text-muted/10">
                    {index + 1}
                  </div>
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Hobbies */}
        <section className="border-b border-border py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight">Popular Hobbies</h2>
              <p className="text-muted-foreground">
                Choose from our curated list or create your own custom hobby plan
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {hobbies.map((hobby) => (
                <Card key={hobby.name} className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/30">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-xl ${hobby.color} transition-transform group-hover:scale-110`}>
                      <hobby.icon className="h-7 w-7" />
                    </div>
                    <span className="text-sm font-medium">{hobby.name}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              And many more... or create your own custom hobby!
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4">
            <Card className="bg-gradient-to-br from-primary/10 via-background to-chart-2/10 border-primary/20">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Flame className="h-8 w-8" />
                </div>
                <h2 className="mb-4 text-3xl font-bold tracking-tight">
                  Ready to Forge Your Skills?
                </h2>
                <p className="mb-8 max-w-lg text-muted-foreground">
                  Join thousands of learners who have transformed their hobbies into skills. 
                  Start your 4-week journey today.
                </p>
                <Button asChild size="lg">
                  <Link href="/register">
                    Create Free Account
                    <ArrowRight className="ml-2 h-4 w-4" />
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
              Master any hobby in 4 weeks. Built with passion.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
