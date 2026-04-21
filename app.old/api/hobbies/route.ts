import { sql, Hobby } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const hobbies = await sql`SELECT * FROM hobbies ORDER BY name`
    return NextResponse.json({ hobbies: hobbies as Hobby[] })
  } catch (error) {
    console.error('Error fetching hobbies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hobbies' },
      { status: 500 }
    )
  }
}
