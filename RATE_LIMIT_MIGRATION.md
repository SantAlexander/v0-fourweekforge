# Rate Limiting Migration: In-Memory → Upstash Redis

## Summary

Successfully migrated the authentication rate limiting from in-memory storage to **Upstash Redis**, enabling production-ready protection across serverless instances on Vercel.

## Changes Made

### 1. **lib/rate-limit.ts**
- ✅ Replaced `Map` based in-memory store with `@upstash/redis` client
- ✅ Converted `checkRateLimit()` to async function using Redis INCR and EXPIRE
- ✅ Converted `resetRateLimit()` to async function using Redis DEL
- ✅ Atomic operations ensure race-condition safety
- ✅ Key format: `auth:{ip}:{email}` for login, `auth:{ip}` for registration

**Supported environment variables:**
```
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
```

### 2. **app/api/auth/login/route.ts**
- ✅ Updated `checkRateLimit()` call to use `await`
- ✅ Updated `resetRateLimit()` call to use `await`

**Config:**
- Max attempts: 5
- Time window: 15 minutes
- Key: `auth:{ip}:{email}`

### 3. **app/api/auth/register/route.ts**
- ✅ Updated `checkRateLimit()` call to use `await`

**Config:**
- Max attempts: 10 (more lenient than login)
- Time window: 15 minutes
- Key: `auth:{ip}:{email}`

### 4. **Test Files**
- ✅ Updated mocks in `app/api/auth/login/route.test.ts` to return resolved promises
- ✅ Updated mocks in `app/api/auth/register/route.test.ts` to return resolved promises

## Benefits

| Aspect | Before | After |
|--------|--------|-------|
| **Persistence** | Lost between cold starts | Persists across instances |
| **Scalability** | Works on single instance | Works across all Vercel instances |
| **Reliability** | Memory leaks possible | Managed by Upstash |
| **Atomic Operations** | Manual implementation risk | Redis native atomicity |

## Setup Instructions

1. **Connect Upstash Redis integration in Vercel Dashboard**
   - Navigate to Project Settings → Integrations
   - Add "Upstash for Redis"
   - This automatically sets `KV_REST_API_URL` and `KV_REST_API_TOKEN`

2. **Deploy**
   - Environment variables are auto-configured
   - No additional setup needed

## Backward Compatibility

- API signatures remain the same
- Error responses unchanged (429 status codes)
- Rate limit headers preserved
- No frontend changes required

## Testing Locally

To test with local Upstash Redis:
```bash
# Set environment variables
export KV_REST_API_URL="your_upstash_url"
export KV_REST_API_TOKEN="your_upstash_token"

# Run tests
pnpm test

# Start dev server
pnpm dev
```

## Monitoring

Monitor Redis usage in Upstash Console:
- Commands: INCR (on each attempt), EXPIRE (on first attempt), DEL (on successful login/registration)
- Keys: Track `auth:{ip}:{email}` patterns
- TTL: Keys auto-expire after window passes

## Rollback (if needed)

If issues occur, revert to commit before migration:
```bash
git revert <commit-hash>
```

The old in-memory implementation is still available in git history.
