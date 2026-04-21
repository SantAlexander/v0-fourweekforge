import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, name, email, message, type, created_at
      FROM feedback
      ORDER BY created_at DESC
    `
    return NextResponse.json({ success: true, feedback: rows })
  } catch (error) {
    console.error('[feedback] Error fetching feedback:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch feedback' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message, type, honeypot } = body

    // Honeypot spam protection
    if (honeypot) {
      return NextResponse.json({ success: true })
    }

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    if (message.trim().length > 2000) {
      return NextResponse.json(
        { success: false, error: 'Message is too long (max 2000 characters)' },
        { status: 400 }
      )
    }

    const validTypes = ['bug', 'idea', 'question']
    const feedbackType = validTypes.includes(type) ? type : 'question'

    await sql`
      INSERT INTO feedback (name, email, message, type)
      VALUES (
        ${name?.trim() || null},
        ${email?.trim() || null},
        ${message.trim()},
        ${feedbackType}
      )
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[feedback] Error saving feedback:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save feedback' },
      { status: 500 }
    )
  }
}
