import { sql } from '@/lib/db'
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, name, password } = await request.json()

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Create user
    const passwordHash = await hashPassword(password)
    const newUser = await sql`
      INSERT INTO users (email, name, password_hash)
      VALUES (${email}, ${name}, ${passwordHash})
      RETURNING id, email, name, created_at
    `

    // Create token and set cookie
    const token = await createToken(newUser[0].id)
    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      user: newUser[0]
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    )
  }
}
