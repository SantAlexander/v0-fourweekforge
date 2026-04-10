import { sql, Task } from '@/lib/db'
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
    const format = request.nextUrl.searchParams.get('format') || 'json'

    // Get plan
    const plans = await sql`
      SELECT 
        p.*,
        COALESCE(h.name, p.custom_hobby_name) as hobby_name
      FROM plans p
      LEFT JOIN hobbies h ON p.hobby_id = h.id
      WHERE p.id = ${id} AND p.user_id = ${user.id}
    `

    if (plans.length === 0) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    const plan = plans[0]

    // Get tasks
    const tasks = await sql`
      SELECT * FROM tasks 
      WHERE plan_id = ${id} 
      ORDER BY week_number, created_at
    `

    if (format === 'csv') {
      // Generate CSV
      const headers = ['Week', 'Task', 'Description', 'Status']
      const rows = tasks.map((t: Task) => [
        t.week_number,
        `"${t.title.replace(/"/g, '""')}"`,
        `"${(t.description || '').replace(/"/g, '""')}"`,
        t.is_completed ? 'Completed' : 'Pending'
      ])

      const csv = [
        `# ${plan.hobby_name} - ${plan.goal}`,
        `# Start Date: ${plan.start_date}`,
        '',
        headers.join(','),
        ...rows.map(r => r.join(','))
      ].join('\n')

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${plan.hobby_name}-plan.csv"`
        }
      })
    }

    // Default: JSON
    const exportData = {
      plan: {
        hobby: plan.hobby_name,
        goal: plan.goal,
        startDate: plan.start_date,
        status: plan.status,
        createdAt: plan.created_at
      },
      tasks: tasks.map((t: Task) => ({
        week: t.week_number,
        title: t.title,
        description: t.description,
        completed: t.is_completed
      })),
      exportedAt: new Date().toISOString()
    }

    return NextResponse.json(exportData)
  } catch (error) {
    console.error('Error exporting plan:', error)
    return NextResponse.json({ error: 'Failed to export plan' }, { status: 500 })
  }
}
