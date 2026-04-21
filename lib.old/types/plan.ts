// Plan types
export interface Plan {
  id: string
  user_id: string
  hobby_name: string
  hobby_icon: string
  goal: string
  status: 'active' | 'paused' | 'completed'
  start_date: string
  progress: number
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  plan_id: string
  title: string
  description?: string
  week_number: number
  is_completed: boolean
  created_at: string
  updated_at: string
}

export interface PlanWithTasks extends Plan {
  tasks: Task[]
}
