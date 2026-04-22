import { sql } from '@/lib/db'
import { verifyPassword, createToken } from '@/lib/auth'
import { loginSchema } from '@/lib/schemas/user'
import { checkRateLimit, resetRateLimit, getClientIp } from '@/lib/rate-limit'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Pre-computed bcrypt hash for timing attack prevention
// This is a real bcrypt hash (password would be "password" but doesn't matter)
const DUMMY_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'

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
    const validationResult = loginSchema.safeParse(body)
    
    if (!validationResult.success) {
      // Log validation errors server-side (don't expose to client)
      console.error('[Auth] Validation error:', validationResult.error.flatten())
      
      // Return generic error to user
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      )
    }

    const { email, password } = validationResult.data

    // Check rate limit by IP + email (prevents both distributed attacks and single-email spam)
    const rateLimitResult = checkRateLimit(clientIp, email)
    if (!rateLimitResult.success) {
      const retryAfter = Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimitResult.resetAt),
          }
        }
      )
    }

    // Find user - select only needed fields
    const users = await sql`
      SELECT id, email, name, password_hash, created_at 
      FROM users 
      WHERE email = ${email.toLowerCase()}
    `
    const user = users[0] as { 
      id: string
      email: string
      name: string
      password_hash: string
      created_at: Date 
    } | undefined

    // Timing attack prevention: always perform password comparison
    // using a real bcrypt hash even if user doesn't exist
    const hashToCompare = user?.password_hash || DUMMY_HASH
    const isValid = await bcrypt.compare(password, hashToCompare)

    // Check both user existence and password validity together
    if (!user || !isValid) {
      // Don't reveal whether email exists or password is wrong
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Reset rate limit on successful login
    resetRateLimit(clientIp, email)

    // Create token with 7-day expiry
    const token = await createToken(user.id)

    // Create response with user data (exclude sensitive fields)
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
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
    console.error('[Auth] Login error:', error)
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    )
  }
}
