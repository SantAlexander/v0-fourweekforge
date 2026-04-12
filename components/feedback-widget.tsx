'use client'

import { useState } from 'react'
import { MessageSquare, X, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useI18n } from '@/lib/i18n-context'

type FeedbackType = 'bug' | 'idea' | 'question'
type Status = 'idle' | 'loading' | 'success' | 'error'

export function FeedbackWidget() {
  const { t, locale } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState<FeedbackType>('question')
  const [messageError, setMessageError] = useState('')

  const typeLabels: Record<FeedbackType, string> = {
    bug: locale === 'ru' ? 'Баг' : 'Bug',
    idea: locale === 'ru' ? 'Идея' : 'Idea',
    question: locale === 'ru' ? 'Вопрос' : 'Question',
  }

  const buttonLabel = locale === 'ru' ? 'Оставить отзыв' : 'Leave feedback'
  const titleLabel = locale === 'ru' ? 'Обратная связь' : 'Feedback'
  const namePlaceholder = locale === 'ru' ? 'Ваше имя (необязательно)' : 'Your name (optional)'
  const emailPlaceholder = locale === 'ru' ? 'Email (необязательно)' : 'Email (optional)'
  const messagePlaceholder = locale === 'ru' ? 'Ваше сообщение...' : 'Your message...'
  const messageRequiredError = locale === 'ru' ? 'Сообщение обязательно' : 'Message is required'
  const sendLabel = locale === 'ru' ? 'Отправить' : 'Send'
  const sendingLabel = locale === 'ru' ? 'Отправка...' : 'Sending...'
  const successTitle = locale === 'ru' ? 'Спасибо за отзыв!' : 'Thanks for your feedback!'
  const successSubtitle = locale === 'ru' ? 'Мы обязательно рассмотрим ваше сообщение.' : 'We will review your message shortly.'
  const errorMsg = locale === 'ru' ? 'Не удалось отправить. Попробуйте снова.' : 'Failed to send. Please try again.'
  const typeLabel = locale === 'ru' ? 'Тип обращения' : 'Type'
  const nameLabel = locale === 'ru' ? 'Имя' : 'Name'
  const emailLabel = locale === 'ru' ? 'Email' : 'Email'
  const messageLabel = locale === 'ru' ? 'Сообщение' : 'Message'
  const sendAnotherLabel = locale === 'ru' ? 'Отправить ещё' : 'Send another'

  const handleOpen = () => {
    setIsOpen(true)
    setStatus('idle')
    setMessageError('')
  }

  const handleClose = () => {
    setIsOpen(false)
    setStatus('idle')
    setName('')
    setEmail('')
    setMessage('')
    setType('question')
    setMessageError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) {
      setMessageError(messageRequiredError)
      return
    }
    setMessageError('')
    setStatus('loading')

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          message: message.trim(),
          type,
          honeypot: '',
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        setStatus('error')
      } else {
        setStatus('success')
        setName('')
        setEmail('')
        setMessage('')
        setType('question')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={handleOpen}
            className="flex items-center gap-2 shadow-lg px-4 py-2 rounded-full"
            aria-label={buttonLabel}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm font-medium">{buttonLabel}</span>
          </Button>
        )}
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={titleLabel}
          className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl bg-card border border-border shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in-0 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm text-card-foreground">{titleLabel}</span>
            </div>
            <button
              onClick={handleClose}
              aria-label="Close"
              className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-6 gap-3 text-center">
                <CheckCircle className="h-10 w-10 text-green-500" />
                <p className="font-semibold text-card-foreground">{successTitle}</p>
                <p className="text-sm text-muted-foreground">{successSubtitle}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setStatus('idle')}
                >
                  {sendAnotherLabel}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
                {/* Honeypot hidden field */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="hidden"
                  autoComplete="off"
                />

                {/* Type */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="feedback-type" className="text-xs font-medium text-muted-foreground">
                    {typeLabel}
                  </Label>
                  <Select value={type} onValueChange={(v) => setType(v as FeedbackType)}>
                    <SelectTrigger id="feedback-type" className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug">{typeLabels.bug}</SelectItem>
                      <SelectItem value="idea">{typeLabels.idea}</SelectItem>
                      <SelectItem value="question">{typeLabels.question}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="feedback-name" className="text-xs font-medium text-muted-foreground">
                    {nameLabel}
                  </Label>
                  <Input
                    id="feedback-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={namePlaceholder}
                    className="h-9 text-sm"
                    autoComplete="name"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="feedback-email" className="text-xs font-medium text-muted-foreground">
                    {emailLabel}
                  </Label>
                  <Input
                    id="feedback-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={emailPlaceholder}
                    className="h-9 text-sm"
                    autoComplete="email"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="feedback-message" className="text-xs font-medium text-muted-foreground">
                    {messageLabel}
                    <span className="text-destructive ml-1" aria-hidden="true">*</span>
                  </Label>
                  <Textarea
                    id="feedback-message"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value)
                      if (e.target.value.trim()) setMessageError('')
                    }}
                    placeholder={messagePlaceholder}
                    className="text-sm resize-none min-h-[90px]"
                    aria-required="true"
                    aria-invalid={!!messageError}
                    aria-describedby={messageError ? 'feedback-message-error' : undefined}
                  />
                  {messageError && (
                    <p id="feedback-message-error" className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {messageError}
                    </p>
                  )}
                </div>

                {/* Error state */}
                {status === 'error' && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errorMsg}
                  </p>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full mt-1"
                  size="sm"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                      {sendingLabel}
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5 mr-2" />
                      {sendLabel}
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
