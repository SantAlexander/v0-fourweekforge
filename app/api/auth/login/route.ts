import { sql } from '@/lib/db'
import { verifyPassword, createToken } from '@/lib/auth'
import { loginSchema } from '@/lib/schemas/user'
import { checkRateLimit, resetRateLimit, getClientIp } from '@/lib/rate-limit'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Dummy hash for timing attack prevention
// Pre-computed bcrypt hash to compare against when user doesn't exist
const DUMMY_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request)
    
    // Check rate limit
    const rateLimitResult = checkRateLimit(clientIp)
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

    // Parse and validate input
    const body = await request.json()
    const validationResult = loginSchema.safeParse(body)
    
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: errors
        },
        { status: 400 }
      )
    }

    const { email, password } = validationResult.data

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
    // even if user doesn't exist, using a dummy hash
    const hashToCompare = user?.password_hash || DUMMY_HASH
    const isValid = await bcrypt.compare(password, hashToCompare)

    // Check both user existence and password validity together
    if (!user || !isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Reset rate limit on successful login
    resetRateLimit(clientIp)

    // Create token
    const token = await createToken(user.id)

    // Create response with user data (exclude sensitive fields)
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at
      }
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
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    )
  }
}
