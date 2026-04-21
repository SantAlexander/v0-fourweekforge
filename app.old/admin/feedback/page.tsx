'use client'

import { useEffect, useState } from 'react'
import { Feedback } from '@/lib/db'
import { Bug, Lightbulb, HelpCircle, Loader2, RefreshCw, MessageSquare, User, Mail, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const TYPE_CONFIG = {
  bug: { label: 'Баг', icon: Bug, variant: 'destructive' as const },
  idea: { label: 'Идея', icon: Lightbulb, variant: 'default' as const },
  question: { label: 'Вопрос', icon: HelpCircle, variant: 'secondary' as const },
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'bug' | 'idea' | 'question'>('all')

  const fetchFeedback = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/feedback')
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError('Не удалось загрузить отзывы')
      } else {
        setFeedback(data.feedback)
      }
    } catch {
      setError('Ошибка сети')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedback()
  }, [])

  const filtered = filter === 'all' ? feedback : feedback.filter((f) => f.type === filter)

  const counts = {
    all: feedback.length,
    bug: feedback.filter((f) => f.type === 'bug').length,
    idea: feedback.filter((f) => f.type === 'idea').length,
    question: feedback.filter((f) => f.type === 'question').length,
  }

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Обратная связь</h1>
              <p className="text-sm text-muted-foreground">Отзывы пользователей FourWeekForge</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchFeedback} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['all', 'bug', 'idea', 'question'] as const).map((tab) => {
            const isAll = tab === 'all'
            const config = isAll ? null : TYPE_CONFIG[tab]
            const Icon = config?.icon
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  filter === tab
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-foreground/30'
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {isAll ? 'Все' : config?.label}
                <span className={`ml-1 px-1.5 py-0.5 rounded text-xs font-bold ${
                  filter === tab ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {counts[tab]}
                </span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="text-destructive font-medium">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchFeedback}>Попробовать снова</Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-2">
            <MessageSquare className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-muted-foreground text-sm">Отзывов пока нет</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((item) => {
              const config = TYPE_CONFIG[item.type]
              const Icon = config.icon
              return (
                <div
                  key={item.id}
                  className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3"
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <Badge variant={config.variant} className="flex items-center gap-1">
                      <Icon className="h-3 w-3" />
                      {config.label}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(item.created_at)}
                    </span>
                  </div>

                  {/* Message */}
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{item.message}</p>

                  {/* Meta */}
                  {(item.name || item.email) && (
                    <div className="flex items-center gap-4 pt-2 border-t border-border flex-wrap">
                      {item.name && (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          {item.name}
                        </span>
                      )}
                      {item.email && (
                        <a
                          href={`mailto:${item.email}`}
                          className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                        >
                          <Mail className="h-3 w-3" />
                          {item.email}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
