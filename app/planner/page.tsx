'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { useAuth } from '@/lib/auth-context'
import { useI18n } from '@/lib/i18n-context'
import { Header } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { getHobbyIcon } from '@/lib/hobby-icons'
import { Hobby } from '@/lib/db'
import { ArrowLeft, ArrowRight, Check, Plus, Trash2, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ===========================================
// ТИПЫ (Types)
// ===========================================

/**
 * TaskInput - структура для ввода задачи
 * - week_number: номер недели (1-4)
 * - title: название задачи
 * - description: описание задачи (необязательно)
 */
interface TaskInput {
  week_number: number
  title: string
  description: string
}

// ===========================================
// УТИЛИТЫ (Utilities)
// ===========================================

/**
 * fetcher - функция для загрузки данных через SWR
 * SWR использует эту функцию для выполнения HTTP запросов
 * 
 * Простое объяснение:
 * 1. Принимает URL как строку
 * 2. Делает fetch запрос
 * 3. Преобразует ответ в JSON и возвращает
 */
const fetcher = (url: string) => fetch(url).then(res => res.json())

/**
 * getTodayDate - возвращает сегодняшнюю дату в формате YYYY-MM-DD
 * Используется как начальное значение для выбора даты старта
 */
const getTodayDate = () => new Date().toISOString().split('T')[0]

/**
 * createInitialTasks - создаёт начальный набор задач (по одной на каждую неделю)
 * Возвращает массив из 4 пустых задач для недель 1-4
 */
const createInitialTasks = (): TaskInput[] => [
  { week_number: 1, title: '', description: '' },
  { week_number: 2, title: '', description: '' },
  { week_number: 3, title: '', description: '' },
  { week_number: 4, title: '', description: '' },
]

// ===========================================
// КОНСТАНТЫ (Constants)
// ===========================================

const TOTAL_STEPS = 3
const TOTAL_WEEKS = 4
const MIN_TASKS = 4 // Минимум задач (по одной на неделю)

// ===========================================
// ОСНОВНОЙ КОМПОНЕНТ (Main Component)
// ===========================================

export default function PlannerPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { t, locale } = useI18n()
  
  // Состояние текущего шага (1, 2 или 3)
  const [step, setStep] = useState(1)
  // Флаг отправки формы
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // ===========================================
  // СОСТОЯНИЕ ФОРМЫ (Form State)
  // ===========================================
  
  // Шаг 1: Выбор хобби
  const [selectedHobby, setSelectedHobby] = useState<string | null>(null)
  const [customHobby, setCustomHobby] = useState('')
  
  // Шаг 2: Цель и дата старта
  const [goal, setGoal] = useState('')
  const [startDate, setStartDate] = useState(getTodayDate)
  
  // Шаг 3: Задачи по неделям
  const [tasks, setTasks] = useState<TaskInput[]>(createInitialTasks)
  // Флаг — задачи уже были сгенерированы AI (чтобы не генерировать повторно при возврате)
  const [tasksGenerated, setTasksGenerated] = useState(false)
  // Флаг — идёт генерация задач через AI
  const [isGenerating, setIsGenerating] = useState(false)

  // ===========================================
  // ЗАГРУЗКА ДАННЫХ (Data Fetching)
  // ===========================================
  
  /**
   * useSWR - хук для загрузки списка хобби
   * 
   * Как работает:
   * 1. Автоматически делает запрос на /api/hobbies при монтировании
   * 2. Кеширует результат
   * 3. Возвращает data (данные) и isLoading (статус загрузки)
   */
  const { data: hobbiesData, isLoading: hobbiesLoading } = useSWR<{ hobbies: Hobby[] }>(
    '/api/hobbies',
    fetcher
  )

  // Извлекаем список хобби из ответа (или пустой массив если нет данных)
  const hobbies = hobbiesData?.hobbies || []

  // ===========================================
  // ЭФФЕКТЫ (Effects)
  // ===========================================
  
  /**
   * Защита маршрута - редирект на страницу входа если пользователь не авторизован
   * 
   * Как работает:
   * 1. Ждёт пока завершится проверка авторизации (authLoading)
   * 2. Если пользователя нет - перенаправляет на /login
   */
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  // ===========================================
  // ФУНКЦИИ УПРАВЛЕНИЯ ЗАДАЧАМИ (Task Management)
  // ===========================================
  
  /**
   * addTask - добавляет новую задачу для указанной недели
   * 
   * Параметры:
   * - weekNumber: номер недели (1-4) для новой задачи
   * 
   * Как работает:
   * Создаёт копию массива tasks и добавляет в конец новую пустую задачу
   */
  const addTask = useCallback((weekNumber: number) => {
    setTasks(prev => [...prev, { week_number: weekNumber, title: '', description: '' }])
  }, [])

  /**
   * removeTask - удаляет задачу по индексу
   * 
   * Параметры:
   * - index: позиция задачи в массиве
   * 
   * Ограничение:
   * Нельзя удалить если осталось только 4 задачи (минимум по одной на неделю)
   * 
   * Как работает:
   * Фильтрует массив, оставляя все элементы кроме указанного индекса
   */
  const removeTask = useCallback((index: number) => {
    setTasks(prev => {
      if (prev.length <= MIN_TASKS) return prev
      return prev.filter((_, i) => i !== index)
    })
  }, [])

  /**
   * updateTask - обновляет поле задачи
   * 
   * Параметры:
   * - index: позиция задачи в массиве
   * - field: какое поле обновить ('week_number', 'title' или 'description')
   * - value: новое значение
   * 
   * Как работает:
   * 1. Создаёт коп��������ю массива
   * 2. Обновляет указанное поле у нужной задачи
   * 3. Устанавливает новый массив
   */
  const updateTask = useCallback((index: number, field: keyof TaskInput, value: string | number) => {
    setTasks(prev => {
      const newTasks = [...prev]
      newTasks[index] = { ...newTasks[index], [field]: value }
      return newTasks
    })
  }, [])

  /**
   * generateTasks - запрашивает у AI генерацию задач на основе хобби и цели
   * 
   * Как работает:
   * 1. Собирает имя хобби (из списка или кастомное) и цель
   * 2. Отправляет POST запрос на /api/generate-tasks
   * 3. AI возвращает массив задач по 4 неделям
   * 4. Заменяет текущие задачи сгенерированными
   */
  const generateTasks = useCallback(async () => {
    setIsGenerating(true)
    try {
      const hobbyData = hobbies.find(h => h.id === selectedHobby)
      // Берём локализованное имя хобби если оно есть в переводах, иначе оригинальное
      const hobbyName = hobbyData
        ? (hobbyData.icon && t(`hobby.${hobbyData.icon}`) !== `hobby.${hobbyData.icon}`
            ? t(`hobby.${hobbyData.icon}`)
            : hobbyData.name)
        : customHobby

      const response = await fetch('/api/generate-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hobby: hobbyName, goal, locale }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate tasks')
      }

      // Заменяем задачи сгенерированными от AI
      setTasks(data.tasks.map((task: TaskInput) => ({
        week_number: task.week_number,
        title: task.title,
        description: task.description || '',
      })))
      setTasksGenerated(true)
    } catch {
      toast.error(t('planner.generationError'))
      // При ошибке оставляем пустые задачи чтобы пользователь заполнил вручную
      setTasksGenerated(true)
    } finally {
      setIsGenerating(false)
    }
  }, [hobbies, selectedHobby, customHobby, goal, locale, t])

  /**
   * Автогенерация задач при первом переходе на шаг 3
   * Если задачи уже были сгенерированы (tasksGenerated=true) — повторно не вызывается
   */
  useEffect(() => {
    if (step === 3 && !tasksGenerated && !isGenerating) {
      generateTasks()
    }
  }, [step, tasksGenerated, isGenerating, generateTasks])

  /**
   * getWeekTasks - возвращает задачи для указанной недели с их индексами
   * 
   * useMemo кеширует результат пока tasks не изменится
   * Это оптимизация - не пересчитывать при ��аждом рендере
   * 
   * Возвращает объект где ключ - номер недели, значение - массив задач с индексами
   */
  const tasksByWeek = useMemo(() => {
    const result: Record<number, Array<{ task: TaskInput; index: number }>> = {}
    
    for (let week = 1; week <= TOTAL_WEEKS; week++) {
      result[week] = tasks
        .map((task, index) => ({ task, index }))
        .filter(({ task }) => task.week_number === week)
    }
    
    return result
  }, [tasks])

  // ===========================================
  // ФУНКЦИИ НАВИГАЦИИ (Navigation)
  // ===========================================
  
  /**
   * canProceed - проверяет можно ли перейти на следующий шаг
   * 
   * Правила:
   * - Шаг 1: нужно выбрать хобби ИЛИ ввести своё
   * - Шаг 2: нужно заполнить цель И выбрать дату
   * - Шаг 3: нужно хотя бы одну задачу с названием
   */
  const canProceed = useMemo(() => {
    switch (step) {
      case 1:
        return Boolean(selectedHobby || customHobby.trim())
      case 2:
        return Boolean(goal.trim() && startDate)
      case 3:
        return tasksGenerated && !isGenerating && tasks.some(t => t.title.trim())
      default:
        return false
    }
  }, [step, selectedHobby, customHobby, goal, startDate, tasks, tasksGenerated, isGenerating])

  /**
   * goToNextStep - переход на следующий шаг
   */
  const goToNextStep = useCallback(() => {
    if (step < TOTAL_STEPS) {
      setStep(prev => prev + 1)
    }
  }, [step])

  /**
   * goToPreviousStep - переход на предыдущий шаг или возврат на дашборд
   */
  const goToPreviousStep = useCallback(() => {
    if (step > 1) {
      setStep(prev => prev - 1)
    } else {
      router.push('/dashboard')
    }
  }, [step, router])

  // ===========================================
  // ОБРАБОТКА ВЫБОРА ХОББИ (Hobby Selection)
  // ===========================================
  
  /**
   * handleHobbySelect - выбор предустановленного хобби
   * Очищает поле кастомного хобби при выборе из списка
   */
  const handleHobbySelect = useCallback((hobbyId: string) => {
    setSelectedHobby(hobbyId)
    setCustomHobby('')
  }, [])

  /**
   * handleCustomHobbyChange - ввод своего хобби
   * Очищает выбранное хобби при вводе кастомного
   */
  const handleCustomHobbyChange = useCallback((value: string) => {
    setCustomHobby(value)
    if (value) {
      setSelectedHobby(null)
    }
  }, [])

  // ===========================================
  // ОТПРАВКА ФОРМЫ (Form Submission)
  // ===========================================
  
  /**
   * handleSubmit - отправка данных на сервер для создания плана
   * 
   * Как работает:
   * 1. Устанавливает флаг загрузки
   * 2. Собирает данные из формы
   * 3. Отправляет POST запрос на /api/plans
   * 4. При успехе - показывает уведомлен��е и переходит на страницу плана
   * 5. При ошибке - показывает сообщение об ошибке
   * 6. В конце снимает флаг загрузки
   */
  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Находим данные выбранного хобби для уведомления
      const selectedHobbyData = hobbies.find(h => h.id === selectedHobby)
      
      // Собираем данные для отправки
      const payload = {
        hobby_id: selectedHobby,
        custom_hobby_name: selectedHobby ? null : customHobby.trim(),
        goal: goal.trim(),
        start_date: startDate,
        // Фильтруем только задачи с заполненным названием
        tasks: tasks
          .filter(t => t.title.trim())
          .map(t => ({
            week_number: t.week_number,
            title: t.title.trim(),
            description: t.description.trim() || null,
          })),
      }

      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create plan')
      }

      // Показываем уведомление об успе��е
      const hobbyName = selectedHobbyData?.name || customHobby
      toast.success(`${hobbyName} ${t('toast.planCreated')}`)
      
      // Переходим на страницу созданного плана
      router.push(`/plan/${data.plan.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create plan')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ===========================================
  // РЕНДЕР: СОСТОЯНИЯ ЗАГРУЗКИ (Loading States)
  // ===========================================
  
  // Показываем спиннер пока проверяется авторизация
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

  // Если нет пользователя - ничего не рендерим (редирект в useEffect)
  if (!user) return null

  // ===========================================
  // РЕНДЕР: ОСНОВНОЙ КОНТЕНТ (Main Render)
  // ===========================================
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8">
          {/* Индикатор прогресса по шагам */}
          <StepProgress step={step} t={t} />

          {/* Контент текущего шага */}
          {step === 1 && (
            <HobbySelectionStep
              hobbies={hobbies}
              hobbiesLoading={hobbiesLoading}
              selectedHobby={selectedHobby}
              customHobby={customHobby}
              onHobbySelect={handleHobbySelect}
              onCustomHobbyChange={handleCustomHobbyChange}
              t={t}
            />
          )}

          {step === 2 && (
            <GoalSettingStep
              goal={goal}
              startDate={startDate}
              hobbyName={
                selectedHobby
                  ? (() => {
                      const hobbyData = hobbies.find(h => h.id === selectedHobby)
                      return hobbyData?.icon && t(`hobby.${hobbyData.icon}`) !== `hobby.${hobbyData.icon}`
                        ? t(`hobby.${hobbyData.icon}`)
                        : hobbyData?.name || ''
                    })()
                  : customHobby
              }
              onGoalChange={setGoal}
              onStartDateChange={setStartDate}
              t={t}
            />
          )}

          {step === 3 && (
            <TaskPlanningStep
              tasksByWeek={tasksByWeek}
              tasksCount={tasks.length}
              isGenerating={isGenerating}
              tasksGenerated={tasksGenerated}
              onGenerateTasks={generateTasks}
              onAddTask={addTask}
              onRemoveTask={removeTask}
              onUpdateTask={updateTask}
              t={t}
            />
          )}

          {/* Commitment message before final step */}
          {step === 3 && (
            <div className="mt-8 p-6 rounded-lg border border-primary/30 bg-primary/3 space-y-2">
              <p className="text-sm font-semibold text-primary">{t('planner.commitmentTitle')}</p>
              <p className="text-sm text-muted-foreground">
                {t('planner.commitmentDesc').replace('{count}', String(tasks.length))}
              </p>
            </div>
          )}

          {/* Кнопки навигации */}
          <NavigationButtons
            step={step}
            canProceed={canProceed}
            isSubmitting={isSubmitting}
            onPrevious={goToPreviousStep}
            onNext={goToNextStep}
            onSubmit={handleSubmit}
            t={t}
          />
        </div>
      </main>
    </div>
  )
}

// ===========================================
// ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ (Sub-components)
// ===========================================

/**
 * StepProgress - визуальный индикатор прогресса по шагам
 * Показывает 3 круга с номерами/��а��очками и линии между ними
 */
function StepProgress({ step, t }: { step: number; t: (key: string) => string }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full font-bold transition-all',
                step === s
                  ? 'border-2 border-primary bg-primary text-primary-foreground text-base'
                  : step > s
                    ? 'border-2 border-accent bg-accent text-accent-foreground text-sm'
                    : 'border-2 border-muted-foreground/30 bg-muted text-muted-foreground text-sm opacity-40'
              )}
            >
              {step > s ? <Check className="h-6 w-6" /> : s}
            </div>
            {s < 3 && (
              <div
                className={cn(
                  'h-1 w-24 sm:w-32 md:w-40 transition-all',
                  step > s ? 'bg-accent' : step === s ? 'bg-primary' : 'bg-muted-foreground/30'
                )}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between text-xs font-semibold uppercase tracking-wide">
        <span className={step === 1 ? 'text-primary' : step > 1 ? 'text-accent' : 'text-muted-foreground opacity-50'}>
          {t('planner.chooseHobby')}
        </span>
        <span className={step === 2 ? 'text-primary' : step > 2 ? 'text-accent' : 'text-muted-foreground opacity-50'}>
          {t('planner.setGoal')}
        </span>
        <span className={step === 3 ? 'text-primary' : 'text-muted-foreground opacity-50'}>
          {t('planner.planTasks')}
        </span>
      </div>
    </div>
  )
}

/**
 * HobbySelectionStep - шаг выбора хобби
 * Единственный выбор: из списка ИЛИ ввести своё (не обе одновременно)
 */
function HobbySelectionStep({
  hobbies,
  hobbiesLoading,
  selectedHobby,
  customHobby,
  onHobbySelect,
  onCustomHobbyChange,
  t,
}: {
  hobbies: Hobby[]
  hobbiesLoading: boolean
  selectedHobby: string | null
  customHobby: string
  onHobbySelect: (id: string) => void
  onCustomHobbyChange: (value: string) => void
  t: (key: string) => string
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">{t('planner.hobbyTitle')}</h2>
        <p className="text-muted-foreground">{t('planner.hobbySubtitle')}</p>
      </div>

      {hobbiesLoading ? (
        <div className="flex justify-center py-8">
          <Spinner className="h-8 w-8" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Сетка хобби - основной выбор */}
          <div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {hobbies.map((hobby) => {
                const Icon = getHobbyIcon(hobby.icon)
                const isSelected = selectedHobby === hobby.id
                return (
                  <button
                    key={hobby.id}
                    type="button"
                    onClick={() => onHobbySelect(hobby.id)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-lg border p-4 transition-all hover:border-primary/50',
                      isSelected ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30'
                    )}
                  >
                    <div className={cn(
                      'flex h-14 w-14 items-center justify-center rounded-lg transition-all',
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground group-hover:bg-primary/10'
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium text-center">
                      {hobby.icon ? (t(`hobby.${hobby.icon}`) !== `hobby.${hobby.icon}` ? t(`hobby.${hobby.icon}`) : hobby.name) : hobby.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Разделитель */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-sm text-muted-foreground">{t('planner.hobbyOr')}</span>
            </div>
          </div>

          {/* Поле для своего хобби - если ничего не выбрано */}
          <div className="space-y-2">
            <Label htmlFor="custom-hobby" className="text-base font-medium">{t('planner.hobbyEnterOwn')}</Label>
            <Input
              id="custom-hobby"
              placeholder={t('planner.hobbyOwnPlaceholder')}
              value={customHobby}
              onChange={(e) => onCustomHobbyChange(e.target.value)}
              className="py-2 text-base"
            />
            {customHobby && <p className="text-sm text-muted-foreground">{t('planner.hobbyOwnHint').replace('{hobby}', customHobby)}</p>}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * GoalSettingStep - шаг установки цели
 * Четкое указание: "Вот ваши 4 недели. Уточните, чего вы хотите достичь"
 */
function GoalSettingStep({
  goal,
  startDate,
  hobbyName,
  onGoalChange,
  onStartDateChange,
  t,
}: {
  goal: string
  startDate: string
  hobbyName: string
  onGoalChange: (value: string) => void
  onStartDateChange: (value: string) => void
  t: (key: string) => string
}) {
  return (
    <div className="space-y-8">
      <div>
        {/* Hobby badge */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            {hobbyName}
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-2">{t('planner.goalJourneyTitle')}</h2>
        <p className="text-muted-foreground">{t('planner.goalJourneySubtitle')}</p>
      </div>

      <div className="space-y-6">
        {/* Timeline показывающая 4 недели */}
        <div className="bg-muted/30 rounded-lg p-6">
          <div className="mb-4">
            <p className="text-sm font-semibold text-primary">{t('planner.structureLabel')}</p>
            <p className="font-medium mt-2">{t('planner.structureWeeks')}</p>
            <p className="text-sm text-muted-foreground mt-1">{t('planner.structureDesc')}</p>
          </div>
        </div>

        {/* Goal Input */}
        <div className="space-y-2">
          <Label htmlFor="goal" className="text-base font-medium">{t('planner.goalSpecific')}</Label>
          <Textarea
            id="goal"
            placeholder={t('planner.goalSpecificPlaceholder')}
            value={goal}
            onChange={(e) => onGoalChange(e.target.value)}
            rows={3}
            className="resize-none"
          />
          {goal && <p className="text-sm text-muted-foreground">{t('planner.goalAiHint')}</p>}
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <Label htmlFor="start-date" className="text-base font-medium">{t('planner.startDateLabel')}</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="max-w-xs"
          />
          <p className="text-sm text-muted-foreground">{t('planner.startDateHint')}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * WeekTimeline - визуальный таймлайн 4-х недель
 * Показывает прогресс по неделям с соединительными линиями
 */
function WeekTimeline({ currentWeek, t }: { currentWeek: number; t: (key: string) => string }) {
  return (
    <div className="mb-8 px-2">
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4].map((week, index) => (
          <div key={week} className="flex items-center flex-1 last:flex-none">
            {/* Week circle and label */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all',
                  week <= currentWeek
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {week}
              </div>
              <span className="text-xs mt-2 text-muted-foreground hidden sm:block">
                {t('planner.weekLabel')} {week}
              </span>
              <span className="text-[10px] mt-1 text-muted-foreground/70">
                {week === 1
                  ? t('planner.timelineCurrent')
                  : week === 4
                  ? t('planner.timelineFinish')
                  : t('planner.timelineUpcoming')}
              </span>
            </div>
            {/* Connecting line */}
            {index < 3 && (
              <div
                className={cn(
                  'flex-1 h-1 mx-2 rounded-full transition-all',
                  week < currentWeek ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * TaskPlanningStep - шаг планирования задач
 * Четкое отображение структуры 4 недель, каждая неделя отдельная карточка
 */
function TaskPlanningStep({
  tasksByWeek,
  tasksCount,
  isGenerating,
  tasksGenerated,
  onGenerateTasks,
  onAddTask,
  onRemoveTask,
  onUpdateTask,
  t,
}: {
  tasksByWeek: Record<number, Array<{ task: TaskInput; index: number }>>
  tasksCount: number
  isGenerating: boolean
  tasksGenerated: boolean
  onGenerateTasks: () => void
  onAddTask: (week: number) => void
  onRemoveTask: (index: number) => void
  onUpdateTask: (index: number, field: keyof TaskInput, value: string | number) => void
  t: (key: string) => string
}) {
  return (
    <div className="space-y-8">
      {/* Week Timeline - визуальное отображение 4-недельного пути */}
      <WeekTimeline currentWeek={1} t={t} />
      
      <div>
        <h2 className="text-2xl font-bold mb-2">{t('planner.tasksTitle')}</h2>
        <p className="text-muted-foreground mb-4">{t('planner.tasksSubtitle')}</p>
        {tasksGenerated && !isGenerating && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onGenerateTasks}
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {t('planner.regenerateAi')}
          </Button>
        )}
      </div>

      {isGenerating ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <Spinner className="h-10 w-10" />
          <p className="text-base text-muted-foreground font-medium">{t('planner.generatingPlan')}</p>
          <p className="text-sm text-muted-foreground">{t('planner.generatingWait')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {[1, 2, 3, 4].map((weekNumber) => (
            <Card key={weekNumber} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{t('planner.weekLabel')} {weekNumber}</CardTitle>
                    {tasksByWeek[weekNumber]?.length > 0 && (
                      <CardDescription className="mt-1">
                        {tasksByWeek[weekNumber].length === 1
                          ? t('planner.taskCount').replace('{count}', '1')
                          : t('planner.taskCountPlural').replace('{count}', String(tasksByWeek[weekNumber].length))}
                      </CardDescription>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddTask(weekNumber)}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    {t('planner.addTaskBtn')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasksByWeek[weekNumber]?.length > 0 ? (
                    tasksByWeek[weekNumber].map(({ task, index }, taskIndex) => (
                      <div
                        key={index}
                        className={cn(
                          'p-4 rounded-lg border space-y-2 transition-all',
                          taskIndex === 0 && tasksByWeek[weekNumber].length > 0
                            ? 'border-primary/30 bg-primary/5'
                            : 'border-border bg-muted/30'
                        )}
                      >
                        {taskIndex === 0 && <p className="text-xs font-semibold text-primary uppercase">{t('planner.startHere')} →</p>}
                        <Input
                          placeholder={t('planner.taskTitleInput')}
                          value={task.title}
                          onChange={(e) => onUpdateTask(index, 'title', e.target.value)}
                          className="border-0 bg-transparent p-0 font-medium shadow-none focus-visible:ring-0 h-auto text-base"
                        />
                        <Textarea
                          placeholder={t('planner.taskDescInput')}
                          value={task.description}
                          onChange={(e) => onUpdateTask(index, 'description', e.target.value)}
                          className="border-0 bg-transparent p-0 text-sm text-muted-foreground shadow-none focus-visible:ring-0 min-h-[60px] resize-none"
                          rows={2}
                        />
                        {tasksCount > MIN_TASKS && (
                          <div className="pt-2 flex justify-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => onRemoveTask(index)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              {t('planner.deleteTask')}
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      {t('planner.noTasksEmpty')}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * NavigationButtons - кнопки навигации между шагами
 */
function NavigationButtons({
  step,
  canProceed,
  isSubmitting,
  onPrevious,
  onNext,
  onSubmit,
  t,
}: {
  step: number
  canProceed: boolean
  isSubmitting: boolean
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
  t: (key: string) => string
}) {
  return (
    <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
      {step > 1 && (
        <Button variant="ghost" onClick={onPrevious} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('planner.back')}
        </Button>
      )}
      <div className="flex-1" />
      
      {step < TOTAL_STEPS ? (
        <Button size="lg" onClick={onNext} disabled={!canProceed} className="gap-2 px-8">
          {t('planner.next')}
          <ArrowRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button size="lg" onClick={onSubmit} disabled={!canProceed || isSubmitting} className="gap-2 px-8">
          {isSubmitting && <Spinner className="h-4 w-4 mr-1" />}
          {t('planner.createPlan')}
        </Button>
      )}
    </div>
  )
}
