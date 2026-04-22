import { sql } from '@/lib/db'
import { hashPassword, createToken } from '@/lib/auth'
import { registerSchema } from '@/lib/schemas/user'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request)
    
    // Parse body first to get email for combined rate limit check
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      )
    }

    // Validate input
    const validationResult = registerSchema.safeParse(body)
    
    if (!validationResult.success) {
      // Log validation errors server-side (don't expose to client)
      console.error('[Auth] Registration validation error:', validationResult.error.flatten())
      
      // Return generic error to user
      return NextResponse.json(
        { error: 'Invalid registration data' },
        { status: 400 }
      )
    }

    const { name, email, password } = validationResult.data
    const normalizedEmail = email.toLowerCase()

    // Check rate limit by IP + email (more lenient for registration)
    const rateLimitResult = checkRateLimit(clientIp, normalizedEmail, { 
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

    // Check if user exists - select only needed fields
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${normalizedEmail} LIMIT 1
    `
    
    if (existingUser.length > 0) {
      // Don't reveal that email exists (timing attack prevention)
      return NextResponse.json(
        { error: 'Registration failed. Please try again.' },
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

    const userId = (newUser[0] as { id: string }).id

    // Create token with 7-day expiry
    const token = await createToken(userId)

    // Create response with user data (exclude sensitive fields)
    const response = NextResponse.json({
      success: true,
      user: {
        id: (newUser[0] as { id: string }).id,
        email: (newUser[0] as { email: string }).email,
        name: (newUser[0] as { name: string }).name,
      }
    })

    // Set auth cookie with secure settings
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: true, // HTTPS only
      sameSite: 'lax', // Prevent CSRF, allow same-site requests
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[Auth] Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register' },
      { status: 500 }
    )
  }
}
