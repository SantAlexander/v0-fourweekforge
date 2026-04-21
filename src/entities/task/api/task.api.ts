// Entity: Task - API layer
// REST API endpoints for tasks

export const TaskAPI = {
  endpoints: {
    list: (planId: string) => `/api/plans/${planId}/tasks`,
    create: (planId: string) => `/api/plans/${planId}/tasks`,
    get: (planId: string, taskId: string) => `/api/plans/${planId}/tasks/${taskId}`,
    update: (planId: string, taskId: string) => `/api/plans/${planId}/tasks/${taskId}`,
    toggle: (planId: string, taskId: string) => `/api/plans/${planId}/tasks/${taskId}/toggle`,
  },

  async fetchTasks(planId: string) {
    const res = await fetch(this.endpoints.list(planId))
    if (!res.ok) throw new Error('Failed to fetch tasks')
    return res.json()
  },

  async toggleTask(planId: string, taskId: string) {
    const res = await fetch(this.endpoints.toggle(planId, taskId), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to toggle task')
    return res.json()
  },

  async updateTask(planId: string, taskId: string, data: any) {
    const res = await fetch(this.endpoints.update(planId, taskId), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update task')
    return res.json()
  },
}
