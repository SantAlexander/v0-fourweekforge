// Entity: User - API layer
// REST API endpoints for users

export const UserAPI = {
  endpoints: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    profile: '/api/auth/profile',
    updateProfile: '/api/auth/profile',
  },

  async register(email: string, password: string, name: string) {
    const res = await fetch(this.endpoints.register, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    })
    if (!res.ok) throw new Error('Registration failed')
    return res.json()
  },

  async login(email: string, password: string) {
    const res = await fetch(this.endpoints.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error('Login failed')
    return res.json()
  },

  async logout() {
    const res = await fetch(this.endpoints.logout, { method: 'POST' })
    if (!res.ok) throw new Error('Logout failed')
    return res.json()
  },

  async getProfile() {
    const res = await fetch(this.endpoints.profile)
    if (!res.ok) throw new Error('Failed to fetch profile')
    return res.json()
  },
}
