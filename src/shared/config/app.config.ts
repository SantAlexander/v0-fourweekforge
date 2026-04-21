// Core application configuration
export const APP_CONFIG = {
  name: 'FourWeekForge',
  version: '1.0.0',
  description: 'Master any hobby in 4 weeks',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
} as const

export const PLAN_CONFIG = {
  WEEKS: 4,
  DAYS_PER_WEEK: 7,
  TASKS_PER_WEEK: 2,
  TOTAL_TASKS: 28,
  MIN_TASK_DURATION: 15, // minutes
  MAX_TASK_DURATION: 30,
} as const

export const UI_CONFIG = {
  TOAST_DURATION: 3000,
  ANIMATION_DURATION: 300,
  PAGE_TRANSITION_DELAY: 100,
} as const
