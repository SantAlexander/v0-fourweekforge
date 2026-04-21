// Features - Plan Management Feature
// Plan management feature slice

import type { Plan } from '@/shared/types'

export interface PlansState {
  items: Plan[]
  activeId: string | null
  isLoading: boolean
  error: string | null
}

export const plansSlice = {
  initialState: {
    items: [],
    activeId: null,
    isLoading: false,
    error: null,
  } as PlansState,
}
