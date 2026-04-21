// User types
export interface User {
  id: string
  email: string
  name: string
  created_at: string
  updated_at: string
}

export interface AuthResult {
  success: boolean
  error?: string
  message?: string
  user?: User
}
