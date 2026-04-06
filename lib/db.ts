import { neon } from '@neondatabase/serverless'

// Use non-pooling URL for direct connection
const databaseUrl = 
  process.env.DATABASE_URL || 
  process.env.POSTGRES_URL_NON_POOLING || 
  process.env.POSTGRES_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL, POSTGRES_URL_NON_POOLING, or POSTGRES_URL environment variable is not set')
}

// Transform Supabase pooler URL to direct connection if needed
function getDirectConnectionUrl(url: string): string {
  // If it's a Supabase pooler URL, we need to use the direct host
  if (url.includes('pooler.supabase.com')) {
    // Extract project ref from the URL
    // Format: postgresql://user:pass@aws-0-region.pooler.supabase.com:port/postgres
    // Convert to: postgresql://user:pass@db.PROJECT_REF.supabase.co:5432/postgres
    const projectRef = process.env.SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase/)?.[1]
    if (projectRef) {
      return url
        .replace(/aws-0-[^.]+\.pooler\.supabase\.com/, `db.${projectRef}.supabase.co`)
        .replace(/:6543/, ':5432')
    }
  }
  return url
}

export const sql = neon(getDirectConnectionUrl(databaseUrl))

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
