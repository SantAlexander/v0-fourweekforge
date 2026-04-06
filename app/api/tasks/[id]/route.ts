import { sql } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

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
    const { is_completed } = await request.json()

    // Verify ownership through plan
    const task = await sql`
      SELECT t.* FROM tasks t
      JOIN plans p ON t.plan_id = p.id
      WHERE t.id = ${id} AND p.user_id = ${user.id}
    `

    if (task.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const updated = await sql`
      UPDATE tasks 
      SET 
        is_completed = ${is_completed},
        completed_at = ${is_completed ? new Date().toISOString() : null}
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json({ success: true, task: updated[0] })
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}
