/**
 * Rate limiter using Upstash Redis for production-ready authentication endpoints
 * 
 * Upstash Redis integration allows rate limiting to persist across serverless instances.
 * Environment variables required:
 * - KV_REST_API_URL: Upstash Redis REST API URL
 * - KV_REST_API_TOKEN: Upstash Redis REST API token
 * 
 * See: https://upstash.com/docs/redis/features/ratelimiting
 */

import { Redis } from '@upstash/redis'

interface RateLimitConfig {
  maxAttempts: number
  windowMs: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
}

// Initialize Redis client
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})

/**
 * Check rate limit by combining IP + Email identifier
 * This prevents both distributed attacks and single email spam
 */
export async function checkRateLimit(
  ipAddress: string,
  email?: string,
  config: RateLimitConfig = { maxAttempts: 5, windowMs: 15 * 60 * 1000 } // 5 attempts per 15 minutes
): Promise<RateLimitResult> {
  // Combine IP + email for composite key (IP-based for registration, IP+email for login)
  const key = email ? `auth:${ipAddress}:${email.toLowerCase()}` : `auth:${ipAddress}`
  
  const windowSeconds = Math.ceil(config.windowMs / 1000)
  
  // Use Redis INCR to atomically increment counter
  const count = await redis.incr(key)
  
  // If this is the first request in the window, set expiration
  if (count === 1) {
    await redis.expire(key, windowSeconds)
  }
  
  // Calculate TTL for this key
  const ttl = await redis.ttl(key)
  const resetAt = Date.now() + (ttl * 1000)
  
  // Check if exceeded limit
  if (count > config.maxAttempts) {
    return {
      success: false,
      remaining: 0,
      resetAt,
    }
  }
  
  return {
    success: true,
    remaining: config.maxAttempts - count,
    resetAt,
  }
}

/**
 * Reset rate limit for an identifier (e.g., after successful login)
 */
export async function resetRateLimit(ipAddress: string, email?: string): Promise<void> {
  const key = email ? `auth:${ipAddress}:${email.toLowerCase()}` : `auth:${ipAddress}`
  await redis.del(key)
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

