import { sql } from '@/lib/db'
import { hashPassword, createToken } from '@/lib/auth'
import { registerSchema } from '@/lib/schemas/user'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request)
    
    // Check rate limit (more lenient for registration: 10 attempts per 15 min)
    const rateLimitResult = checkRateLimit(clientIp, { 
      maxAttempts: 10, 
      windowMs: 15 * 60 * 1000 
    })
    
    if (!rateLimitResult.success) {
      const retryAfter = Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
          }
        }
      )
    }

    // Parse and validate input
    const body = await request.json()
    const validationResult = registerSchema.safeParse(body)
    
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors
      return NextResponse.json(
        { 
          error: 'VALIDATION_FAILED',
          message: 'Validation failed',
          details: errors
        },
        { status: 400 }
      )
    }

    const { name, email, password } = validationResult.data
    const normalizedEmail = email.toLowerCase()

    // Check if user exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${normalizedEmail}
    `
    
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
      VALUES (${normalizedEmail}, ${name.trim()}, ${passwordHash})
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
      secure: true,
      sameSite: 'none',
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
