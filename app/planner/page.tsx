'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { useAuth } from '@/lib/auth-context'
import { useI18n } from '@/lib/i18n-context'
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
  const { t } = useI18n()
  
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
   * 1. Создаёт копию массива
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
   * getWeekTasks - возвращает задачи для указанной недели с их индексами
   * 
   * useMemo кеширует результат пока tasks не изменится
   * Это оптимизация - не пересчитывать при каждом рендере
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
        return tasks.some(t => t.title.trim())
      default:
        return false
    }
  }, [step, selectedHobby, customHobby, goal, startDate, tasks])

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

      // Показываем уведомление об успехе
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
              onGoalChange={setGoal}
              onStartDateChange={setStartDate}
              t={t}
            />
          )}

          {step === 3 && (
            <TaskPlanningStep
              tasksByWeek={tasksByWeek}
              tasksCount={tasks.length}
              onAddTask={addTask}
              onRemoveTask={removeTask}
              onUpdateTask={updateTask}
              t={t}
            />
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
 * Показывает 3 круга с номерами/га��очками и линии между ними
 */
function StepProgress({ step, t }: { step: number; t: (key: string) => string }) {
  return (
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
          {t('planner.chooseHobby')}
        </span>
        <span className={step >= 2 ? 'text-primary font-medium' : 'text-muted-foreground'}>
          {t('planner.setGoal')}
        </span>
        <span className={step >= 3 ? 'text-primary font-medium' : 'text-muted-foreground'}>
          {t('planner.planTasks')}
        </span>
      </div>
    </div>
  )
}

/**
 * HobbySelectionStep - шаг выбора хобби
 * Показывает сетку предустановленных хобби и поле для ввода своего
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
    <Card>
      <CardHeader>
        <CardTitle>{t('planner.chooseHobbyTitle')}</CardTitle>
        <CardDescription>{t('planner.chooseHobbySubtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {hobbiesLoading ? (
          <div className="flex justify-center py-8">
            <Spinner className="h-8 w-8" />
          </div>
        ) : (
          <>
            {/* Сетка предустановленных хобби */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {hobbies.map((hobby) => {
                const Icon = getHobbyIcon(hobby.icon)
                const isSelected = selectedHobby === hobby.id
                return (
                  <button
                    key={hobby.id}
                    type="button"
                    onClick={() => onHobbySelect(hobby.id)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:border-primary/50',
                      isSelected ? 'border-primary bg-primary/5' : 'border-border'
                    )}
                  >
                    <div className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-lg',
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium">
                      {hobby.icon ? (t(`hobby.${hobby.icon}`) !== `hobby.${hobby.icon}` ? t(`hobby.${hobby.icon}`) : hobby.name) : hobby.name}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Разделитель */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">{t('planner.customHobby')}</span>
              </div>
            </div>

            {/* Поле для ввода своего хобби */}
            <div className="space-y-2">
              <Label htmlFor="custom-hobby">{t('planner.customHobbyLabel')}</Label>
              <Input
                id="custom-hobby"
                placeholder={t('planner.customHobbyPlaceholder')}
                value={customHobby}
                onChange={(e) => onCustomHobbyChange(e.target.value)}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * GoalSettingStep - шаг установки цели
 * Поля для ввода цели и выбора даты начала
 */
function GoalSettingStep({
  goal,
  startDate,
  onGoalChange,
  onStartDateChange,
  t,
}: {
  goal: string
  startDate: string
  onGoalChange: (value: string) => void
  onStartDateChange: (value: string) => void
  t: (key: string) => string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('planner.setGoalTitle')}</CardTitle>
        <CardDescription>{t('planner.setGoalSubtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="goal">{t('planner.goalLabel')}</Label>
          <Textarea
            id="goal"
            placeholder={t('planner.goalPlaceholder')}
            value={goal}
            onChange={(e) => onGoalChange(e.target.value)}
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="start-date">{t('planner.startDate')}</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * TaskPlanningStep - шаг планирования задач
 * 4 секции (по одной на неделю) с задачами
 */
function TaskPlanningStep({
  tasksByWeek,
  tasksCount,
  onAddTask,
  onRemoveTask,
  onUpdateTask,
  t,
}: {
  tasksByWeek: Record<number, Array<{ task: TaskInput; index: number }>>
  tasksCount: number
  onAddTask: (week: number) => void
  onRemoveTask: (index: number) => void
  onUpdateTask: (index: number, field: keyof TaskInput, value: string | number) => void
  t: (key: string) => string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('planner.planTasksTitle')}</CardTitle>
        <CardDescription>{t('planner.planTasksSubtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {[1, 2, 3, 4].map((weekNumber) => (
          <div key={weekNumber} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{t('planner.week')} {weekNumber}</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onAddTask(weekNumber)}
              >
                <Plus className="mr-1 h-4 w-4" />
                {t('planner.addTask')}
              </Button>
            </div>
            <div className="space-y-3">
              {tasksByWeek[weekNumber]?.map(({ task, index }) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder={`${t('planner.week')} ${weekNumber} ${t('planner.taskTitlePlaceholder')}`}
                      value={task.title}
                      onChange={(e) => onUpdateTask(index, 'title', e.target.value)}
                    />
                    <Input
                      placeholder={t('planner.taskDescPlaceholder')}
                      value={task.description}
                      onChange={(e) => onUpdateTask(index, 'description', e.target.value)}
                    />
                  </div>
                  {tasksCount > MIN_TASKS && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-destructive hover:text-destructive"
                      onClick={() => onRemoveTask(index)}
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
    <div className="mt-6 flex justify-between">
      <Button variant="outline" onClick={onPrevious}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        {step === 1 ? t('planner.cancel') : t('planner.back')}
      </Button>
      
      {step < TOTAL_STEPS ? (
        <Button onClick={onNext} disabled={!canProceed}>
          {t('planner.next')}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button onClick={onSubmit} disabled={!canProceed || isSubmitting}>
          {isSubmitting && <Spinner className="mr-2" />}
          {t('planner.createPlan')}
        </Button>
      )}
    </div>
  )
}
