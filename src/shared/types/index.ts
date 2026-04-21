// Shared type definitions
export type Language = 'en' | 'ru'

export type PlanStatus = 'active' | 'completed' | 'paused'
export type TaskStatus = 'todo' | 'in_progress' | 'completed'

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface Plan {
  id: string
  userId: string
  hobbyName: string
  hobbyIcon: string
  goal: string
  status: PlanStatus
  progress: number
  startDate: Date
  endDate: Date
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: string
  planId: string
  title: string
  description: string
  week: number
  day: number
  isCompleted: boolean
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
