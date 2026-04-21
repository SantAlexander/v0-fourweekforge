// Entity: Task - Model layer
// Core business logic for tasks

export const TaskModel = {
  getTaskWeek: (taskIndex: number, tasksPerWeek: number = 7): number => {
    return Math.floor(taskIndex / tasksPerWeek) + 1
  },

  getTaskDay: (taskIndex: number, tasksPerWeek: number = 7): number => {
    return (taskIndex % tasksPerWeek) + 1
  },

  isTaskOverdue: (createdDate: Date, currentDate: Date, daysAllowed: number = 1): boolean => {
    const diffMs = currentDate.getTime() - createdDate.getTime()
    const days = diffMs / (1000 * 60 * 60 * 24)
    return days > daysAllowed
  },

  calculateStreak: (completedTasks: Array<{ completedAt: Date }>): number => {
    if (completedTasks.length === 0) return 0

    const sorted = [...completedTasks]
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())

    let streak = 1
    const today = new Date()
    const lastCompletion = new Date(sorted[0].completedAt)
    
    if (Math.floor((today.getTime() - lastCompletion.getTime()) / (1000 * 60 * 60 * 24)) > 1) {
      return 0
    }

    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1].completedAt)
      const curr = new Date(sorted[i].completedAt)
      const diffDays = Math.floor((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        streak++
      } else {
        break
      }
    }

    return streak
  },
}
