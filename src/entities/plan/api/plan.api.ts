// Entity: Plan - API layer
// REST API endpoints for plans

export const PlanAPI = {
  endpoints: {
    list: '/api/plans',
    create: '/api/plans',
    get: (id: string) => `/api/plans/${id}`,
    update: (id: string) => `/api/plans/${id}`,
    delete: (id: string) => `/api/plans/${id}`,
    progress: (id: string) => `/api/plans/${id}/progress`,
  },

  async fetchPlans() {
    const res = await fetch(this.endpoints.list)
    if (!res.ok) throw new Error('Failed to fetch plans')
    return res.json()
  },

  async createPlan(data: any) {
    const res = await fetch(this.endpoints.create, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create plan')
    return res.json()
  },

  async updatePlan(id: string, data: any) {
    const res = await fetch(this.endpoints.update(id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update plan')
    return res.json()
  },

  async deletePlan(id: string) {
    const res = await fetch(this.endpoints.delete(id), {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete plan')
    return res.json()
  },
}
