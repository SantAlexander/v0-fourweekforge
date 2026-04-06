'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { useAuth } from '@/lib/auth-context'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { getHobbyIcon } from '@/lib/hobby-icons'
import { Hobby } from '@/lib/db'
import { ArrowLeft, ArrowRight, Check, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskInput {
  week_number: number
  title: string
  description: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function PlannerPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [selectedHobby, setSelectedHobby] = useState<string | null>(null)
  const [customHobby, setCustomHobby] = useState('')
  const [goal, setGoal] = useState('')
  const [startDate, setStartDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [tasks, setTasks] = useState<TaskInput[]>([
    { week_number: 1, title: '', description: '' },
    { week_number: 2, title: '', description: '' },
    { week_number: 3, title: '', description: '' },
    { week_number: 4, title: '', description: '' },
  ])

  const { data: hobbiesData, isLoading: hobbiesLoading } = useSWR<{ hobbies: Hobby[] }>(
    '/api/hobbies',
    fetcher
  )

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  const hobbies = hobbiesData?.hobbies || []

  const addTask = (weekNumber: number) => {
    setTasks([...tasks, { week_number: weekNumber, title: '', description: '' }])
  }

  const removeTask = (index: number) => {
    if (tasks.length > 4) {
      setTasks(tasks.filter((_, i) => i !== index))
    }
  }

  const updateTask = (index: number, field: keyof TaskInput, value: string | number) => {
    const newTasks = [...tasks]
    newTasks[index] = { ...newTasks[index], [field]: value }
    setTasks(newTasks)
  }

  const canProceed = () => {
    if (step === 1) return selectedHobby || customHobby.trim()
    if (step === 2) return goal.trim() && startDate
    if (step === 3) return tasks.some(t => t.title.trim())
    return false
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const selectedHobbyData = hobbies.find(h => h.id === selectedHobby)
      
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hobby_id: selectedHobby,
          custom_hobby_name: selectedHobby ? null : customHobby.trim(),
          goal: goal.trim(),
          start_date: startDate,
          tasks: tasks.filter(t => t.title.trim()).map(t => ({
            week_number: t.week_number,
            title: t.title.trim(),
            description: t.description.trim() || null,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create plan')
      }

      toast.success(`Your ${selectedHobbyData?.name || customHobby} plan has been created!`)
      router.push(`/plan/${data.plan.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create plan')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Spinner className="h-8 w-8" />
        </main>
      </div>
    )
  }

  if (!user) return null

  const getWeekTasks = (weekNumber: number) => 
    tasks.map((task, index) => ({ task, index })).filter(({ task }) => task.week_number === weekNumber)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors',
                      step >= s
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground/30 text-muted-foreground'
                    )}
                  >
                    {step > s ? <Check className="h-5 w-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={cn(
                        'h-0.5 w-24 sm:w-32 md:w-40 transition-colors',
                        step > s ? 'bg-primary' : 'bg-muted-foreground/30'
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className={step >= 1 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                Choose Hobby
              </span>
              <span className={step >= 2 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                Set Goal
              </span>
              <span className={step >= 3 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                Plan Tasks
              </span>
            </div>
          </div>

          {/* Step 1: Choose Hobby */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Hobby</CardTitle>
                <CardDescription>
                  Select from popular hobbies or create your own
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {hobbiesLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner className="h-8 w-8" />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {hobbies.map((hobby) => {
                        const Icon = getHobbyIcon(hobby.icon)
                        return (
                          <button
                            key={hobby.id}
                            type="button"
                            onClick={() => {
                              setSelectedHobby(hobby.id)
                              setCustomHobby('')
                            }}
                            className={cn(
                              'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:border-primary/50',
                              selectedHobby === hobby.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border'
                            )}
                          >
                            <div className={cn(
                              'flex h-12 w-12 items-center justify-center rounded-lg',
                              selectedHobby === hobby.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            )}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <span className="text-sm font-medium">{hobby.name}</span>
                          </button>
                        )
                      })}
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or custom hobby</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="custom-hobby">Custom Hobby Name</Label>
                      <Input
                        id="custom-hobby"
                        placeholder="e.g., Chess, Origami, Gardening..."
                        value={customHobby}
                        onChange={(e) => {
                          setCustomHobby(e.target.value)
                          if (e.target.value) setSelectedHobby(null)
                        }}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Set Goal */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Set Your Goal</CardTitle>
                <CardDescription>
                  What do you want to achieve in 4 weeks?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="goal">Your 4-Week Goal</Label>
                  <Textarea
                    id="goal"
                    placeholder="e.g., Learn to play 3 songs on guitar, Master basic watercolor techniques..."
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Plan Tasks */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Plan Your Weekly Tasks</CardTitle>
                <CardDescription>
                  Break down your goal into weekly milestones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[1, 2, 3, 4].map((weekNumber) => (
                  <div key={weekNumber} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Week {weekNumber}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addTask(weekNumber)}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Add Task
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {getWeekTasks(weekNumber).map(({ task, index }) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex-1 space-y-2">
                            <Input
                              placeholder={`Week ${weekNumber} task title`}
                              value={task.title}
                              onChange={(e) => updateTask(index, 'title', e.target.value)}
                            />
                            <Input
                              placeholder="Description (optional)"
                              value={task.description}
                              onChange={(e) => updateTask(index, 'description', e.target.value)}
                            />
                          </div>
                          {tasks.length > 4 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="shrink-0 text-destructive hover:text-destructive"
                              onClick={() => removeTask(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={() => step > 1 ? setStep(step - 1) : router.push('/dashboard')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>
            
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting}>
                {isSubmitting ? <Spinner className="mr-2" /> : null}
                Create Plan
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
