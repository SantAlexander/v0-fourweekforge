'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Locale = 'en' | 'ru'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

// English translations
const en = {
  // Header
  'header.dashboard': 'Dashboard',
  'header.newPlan': 'New Plan',
  'header.login': 'Login',
  'header.getStarted': 'Get Started',
  'header.logout': 'Logout',
  
  // Landing Page
  'landing.badge': 'Master any hobby in just 4 weeks',
  'landing.title': 'Turn Your Passion Into',
  'landing.titleHighlight': 'Progress',
  'landing.subtitle': 'FourWeekForge helps you create structured learning plans for any hobby. Set weekly goals, track your progress, and transform curiosity into skill.',
  'landing.cta.start': 'Start Your Journey',
  'landing.cta.signin': 'Sign In',
  
  'landing.howItWorks': 'How It Works',
  'landing.howItWorksSubtitle': 'Four simple steps to start mastering your new hobby',
  
  'landing.feature1.title': 'Set Clear Goals',
  'landing.feature1.description': 'Define what you want to achieve with your new hobby in just 4 weeks.',
  'landing.feature2.title': 'Weekly Milestones',
  'landing.feature2.description': 'Break down your learning into manageable weekly tasks and objectives.',
  'landing.feature3.title': 'Track Progress',
  'landing.feature3.description': 'Check off completed tasks and watch your progress grow day by day.',
  'landing.feature4.title': 'Stay Motivated',
  'landing.feature4.description': 'Visual progress tracking keeps you engaged and motivated throughout.',
  
  'landing.popularHobbies': 'Popular Hobbies',
  'landing.popularHobbiesSubtitle': 'Choose from our curated list or create your own custom hobby plan',
  'landing.moreHobbies': 'And many more... or create your own custom hobby!',
  
  'landing.ctaTitle': 'Ready to Forge Your Skills?',
  'landing.ctaSubtitle': 'Join thousands of learners who have transformed their hobbies into skills. Start your 4-week journey today.',
  'landing.ctaButton': 'Create Free Account',
  
  'landing.footer': 'Master any hobby in 4 weeks. Built with passion.',
  
  // Hobby names
  'hobby.guitar': 'Guitar',
  'hobby.painting': 'Painting',
  'hobby.photography': 'Photography',
  'hobby.coding': 'Coding',
  'hobby.cooking': 'Cooking',
  'hobby.drawing': 'Drawing',
  
  // Auth
  'auth.welcomeBack': 'Welcome Back',
  'auth.signInSubtitle': 'Sign in to continue your learning journey',
  'auth.email': 'Email',
  'auth.emailPlaceholder': 'you@example.com',
  'auth.password': 'Password',
  'auth.passwordPlaceholder': 'Enter your password',
  'auth.signIn': 'Sign In',
  'auth.noAccount': "Don't have an account?",
  'auth.signUp': 'Sign up',
  
  'auth.createAccount': 'Create Your Account',
  'auth.createAccountSubtitle': 'Start your 4-week journey to master any hobby',
  'auth.name': 'Name',
  'auth.namePlaceholder': 'Your name',
  'auth.passwordHint': 'At least 6 characters',
  'auth.createAccountButton': 'Create Account',
  'auth.hasAccount': 'Already have an account?',
  
  // Dashboard
  'dashboard.welcome': 'Welcome back,',
  'dashboard.subtitle': 'Track your progress and keep forging your skills',
  'dashboard.activePlans': 'Active Plans',
  'dashboard.tasksDone': 'Tasks Done',
  'dashboard.tasksLeft': 'Tasks Left',
  'dashboard.completed': 'Completed',
  'dashboard.active': 'Active',
  'dashboard.paused': 'Paused',
  
  'dashboard.noActivePlans': 'No Active Plans',
  'dashboard.noActivePlansSubtitle': 'Start your journey by creating a new 4-week learning plan for any hobby',
  'dashboard.createFirstPlan': 'Create Your First Plan',
  
  'dashboard.noCompletedPlans': 'No Completed Plans Yet',
  'dashboard.noCompletedPlansSubtitle': 'Complete all tasks in a plan to see it here',
  
  'dashboard.noPausedPlans': 'No Paused Plans',
  'dashboard.noPausedPlansSubtitle': 'Plans you pause will appear here',
  
  // Planner
  'planner.chooseHobby': 'Choose Hobby',
  'planner.setGoal': 'Set Goal',
  'planner.planTasks': 'Plan Tasks',
  
  'planner.chooseHobbyTitle': 'Choose Your Hobby',
  'planner.chooseHobbySubtitle': 'Select from popular hobbies or create your own',
  'planner.customHobby': 'Or custom hobby',
  'planner.customHobbyLabel': 'Custom Hobby Name',
  'planner.customHobbyPlaceholder': 'e.g., Chess, Origami, Gardening...',
  
  'planner.setGoalTitle': 'Set Your Goal',
  'planner.setGoalSubtitle': 'What do you want to achieve in 4 weeks?',
  'planner.goalLabel': 'Your 4-Week Goal',
  'planner.goalPlaceholder': 'e.g., Learn to play 3 songs on guitar, Master basic watercolor techniques...',
  'planner.startDate': 'Start Date',
  
  'planner.planTasksTitle': 'Plan Your Weekly Tasks',
  'planner.planTasksSubtitle': 'Break down your goal into weekly milestones',
  'planner.week': 'Week',
  'planner.addTask': 'Add Task',
  'planner.taskTitlePlaceholder': 'task title',
  'planner.taskDescPlaceholder': 'Description (optional)',
  'planner.autoGenerate': 'Auto-generate 28 tasks',
  'planner.autoGenerating': 'Generating tasks...',
  'planner.clearTasks': 'Clear all',
  
  'planner.cancel': 'Cancel',
  'planner.back': 'Back',
  'planner.next': 'Next',
  'planner.createPlan': 'Create Plan',
  
  // Plan Detail
  'plan.backToDashboard': 'Back to Dashboard',
  'plan.duration': 'Duration',
  'plan.currentWeek': 'Current Week',
  'plan.weekOf': 'of 4',
  'plan.overallProgress': 'Overall Progress',
  'plan.pause': 'Pause',
  'plan.resume': 'Resume',
  'plan.markComplete': 'Mark Complete',
  'plan.deletePlan': 'Delete Plan?',
  'plan.deleteConfirm': 'This will permanently delete your plan and all its tasks. This action cannot be undone.',
  'plan.deleteCancel': 'Cancel',
  'plan.delete': 'Delete',
  
  'plan.notFound': 'Plan Not Found',
  'plan.notFoundSubtitle': "This plan may have been deleted or you don't have access to it.",
  
  // Plan Card
  'planCard.progress': 'progress',
  'planCard.tasks': 'tasks',
  
  // Week Tasks
  'weekTasks.allDone': 'All tasks completed!',
  'weekTasks.noTasks': 'No tasks for this week',
  
  // Toast messages
  'toast.welcomeBack': 'Welcome back!',
  'toast.accountCreated': 'Account created successfully!',
  'toast.taskCompleted': 'Task completed!',
  'toast.planPaused': 'Plan paused!',
  'toast.planResumed': 'Plan resumed!',
  'toast.planCompleted': 'Plan completed!',
  'toast.planDeleted': 'Plan deleted',
  'toast.planCreated': 'plan has been created!',
  
  // Language
  'language.english': 'English',
  'language.russian': 'Russian',
  
  // Registration errors
  'error.NAME_REQUIRED': 'Please enter your name',
  'error.NAME_TOO_SHORT': 'Name must be at least 2 characters',
  'error.EMAIL_REQUIRED': 'Please enter your email address',
  'error.EMAIL_INVALID': 'Please enter a valid email address',
  'error.PASSWORD_REQUIRED': 'Please enter a password',
  'error.PASSWORD_TOO_SHORT': 'Password must be at least 6 characters',
  'error.EMAIL_EXISTS': 'An account with this email already exists',
  'error.REGISTRATION_FAILED': 'Registration failed. Please try again.',
  'error.LOGIN_FAILED': 'Invalid email or password',
  'error.DATABASE_ERROR': 'Database connection error. Please try again later.',
  
  // Export
  'export.title': 'Export Plan',
  'export.json': 'Download JSON',
  'export.csv': 'Download CSV',
  'export.pdf': 'Print / PDF',
}

// Russian translations
const ru: Record<string, string> = {
  // Header
  'header.dashboard': 'Панель',
  'header.newPlan': 'Новый план',
  'header.login': 'Войти',
  'header.getStarted': 'Начать',
  'header.logout': 'Выйти',
  
  // Landing Page
  'landing.badge': 'Освой любое хобби за 4 недели',
  'landing.title': 'Преврати увлечение в',
  'landing.titleHighlight': 'Прогресс',
  'landing.subtitle': 'FourWeekForge поможет создать структурированный план обучения для любого хобби. Ставь еженедельные цели, отслеживай прогресс и превращай любопытство в навык.',
  'landing.cta.start': 'Начать путь',
  'landing.cta.signin': 'Войти',
  
  'landing.howItWorks': 'Как это работает',
  'landing.howItWorksSubtitle': 'Четыре простых шага к освоению нового хобби',
  
  'landing.feature1.title': 'Ставь четкие цели',
  'landing.feature1.description': 'Определи, чего хочешь достичь с новым хобби всего за 4 недели.',
  'landing.feature2.title': 'Еженедельные этапы',
  'landing.feature2.description': 'Раздели обучение на выполнимые еженедельные задачи и цели.',
  'landing.feature3.title': 'Отслеживай прогресс',
  'landing.feature3.description': 'Отмечай выполненные задачи и наблюдай за ростом день за днем.',
  'landing.feature4.title': 'Сохраняй мотивацию',
  'landing.feature4.description': 'Визуальное отслеживание прогресса поддерживает вовлеченность и мотивацию.',
  
  'landing.popularHobbies': 'Популярные хобби',
  'landing.popularHobbiesSubtitle': 'Выбери из списка или создай свой план',
  'landing.moreHobbies': 'И многое другое... или создай своё хобби!',
  
  'landing.ctaTitle': 'Готов прокачать навыки?',
  'landing.ctaSubtitle': 'Присоединяйся к тысячам учеников, которые превратили хобби в навыки. Начни свой 4-недельный путь сегодня.',
  'landing.ctaButton': 'Создать аккаунт бесплатно',
  
  'landing.footer': 'Освой любое хобби за 4 недели. Создано с любовью.',
  
  // Hobby names
  'hobby.guitar': 'Гитара',
  'hobby.painting': 'Живопись',
  'hobby.photography': 'Фотография',
  'hobby.coding': 'Программирование',
  'hobby.cooking': 'Кулинария',
  'hobby.drawing': 'Рисование',
  
  // Auth
  'auth.welcomeBack': 'С возвращением',
  'auth.signInSubtitle': 'Войдите, чтобы продолжить обучение',
  'auth.email': 'Email',
  'auth.emailPlaceholder': 'you@example.com',
  'auth.password': 'Пароль',
  'auth.passwordPlaceholder': 'Введите пароль',
  'auth.signIn': 'Войти',
  'auth.noAccount': 'Нет аккаунта?',
  'auth.signUp': 'Зарегистрироваться',
  
  'auth.createAccount': 'Создать аккаунт',
  'auth.createAccountSubtitle': 'Начни 4-недельный путь к освоению любого хобби',
  'auth.name': 'Имя',
  'auth.namePlaceholder': 'Ваше имя',
  'auth.passwordHint': 'Минимум 6 символов',
  'auth.createAccountButton': 'Создать аккаунт',
  'auth.hasAccount': 'Уже есть аккаунт?',
  
  // Dashboard
  'dashboard.welcome': 'С возвращением,',
  'dashboard.subtitle': 'Отслеживай прогресс и продолжай прокачивать навыки',
  'dashboard.activePlans': 'Активные планы',
  'dashboard.tasksDone': 'Задач выполнено',
  'dashboard.tasksLeft': 'Задач осталось',
  'dashboard.completed': 'Завершено',
  'dashboard.active': 'Активные',
  'dashboard.paused': 'На паузе',
  
  'dashboard.noActivePlans': 'Нет активных планов',
  'dashboard.noActivePlansSubtitle': 'Начни путь, создав новый 4-недельный план для любого хобби',
  'dashboard.createFirstPlan': 'Создать первый план',
  
  'dashboard.noCompletedPlans': 'Пока нет завершенных планов',
  'dashboard.noCompletedPlansSubtitle': 'Выполни все задачи плана, чтобы увидеть его здесь',
  
  'dashboard.noPausedPlans': 'Нет планов на паузе',
  'dashboard.noPausedPlansSubtitle': 'Приостановленные планы появятся здесь',
  
  // Planner
  'planner.chooseHobby': 'Выбор хобби',
  'planner.setGoal': 'Цель',
  'planner.planTasks': 'Задачи',
  
  'planner.chooseHobbyTitle': 'Выбери своё хобби',
  'planner.chooseHobbySubtitle': 'Выбери из популярных или создай своё',
  'planner.customHobby': 'Или с��оё хобби',
  'planner.customHobbyLabel': 'Название хобби',
  'planner.customHobbyPlaceholder': 'напр., Шахматы, Оригами, Садоводство...',
  
  'planner.setGoalTitle': 'Установи цель',
  'planner.setGoalSubtitle': 'Чего хочешь достичь за 4 недели?',
  'planner.goalLabel': 'Твоя 4-недельная цель',
  'planner.goalPlaceholder': 'напр., Научиться играть 3 песни на гитаре, Освоить базовые техники акварели...',
  'planner.startDate': 'Дата начала',
  
  'planner.planTasksTitle': 'Спланируй еженедельные задачи',
  'planner.planTasksSubtitle': 'Разбей цель на еженедельные этапы',
  'planner.week': 'Неделя',
  'planner.addTask': 'Добавить задачу',
  'planner.taskTitlePlaceholder': 'название задачи',
  'planner.taskDescPlaceholder': 'Описание (необязательно)',
  'planner.autoGenerate': 'Автогенерация 28 задач',
  'planner.autoGenerating': 'Генерация задач...',
  'planner.clearTasks': 'Очистить все',
  
  'planner.cancel': 'Отмена',
  'planner.back': 'Назад',
  'planner.next': 'Далее',
  'planner.createPlan': 'Создать план',
  
  // Plan Detail
  'plan.backToDashboard': 'Назад к панели',
  'plan.duration': 'Период',
  'plan.currentWeek': 'Текущая неделя',
  'plan.weekOf': 'из 4',
  'plan.overallProgress': 'Общий прогресс',
  'plan.pause': 'Пауза',
  'plan.resume': 'Продолжить',
  'plan.markComplete': 'Завершить',
  'plan.deletePlan': 'Удалить план?',
  'plan.deleteConfirm': 'Это навсегда удалит план и все задачи. Действие нельзя отменить.',
  'plan.deleteCancel': 'Отмена',
  'plan.delete': 'Удалить',
  
  'plan.notFound': 'План не найден',
  'plan.notFoundSubtitle': 'Этот план был удален или у вас нет к нему доступа.',
  
  // Plan Card
  'planCard.progress': 'прогресс',
  'planCard.tasks': 'задач',
  
  // Week Tasks
  'weekTasks.allDone': 'Все задачи выполнены!',
  'weekTasks.noTasks': 'Нет задач на эту неделю',
  
  // Toast messages
  'toast.welcomeBack': 'С возвращением!',
  'toast.accountCreated': 'Аккаунт успешно создан!',
  'toast.taskCompleted': 'Задача выполнена!',
  'toast.planPaused': 'План приостановлен!',
  'toast.planResumed': 'План возобновлен!',
  'toast.planCompleted': 'План завершен!',
  'toast.planDeleted': 'План удален',
  'toast.planCreated': 'план создан!',
  
  // Language
  'language.english': 'English',
  'language.russian': 'Русский',
  
  // Registration errors
  'error.NAME_REQUIRED': 'Пожалуйста, введите имя',
  'error.NAME_TOO_SHORT': 'Имя должно содержать минимум 2 символа',
  'error.EMAIL_REQUIRED': 'Пожалуйста, введите email',
  'error.EMAIL_INVALID': 'Пожалуйста, введите корректный email',
  'error.PASSWORD_REQUIRED': 'Пожалуйста, введите пароль',
  'error.PASSWORD_TOO_SHORT': 'Пароль должен содержать минимум 6 символов',
  'error.EMAIL_EXISTS': 'Аккаунт с таким email уже существует',
  'error.REGISTRATION_FAILED': 'Ошибка регистрации. Попробуйте снова.',
  'error.LOGIN_FAILED': 'Неверный email или пароль',
  'error.DATABASE_ERROR': 'Ошибка подключения к базе данных. Попробуйте позже.',
  
  // Export
  'export.title': 'Экспорт плана',
  'export.json': 'Скачать JSON',
  'export.csv': 'Скачать CSV',
  'export.pdf': 'Печать / PDF',
}

const translations: Record<Locale, Record<string, string>> = { en, ru }

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale
    if (saved && (saved === 'en' || saved === 'ru')) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
  }

  const t = (key: string): string => {
    return translations[locale][key] || key
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}
