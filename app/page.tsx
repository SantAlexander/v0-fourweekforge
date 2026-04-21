import { Header } from '@/shared/ui'
import Link from 'next/link'
import { Button } from '@/shared/ui/button'

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
            <div className="mx-auto max-w-2xl text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight text-balance">
                  Learn any skill in 4 weeks
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                  Structured daily tasks. 15-30 minutes. Clear progress from day one.
                </p>
              </div>

              <div className="flex flex-col items-center gap-4 pt-4">
                <Button asChild size="lg" className="px-8">
                  <Link href="/register">
                    Start learning
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground">
                  Already have an account? <Link href="/login" className="text-primary hover:underline">Sign in</Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="border-b border-border py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-4">
            <div className="mb-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                How it works
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-4">
              {[
                { num: 1, title: 'Pick a hobby', desc: 'Choose from 30+ available hobbies' },
                { num: 2, title: 'Set your goal', desc: 'Define what you want to achieve' },
                { num: 3, title: 'Get a plan', desc: 'AI creates personalized 4-week plan' },
                { num: 4, title: 'Learn daily', desc: '15-30 minutes per day for 28 days' },
              ].map((item) => (
                <div key={item.num} className="text-center space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                      {item.num}
                    </div>
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-xl px-4 text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              Ready to start?
            </h2>
            <p className="text-muted-foreground">
              Pick a hobby. Get a structured plan. Start today.
            </p>
            <Button asChild size="lg" className="px-8">
              <Link href="/register">
                Create account
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  )
}
