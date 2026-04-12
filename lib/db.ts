import { neon } from '@neondatabase/serverless'

// Support both DATABASE_URL and NEON_DATABASE_URL for flexibility
const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL or NEON_DATABASE_URL environment variable is not set')
}

export const sql = neon(databaseUrl)

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
  day_index?: number
  title: string
  description: string | null
  status: 'pending' | 'completed'
  is_completed: boolean
  due_date?: Date | null
  completed_at: Date | null
  created_at: Date
  updated_at?: Date
}

export interface PlanWithHobby extends Plan {
  hobby_name: string
  hobby_icon: string
}

export interface PlanWithTasks extends PlanWithHobby {
  tasks: Task[]
  progress: number
}

export interface Feedback {
  id: string
  name: string | null
  email: string | null
  message: string
  type: 'bug' | 'idea' | 'question'
  created_at: Date
}
