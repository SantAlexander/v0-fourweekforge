import { sql, PlanWithTasks, Task } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const plans = await sql`
      SELECT 
        p.*,
        COALESCE(h.name, p.custom_hobby_name) as hobby_name,
        COALESCE(h.icon, 'star') as hobby_icon
      FROM plans p
      LEFT JOIN hobbies h ON p.hobby_id = h.id
      WHERE p.user_id = ${user.id}
      ORDER BY p.created_at DESC
    `

    // Get tasks for each plan
    const plansWithTasks: PlanWithTasks[] = await Promise.all(
      plans.map(async (plan) => {
        const tasks = await sql`
          SELECT * FROM tasks 
          WHERE plan_id = ${plan.id} 
          ORDER BY week_number, created_at
        `
        const completedTasks = tasks.filter((t: Task) => t.is_completed).length
        const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0
        
        return {
          ...plan,
          tasks: tasks as Task[],
          progress
        } as PlanWithTasks
      })
    )

    return NextResponse.json({ plans: plansWithTasks })
  } catch (error) {
    console.error('Error fetching plans:', error)
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { hobby_id, custom_hobby_name, goal, start_date, tasks } = await request.json()

    if (!goal || !start_date) {
      return NextResponse.json(
        { error: 'Goal and start date are required' },
        { status: 400 }
      )
    }

    if (!hobby_id && !custom_hobby_name) {
      return NextResponse.json(
        { error: 'Either hobby_id or custom_hobby_name is required' },
        { status: 400 }
      )
    }

    // Create plan
    const newPlan = await sql`
      INSERT INTO plans (user_id, hobby_id, custom_hobby_name, goal, start_date)
      VALUES (${user.id}, ${hobby_id || null}, ${custom_hobby_name || null}, ${goal}, ${start_date})
      RETURNING *
    `

    const planId = newPlan[0].id

    // Create tasks if provided
    if (tasks && Array.isArray(tasks)) {
      for (const task of tasks) {
        await sql`
          INSERT INTO tasks (plan_id, week_number, title, description)
          VALUES (${planId}, ${task.week_number}, ${task.title}, ${task.description || null})
        `
      }
    }

    return NextResponse.json({ success: true, plan: newPlan[0] })
  } catch (error) {
    console.error('Error creating plan:', error)
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 })
  }
}
