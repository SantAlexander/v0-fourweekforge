/**
 * Simple in-memory rate limiter for authentication endpoints
 * 
 * ⚠️ IMPORTANT: For production with Vercel serverless, use Redis/Upstash instead
 * This in-memory implementation works locally but won't persist across serverless instances.
 * 
 * Setup Upstash Redis:
 * 1. Add integration in Vercel project settings
 * 2. Use: import { Ratelimit } from "@upstash/ratelimit"
 * 3. Replace this implementation with Upstash client
 * 
 * See: https://upstash.com/docs/redis/features/ratelimiting
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean up every minute

interface RateLimitConfig {
  maxAttempts: number
  windowMs: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
}

/**
 * Check rate limit by combining IP + Email identifier
 * This prevents both distributed attacks and single email spam
 */
export function checkRateLimit(
  ipAddress: string,
  email?: string,
  config: RateLimitConfig = { maxAttempts: 5, windowMs: 15 * 60 * 1000 } // 5 attempts per 15 minutes
): RateLimitResult {
  const now = Date.now()
  
  // Combine IP + email for composite key (IP-based for registration, IP+email for login)
  const key = email ? `auth:${ipAddress}:${email.toLowerCase()}` : `auth:${ipAddress}`
  
  let entry = rateLimitStore.get(key)
  
  // If no entry or window expired, create new entry
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 1,
      resetAt: now + config.windowMs,
    }
    rateLimitStore.set(key, entry)
    return {
      success: true,
      remaining: config.maxAttempts - 1,
      resetAt: entry.resetAt,
    }
  }
  
  // Increment count
  entry.count++
  rateLimitStore.set(key, entry)
  
  // Check if exceeded
  if (entry.count > config.maxAttempts) {
    return {
      success: false,
      remaining: 0,
      resetAt: entry.resetAt,
    }
  }
  
  return {
    success: true,
    remaining: config.maxAttempts - entry.count,
    resetAt: entry.resetAt,
  }
}

/**
 * Reset rate limit for an identifier (e.g., after successful login)
 */
export function resetRateLimit(ipAddress: string, email?: string): void {
  const key = email ? `auth:${ipAddress}:${email.toLowerCase()}` : `auth:${ipAddress}`
  rateLimitStore.delete(key)
}

/**
 * Get client IP from request headers
 * Handles X-Forwarded-For, X-Real-IP, and Cloudflare headers
 */
export function getClientIp(request: Request): string {
  // Cloudflare
  const cfConnecting = request.headers.get('cf-connecting-ip')
  if (cfConnecting) {
    return cfConnecting
  }
  
  // X-Forwarded-For (take first IP from comma-separated list)
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  // X-Real-IP
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  
  // Fallback (shouldn't happen in production)
  return '127.0.0.1'
}
