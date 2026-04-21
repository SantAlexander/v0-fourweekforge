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
  'landing.badge': 'Master any hobby',
  'landing.title': 'Learn any skill in',
  'landing.titleHighlight': '4 weeks',
  'landing.subtitle': '8-12 tasks. 15-30 minutes daily. Structured learning plans from day one.',
  'landing.tasksLabel': 'weeks',
  'landing.dailyLabel': 'min per day',
  'landing.cta.start': 'Start learning',
  'landing.cta.signin': 'Sign in',
  
  'landing.feature1.title': 'Choose a hobby',
  'landing.feature1.description': 'Pick any hobby from our list or create your own.',
  'landing.feature2.title': 'Set your goal',
  'landing.feature2.description': 'Define what you want to achieve in 4 weeks.',
  'landing.feature3.title': 'Get a plan',
  'landing.feature3.description': 'AI creates 28 structured tasks across 4 weeks.',
  'landing.feature4.title': 'Learn daily',
  'landing.feature4.description': '15-30 minutes a day and master the skill in a month.',
  
  // Hobby names (by icon key from DB)
  'hobby.guitar': 'Guitar',
  'hobby.painting': 'Painting',
  'hobby.photography': 'Photography',
  'hobby.coding': 'Coding',
  'hobby.cooking': 'Cooking',
  'hobby.drawing': 'Drawing',
  'hobby.calligraphy': 'Calligraphy',
  'hobby.yoga': 'Yoga',
  'hobby.writing': 'Writing',
  'hobby.gardening': 'Gardening',
  'hobby.pencil': 'Drawing',
  'hobby.chef-hat': 'Cooking',
  'hobby.pen-tool': 'Calligraphy',
  'hobby.camera': 'Photography',
  'hobby.music': 'Guitar',
  'hobby.heart': 'Yoga',
  'hobby.book-open': 'Writing',
  'hobby.leaf': 'Gardening',
  
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
  'dashboard.welcome': 'Learning progress',
  'dashboard.subtitle': 'Track your progress and master new skills',
  'dashboard.activePlans': 'Active',
  'dashboard.tasksDone': 'Done',
  'dashboard.tasksLeft': 'Left',
  'dashboard.completed': 'Completed',
  'dashboard.active': 'Active',
  'dashboard.paused': 'Paused',
  
  'dashboard.noActivePlans': 'No active plans',
  'dashboard.noActivePlansSubtitle': 'Start your journey by creating a new plan',
  'dashboard.createFirstPlan': 'Create plan',
  
  'dashboard.noCompletedPlans': 'No completed plans yet',
  'dashboard.noCompletedPlansSubtitle': 'Complete all tasks in a plan to see it here',
  
  'dashboard.noPausedPlans': 'No paused plans',
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
  'planner.planTasksSubtitle': 'AI generated tasks based on your goal. Edit them as you like.',
  'planner.week': 'Week',
  'planner.addTask': 'Add Task',
  'planner.taskTitlePlaceholder': 'task title',
  'planner.taskDescPlaceholder': 'Description (optional)',

  'planner.generateTasks': 'Generate Tasks with AI',
  'planner.generating': 'Generating...',
  'planner.regenerate': 'Regenerate',
  'planner.generateHint': 'AI will create a weekly task plan based on your hobby and goal. You can edit the tasks after generation.',
  'planner.generationError': 'Failed to generate tasks. You can add them manually.',
  'planner.noTasksForWeek': 'No tasks for this week',

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
  'planCard.statusActive': 'Active',
  'planCard.statusDone': 'Done',
  'planCard.statusPaused': 'Paused',
  'planCard.completed': 'Completed',
  'planCard.remaining': 'Remaining',
  'planCard.total': 'Total',
  
  // Dashboard stats
  'dashboard.of': 'of',
  
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
  'language.en': 'English',
  'language.ru': 'Русский',
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

  // Dashboard - new strings
  'dashboard.createFirstPlanTitle': 'Start learning',
  'dashboard.createFirstPlanDesc': 'Choose a hobby and get a personalized 4-week learning plan.',
  'dashboard.nextTask': 'TODAY',
  'dashboard.startTask': 'Start',
  'dashboard.planCompletedTitle': 'Plan completed!',
  'dashboard.planCompletedDesc': 'Great work! Create a new plan to continue learning.',
  'dashboard.progressTitle': 'Stats',
  'dashboard.activePlansLabel': 'Active',
  'dashboard.tasksCompletedWeek': 'Tasks completed',
  'dashboard.tasksTotal': 'of {count}',
  'dashboard.progressMessage': '{percent}% done',
  'dashboard.learningSubtitle': 'Week {week} of 4',
  'dashboard.startSubtitle': 'Create your first learning plan',
  'dashboard.weeklyNote': 'Structured plan across 4 weeks',
  'dashboard.completedPlans': 'Completed',
  'dashboard.stats': 'Stats',
  'dashboard.activePlansCopy': 'Active',
  'dashboard.completedPlansCopy': 'Completed',
  'dashboard.tasksDoneCopy': 'Tasks done',
  'dashboard.progressOverallCopy': 'Overall',

  // Planner - new strings
  'planner.hobbyTitle': 'Which hobby do you want to learn?',
  'planner.hobbySubtitle': 'Choose from our list or type your own',
  'planner.hobbyOr': 'or',
  'planner.hobbyEnterOwn': 'Enter your own hobby',
  'planner.hobbyOwnPlaceholder': 'e.g., Photography, Dancing, Cooking...',
  'planner.hobbyOwnHint': "Great! We'll create a personalized plan for {hobby}.",

  'planner.goalJourneyTitle': 'Your 4-week journey starts here',
  'planner.goalJourneySubtitle': 'Define your goal and when you want to start',
  'planner.structureLabel': 'PLAN',
  'planner.structureWeeks': 'Week 1 → Week 2 → Week 3 → Week 4',
  'planner.structureDesc': '8-12 tasks over 4 weeks. 15-30 minutes daily.',
  'planner.goalSpecific': 'Your goal?',
  'planner.goalSpecificPlaceholder': 'I want to play 5 songs on guitar | I want to create a portfolio with 10 photos',
  'planner.goalAiHint': 'We\'ll create a personalized plan based on your goal.',
  'planner.startDateLabel': 'When do you want to start?',
  'planner.startDateHint': 'Day 1 of your plan.',

  'planner.tasksTitle': 'Your 4-week plan',
  'planner.tasksSubtitle': 'Personalized tasks. Edit them or keep as is.',
  'planner.regenerateAi': 'Regenerate',
  'planner.generatingPlan': 'Creating your plan...',
  'planner.generatingWait': 'This takes about 10 seconds',
  'planner.weekLabel': 'Week',
  'planner.taskCount': '{count} task',
  'planner.taskCountPlural': '{count} tasks',
  'planner.addTaskBtn': 'Add task',
  'planner.startHere': 'NOW',
  'planner.taskTitleInput': 'Task title',
  'planner.taskDescInput': 'Description (optional)',
  'planner.deleteTask': 'Delete',
  'planner.noTasksEmpty': 'No tasks yet. Add your first one.',
  'planner.timelineCurrent': 'Current',
  'planner.timelineUpcoming': 'Upcoming',
  'planner.timelineFinish': 'Finish!',

  // Landing - Example Plans Section
  'landing.examplesTitle': 'See what you\'ll get',
  'landing.examplesSubtitle': 'Real examples of personalized plans',

  // Onboarding Modal
  'onboarding.title': 'Welcome to FourWeekForge',
  'onboarding.subtitle': 'Master any hobby in 4 weeks',
  'onboarding.step1': 'Choose a hobby',
  'onboarding.step2': 'Set your goal',
  'onboarding.step3': 'Learn daily',
  'onboarding.createPlan': 'Start',
  'onboarding.skip': 'Skip for now',

  // Calendar View
  'plan.listView': 'List View',
  'plan.calendarView': 'Calendar View',
  'plan.sun': 'Sun',
  'plan.mon': 'Mon',
  'plan.tue': 'Tue',
  'plan.wed': 'Wed',
  'plan.thu': 'Thu',
  'plan.fri': 'Fri',
  'plan.sat': 'Sat',
  'plan.taskCount': 'tasks',
  'plan.weekCompleted': 'Week completed',
  'plan.tasksDone': 'Tasks done',
  'plan.continue': 'Continue',
  'plan.today': 'Today',
  'plan.nextActionable': 'Next week',
  
  // Export
  'export.title': 'Export Plan',
  'export.json': 'Download JSON',
  'export.csv': 'Download CSV',
  'export.pdf': 'Print / PDF',
  
  // Plan Details
  'plan.duration': 'Duration',
  'plan.pause': 'Pause',
  'plan.resume': 'Resume',
  'plan.delete': 'Delete',
  
  // Toast messages
  'toast.taskMarked': 'Task marked as complete!',
  'toast.planCreated': 'Plan created!',

  // Phase 11 - New UI strings
  'dashboard.getStarted': 'Get started',
  'dashboard.startLearning': 'Start learning',
  'dashboard.chooseAnyHobby': 'Choose any hobby. We create a 4-week plan.',
  'dashboard.today': 'Today',
  'dashboard.continue': 'Continue',
  'dashboard.tasksLeft': 'tasks left',
  'dashboard.activePlan': 'active plan',
  'dashboard.activePlans': 'active plans',
  'dashboard.completed': 'completed',
  'dashboard.otherActivePlans': 'Other active plans',
  'dashboard.allTasksDone': 'All tasks done',
  
  'plan.nextTask': 'Next task',
  'plan.markComplete': 'Mark complete',
  'plan.weekOf': 'of 4',
  
  'landing.heroTitle': 'Learn any skill in 4 weeks',
  'landing.heroSubtitle': 'Structured daily tasks. 15-30 minutes. Clear progress from day one.',
  'landing.startLearning': 'Start learning',
  'landing.alreadyHaveAccount': 'Already have an account?',
  'landing.signIn': 'Sign in',
  'landing.howItWorks': 'How it works',
  'landing.pickYourPassion': 'Pick your passion',
  'landing.plansAvailable': '30+ learning plans available',
  'landing.readyToStart': 'Ready to start?',
  'landing.getStructuredPlan': 'Pick a hobby. Get a structured plan. Start today.',
  'landing.createAccount': 'Create account',
  'landing.goToDashboard': 'Go to dashboard',
  'landing.learningExamples': 'Learning examples',
  'landing.popularHobbies': 'Popular hobbies',
  'landing.productName': 'FourWeekForge',
}

// Russian translations
const ru: Record<string, string> = {
  // Language
  'language.en': 'English',
  'language.ru': 'Русский',
  
  // Header
  'header.dashboard': 'Панель',
  'header.newPlan': 'Новый план',
  'header.login': 'Войти',
  'header.getStarted': 'Начать',
  'header.logout': 'Выйти',
  
  // Landing Page
  'landing.badge': 'Освой любое хобби',
  'landing.title': 'Научись любому навыку за',
  'landing.titleHighlight': '4 недели',
  'landing.subtitle': '8-12 задач. 15-30 минут в день. Структурированные планы обучения с первого дня.',
  'landing.tasksLabel': 'недель',
  'landing.dailyLabel': 'минут в день',
  'landing.cta.start': 'Начать обучение',
  'landing.cta.signin': 'Войти',
  
  'landing.feature1.title': 'Выбери хобби',
  'landing.feature1.description': 'Выбери любое хобби из списка или создай своё.',
  'landing.feature2.title': 'Поставь цель',
  'landing.feature2.description': 'Определи, что хочешь достичь за 4 недели.',
  'landing.feature3.title': 'Получи план',
  'landing.feature3.description': 'AI создаст 28 структурированных задач на 4 недели.',
  'landing.feature4.title': 'Учись каждый день',
  'landing.feature4.description': '15-30 минут в день — и за месяц ты освоишь навык.',
  
  'landing.ctaTitle': 'Готов начать?',
  'landing.ctaSubtitle': 'Присоединяйся к тысячам, кто освоил новые навыки за 4 недели',
  'landing.ctaButton': 'Создать аккаунт',
  'landing.ctaButtonLoggedIn': 'Перейти в панель',
  
  'landing.footer': 'Освой любое хобби за 4 недели. Создано с любовью.',
  
  // Hobby names (by icon key from DB)
  'hobby.guitar': 'Гитара',
  'hobby.painting': 'Живопись',
  'hobby.photography': 'Фотография',
  'hobby.coding': 'Программирование',
  'hobby.cooking': 'Кулинария',
  'hobby.drawing': 'Рисование',
  'hobby.calligraphy': 'Каллиграфия',
  'hobby.yoga': 'Йога',
  'hobby.writing': 'Писательство',
  'hobby.gardening': 'Садоводство',
  'hobby.pencil': 'Рисование',
  'hobby.chef-hat': 'Кулинария',
  'hobby.pen-tool': 'Каллиграфия',
  'hobby.camera': 'Фотография',
  'hobby.music': 'Гитара',
  'hobby.heart': 'Йога',
  'hobby.book-open': 'Писательство',
  'hobby.leaf': 'Садоводство',
  
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
  'dashboard.welcome': 'Прогресс обучения',
  'dashboard.subtitle': 'Отслеживай прогресс и продолжай прокачивать навыки',
  'dashboard.activePlans': 'Активные',
  'dashboard.tasksDone': 'Завершено',
  'dashboard.tasksLeft': 'Осталось',
  'dashboard.completed': 'Завершено',
  'dashboard.active': 'Активные',
  'dashboard.paused': 'На паузе',
  
  'dashboard.noActivePlans': 'Нет активных планов',
  'dashboard.noActivePlansSubtitle': 'Начни путь, создав новый 4-недельный план',
  'dashboard.createFirstPlan': 'Создать план',
  
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
  'planner.customHobby': 'Или своё хобби',
  'planner.customHobbyLabel': 'Название хобби',
  'planner.customHobbyPlaceholder': 'напр., Шахматы, Оригами, Садоводство...',
  
  'planner.setGoalTitle': 'Установи цель',
  'planner.setGoalSubtitle': 'Чего хочешь достичь за 4 недели?',
  'planner.goalLabel': 'Твоя 4-недельная цель',
  'planner.goalPlaceholder': 'напр., Научиться играть 3 песни на гитаре, Освоить базовые техники акварели...',
  'planner.startDate': 'Дата начала',
  
  'planner.planTasksTitle': 'Еженедельные задачи',
  'planner.planTasksSubtitle': 'AI сгенерировал задачи на основе твоей цели. Редактируй как хочешь.',
  'planner.week': 'Неделя',
  'planner.addTask': 'Добавить задачу',
  'planner.taskTitlePlaceholder': 'название задачи',
  'planner.taskDescPlaceholder': 'Описание (необязательно)',

  'planner.generateTasks': 'Сгенерировать задачи с AI',
  'planner.generating': 'Генерирую...',
  'planner.regenerate': 'Сгенерировать заново',
  'planner.generateHint': 'AI создаст план задач по неделям на основе твоего хобби и цели. После генерации можно редактировать.',
  'planner.generationError': 'Не удалось сгенерировать задачи. Можно добавить вручную.',
  'planner.noTasksForWeek': 'Нет задач на эту неделю',

  'planner.autoGenerate': 'Автогенерация 28 задач',
  'planner.autoGenerating': 'Генерация задач...',
  'planner.clearTasks': 'Очистить все',
  
  'planner.cancel': 'Отмена',
  'planner.back': 'Назад',
  'planner.next': 'Далее',
  'planner.createPlan': 'Создать план',

  // Planner - new strings (Phase 11)
  'planner.hobbyTitle': 'Какое хобби хочешь освоить?',
  'planner.hobbySubtitle': 'Выбери из списка или введи своё',
  'planner.hobbyOr': 'или',
  'planner.hobbyEnterOwn': 'Введи своё хобби',
  'planner.hobbyOwnPlaceholder': 'напр., Фотография, Танцы, Кулинария...',
  'planner.hobbyOwnHint': 'Отлично! Мы создадим персональный план для {hobby}.',

  'planner.goalJourneyTitle': 'Твой 4-недельный путь начинается здесь',
  'planner.goalJourneySubtitle': 'Определи свою цель и дату начала',
  'planner.structureLabel': 'ПЛАН',
  'planner.structureWeeks': 'Неделя 1 → Неделя 2 → Неделя 3 → Неделя 4',
  'planner.structureDesc': '8-12 задач за 4 недели. 15-30 минут в день.',
  'planner.goalSpecific': 'Твоя цель?',
  'planner.goalSpecificPlaceholder': 'Хочу сыграть 5 песен на гитаре | Хочу создать портфолио из 10 фотографий',
  'planner.goalAiHint': 'Мы создадим персональный план на основе твоей цели.',
  'planner.startDateLabel': 'Когда хочешь начать?',
  'planner.startDateHint': 'День 1 твоего плана.',

  'planner.tasksTitle': 'Твой план на 4 недели',
  'planner.tasksSubtitle': 'Персональные задачи. Редактируй или оставь как есть.',
  'planner.regenerateAi': 'Сгенерировать заново',
  'planner.generatingPlan': 'Создаём твой план...',
  'planner.generatingWait': 'Это займёт около 10 секунд',
  'planner.weekLabel': 'Неделя',
  'planner.taskCount': '{count} задача',
  'planner.taskCountPlural': '{count} задач',
  'planner.addTaskBtn': 'Добавить задачу',
  'planner.startHere': 'СЕЙЧАС',
  'planner.taskTitleInput': 'Название задачи',
  'planner.taskDescInput': 'Описание (необязательно)',
  'planner.deleteTask': 'Удалить',
  'planner.noTasksEmpty': 'Задач пока нет. Добавь первую.',
  'planner.timelineCurrent': 'Текущая',
  'planner.timelineUpcoming': 'Впереди',
  'planner.timelineFinish': 'Финиш!',
  
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
  'planCard.statusActive': 'Активен',
  'planCard.statusDone': 'Завершён',
  'planCard.statusPaused': 'На паузе',
  'planCard.completed': 'Выполнено',
  'planCard.remaining': 'Осталось',
  'planCard.total': 'Всего',
  
  // Dashboard stats
  'dashboard.of': 'из',
  
  // Week Tasks
  'weekTasks.allDone': 'Все задачи выполнены!',
  'weekTasks.noTasks': 'Нет задач на эту неделю',
  
  // Calendar/List View
  'plan.weekCompleted': 'Неделя завершена',
  'plan.tasksDone': 'Задач выполнено',
  'plan.continue': 'Продолжить',
  'plan.today': 'Сегодня',
  'plan.nextActionable': 'Следующая неделя',
  
  // Toast messages
  'toast.welcomeBack': 'С возвращением!',
  'toast.accountCreated': 'Аккаунт успешно создан!',
  'toast.taskCompleted': 'Задача выполнена!',
  'toast.planPaused': 'План приостановлен!',
  'toast.planResumed': 'План возобновлен!',
  'toast.planCompleted': 'План завершен!',
  'toast.planDeleted': 'План удален',
  'toast.planCreated': 'план создан!',
  
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

  // Onboarding
  'onboarding.title': 'Добро пожаловать в FourWeekForge',
  'onboarding.subtitle': 'Освой любое хобби за 4 недели',
  'onboarding.step1': 'Выбери хобби',
  'onboarding.step2': 'Поставь цель',
  'onboarding.step3': 'Учись каждый день',
  'onboarding.createPlan': 'Начать',
  'onboarding.skip': 'Пропустить',

  // Calendar View
  'plan.listView': 'Список',
  'plan.calendarView': 'Календарь',
  'plan.sun': 'Вс',
  'plan.mon': 'Пн',
  'plan.tue': 'Вт',
  'plan.wed': 'Ср',
  'plan.thu': 'Чт',
  'plan.fri': 'Пт',
  'plan.sat': 'Сб',
  
  // Phase 11 - New UI strings (Russian)
  'dashboard.getStarted': 'Начать',
  'dashboard.startLearning': 'Начать обучение',
  'dashboard.chooseAnyHobby': 'Выбери любое хобби. Мы создадим план на 4 недели.',
  'dashboard.today': 'Сегодня',
  'dashboard.continue': 'Продолжить',
  'dashboard.tasksLeft': 'задач осталось',
  'dashboard.activePlan': 'активный план',
  'dashboard.activePlans': 'активные планы',
  'dashboard.completed': 'завершено',
  'dashboard.otherActivePlans': 'Другие активные планы',
  'dashboard.allTasksDone': 'Все задачи выполнены',
  
  'plan.nextTask': 'Следующая задача',
  'plan.markComplete': 'Отметить выполненным',
  'plan.weekOf': 'из 4',
  
  'landing.examplesTitle': 'Примеры обучения',
  'landing.examplesSubtitle': 'Реальные примеры персонализированных планов',
  
  'landing.heroTitle': 'Научись любому навыку за 4 недели',
  'landing.heroSubtitle': 'Структурированные ежедневные задачи. 15-30 минут. Виден прогресс с первого дня.',
  'landing.startLearning': 'Начать обучение',
  'landing.alreadyHaveAccount': 'Уже есть аккаунт?',
  'landing.signIn': 'Войти',
  'landing.howItWorks': 'Как это работает',
  'landing.pickYourPassion': 'Выбери своё увлечение',
  'landing.plansAvailable': 'Более 30 готовых планов обучения',
  'landing.readyToStart': 'Готов начать?',
  'landing.getStructuredPlan': 'Выбери хобби. Получи структурированный план. Начни сегодня.',
  'landing.createAccount': 'Создать аккаунт',
  'landing.goToDashboard': 'Перейти в панель',
  'landing.learningExamples': 'Примеры обучения',
  'landing.popularHobbies': 'Популярные хобби',
  'landing.productName': 'FourWeekForge',
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
