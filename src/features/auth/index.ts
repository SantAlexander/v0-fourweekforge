// Features - Auth Feature
// Authentication feature slice (UI + logic)

import type { User } from '@/shared/types'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export const authSlice = {
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  } as AuthState,
}
