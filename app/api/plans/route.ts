import { sql, PlanWithTasks, Task } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Parse pagination params
    const limit = Math.min(parseInt(request.nextUrl.searchParams.get('limit') || '50'), 100)
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0')

    if (isNaN(limit) || isNaN(offset) || limit < 1 || offset < 0) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      )
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
      LIMIT ${limit} OFFSET ${offset}
    `

    // Get tasks for each plan
    const plansWithTasks: PlanWithTasks[] = await Promise.all(
      plans.map(async (plan) => {
        const tasks = await sql`
          SELECT 
            id, plan_id, week_index as week_number, day_index, title, description, 
            status, status = 'completed' as is_completed, due_date, completed_at, created_at, updated_at
          FROM tasks 
          WHERE plan_id = ${plan.id} 
          ORDER BY week_index, created_at
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

    return NextResponse.json({ 
      plans: plansWithTasks,
      pagination: {
        limit,
        offset,
        hasMore: plansWithTasks.length === limit
      }
    })
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
        // day_index is required in DB, we set it to 1 by default (tasks are weekly, not daily)
        await sql`
          INSERT INTO tasks (plan_id, week_index, day_index, title, description, status)
          VALUES (${planId}, ${task.week_number}, 1, ${task.title}, ${task.description || null}, 'pending')
        `
      }
    }

    return NextResponse.json({ success: true, plan: newPlan[0] })
  } catch (error) {
    console.error('Error creating plan:', error)
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 })
  }
}
