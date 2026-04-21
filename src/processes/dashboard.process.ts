// Processes - Dashboard Page Process
// Orchestration logic for Dashboard page

import type { Plan, Task } from '@/shared/types'

export interface DashboardProcessProps {
  userId: string
}

export interface DashboardProcessState {
  plans: Plan[]
  todayTask: Task | null
  stats: {
    activePlans: number
    completedPlans: number
    totalTasks: number
    completedTasks: number
  }
  isLoading: boolean
  error: string | null
}

export class DashboardProcess {
  static async initialize(userId: string): Promise<DashboardProcessState> {
    try {
      // Fetch plans for user
      const plansResponse = await fetch(`/api/plans?userId=${userId}`)
      const plans: Plan[] = await plansResponse.json()

      // Calculate stats
      const stats = {
        activePlans: plans.filter(p => p.status === 'active').length,
        completedPlans: plans.filter(p => p.status === 'completed').length,
        totalTasks: plans.reduce((sum, p) => sum + 28, 0), // 28 tasks per plan
        completedTasks: 0, // Will be calculated from tasks
      }

      // Get first active plan's tasks for today
      let todayTask: Task | null = null
      const firstActivePlan = plans.find(p => p.status === 'active')
      if (firstActivePlan) {
        const tasksResponse = await fetch(`/api/plans/${firstActivePlan.id}/tasks`)
        const tasks: Task[] = await tasksResponse.json()
        todayTask = tasks.find(t => !t.isCompleted) || null
        stats.completedTasks = tasks.filter(t => t.isCompleted).length
      }

      return {
        plans,
        todayTask,
        stats,
        isLoading: false,
        error: null,
      }
    } catch (error) {
      return {
        plans: [],
        todayTask: null,
        stats: { activePlans: 0, completedPlans: 0, totalTasks: 0, completedTasks: 0 },
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}
