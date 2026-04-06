import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

export const sql = neon(process.env.DATABASE_URL)

// Types
export interface User {
  id: string
  email: string
  name: string
  password_hash: string
  created_at: Date
}

export interface Hobby {
  id: string
  name: string
  icon: string
  description: string
}

export interface Plan {
  id: string
  user_id: string
  hobby_id: string
  custom_hobby_name: string | null
  goal: string
  start_date: Date
  status: 'active' | 'completed' | 'paused'
  created_at: Date
}

export interface Task {
  id: string
  plan_id: string
  week_number: number
  title: string
  description: string | null
  is_completed: boolean
  completed_at: Date | null
  created_at: Date
}

export interface PlanWithHobby extends Plan {
  hobby_name: string
  hobby_icon: string
}

export interface PlanWithTasks extends PlanWithHobby {
  tasks: Task[]
  progress: number
}
