// Entity: Plan - Model layer
// Core business logic for plans

export const PlanModel = {
  calculateProgress: (completedTasks: number, totalTasks: number): number => {
    if (totalTasks === 0) return 0
    return Math.round((completedTasks / totalTasks) * 100)
  },

  getCurrentWeek: (startDate: Date, endDate: Date): number => {
    const now = new Date()
    const totalMs = endDate.getTime() - startDate.getTime()
    const elapsedMs = now.getTime() - startDate.getTime()
    const progress = Math.max(0, Math.min(1, elapsedMs / totalMs))
    const week = Math.floor(progress * 4) + 1
    return Math.min(4, Math.max(1, week))
  },

  isPlannedCorrectly: (startDate: Date, endDate: Date): boolean => {
    const diffMs = endDate.getTime() - startDate.getTime()
    const days = diffMs / (1000 * 60 * 60 * 24)
    return days >= 25 && days <= 35 // ~4 weeks
  },
}
