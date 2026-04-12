import { sql } from '@/lib/db'
import { hashPassword, createToken } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, name, password } = await request.json()

    // Detailed validation with specific error codes
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'NAME_REQUIRED', message: 'Name is required' },
        { status: 400 }
      )
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: 'NAME_TOO_SHORT', message: 'Name must be at least 2 characters' },
        { status: 400 }
      )
    }

    if (!email || email.trim().length === 0) {
      return NextResponse.json(
        { error: 'EMAIL_REQUIRED', message: 'Email is required' },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'EMAIL_INVALID', message: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    if (!password) {
      return NextResponse.json(
        { error: 'PASSWORD_REQUIRED', message: 'Password is required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'PASSWORD_TOO_SHORT', message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'EMAIL_EXISTS', message: 'An account with this email already exists' },
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

    // Create token
    const token = await createToken(newUser[0].id)

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: newUser[0]
    })

    // Set auth cookie on the response
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    )
  }
}
