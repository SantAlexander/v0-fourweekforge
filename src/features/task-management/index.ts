// Features - Task Management Feature
// Task management feature slice

import type { Task } from '@/shared/types'

export interface TasksState {
  items: Task[]
  planId: string | null
  isLoading: boolean
  error: string | null
}

export const tasksSlice = {
  initialState: {
    items: [],
    planId: null,
    isLoading: false,
    error: null,
  } as TasksState,
}
