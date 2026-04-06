import { sql, PlanWithTasks, Task } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { id } = await params

    const plans = await sql`
      SELECT 
        p.*,
        COALESCE(h.name, p.custom_hobby_name) as hobby_name,
        COALESCE(h.icon, 'star') as hobby_icon
      FROM plans p
      LEFT JOIN hobbies h ON p.hobby_id = h.id
      WHERE p.id = ${id} AND p.user_id = ${user.id}
    `

    if (plans.length === 0) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    const tasks = await sql`
      SELECT * FROM tasks 
      WHERE plan_id = ${id} 
      ORDER BY week_number, created_at
    `

    const completedTasks = tasks.filter((t: Task) => t.is_completed).length
    const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

    const planWithTasks: PlanWithTasks = {
      ...plans[0],
      tasks: tasks as Task[],
      progress
    } as PlanWithTasks

    return NextResponse.json({ plan: planWithTasks })
  } catch (error) {
    console.error('Error fetching plan:', error)
    return NextResponse.json({ error: 'Failed to fetch plan' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { id } = await params
    const { status } = await request.json()

    // Verify ownership
    const existing = await sql`
      SELECT id FROM plans WHERE id = ${id} AND user_id = ${user.id}
    `
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    const updated = await sql`
      UPDATE plans SET status = ${status} WHERE id = ${id} RETURNING *
    `

    return NextResponse.json({ success: true, plan: updated[0] })
  } catch (error) {
    console.error('Error updating plan:', error)
    return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { id } = await params

    // Verify ownership
    const existing = await sql`
      SELECT id FROM plans WHERE id = ${id} AND user_id = ${user.id}
    `
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    await sql`DELETE FROM plans WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting plan:', error)
    return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 })
  }
}
