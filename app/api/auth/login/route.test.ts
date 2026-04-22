import { describe, it, expect, vi } from "vitest";
import { POST } from "./route";

// 🧠 MOCK DB
vi.mock("@/lib/db", () => ({
  sql: vi.fn(),
}));

// 🧠 MOCK AUTH
vi.mock("@/lib/auth", () => ({
  verifyPassword: vi.fn(),
  createToken: vi.fn(() => "test-token"),
}));

// 🧠 MOCK RATE LIMIT
vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockReturnValue(true),
  resetRateLimit: vi.fn(),
  getClientIp: vi.fn().mockReturnValue('127.0.0.1'),
}));

// мокаем зависимости
vi.mock('@/lib/db', () => ({
  sql: vi.fn()
}))

vi.mock('@/lib/auth', () => ({
  verifyPassword: vi.fn(),
  createToken: vi.fn()
}))

describe('POST /api/login', () => {
  it('возвращает 400 если нет email', async () => {
    const req = {
      json: async () => ({ password: '123' })
    } as any

    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('возвращает 401 если пользователь не найден', async () => {
    const { sql } = await import('@/lib/db')
    sql.mockResolvedValue([])

    const req = {
      json: async () => ({ email: 'test@test.com', password: '123' })
    } as any

    const res = await POST(req)

    expect(res.status).toBe(401)
  })

  it('возвращает 401 если пароль неверный', async () => {
    const { sql } = await import('@/lib/db')
    const { verifyPassword } = await import('@/lib/auth')

    sql.mockResolvedValue([{ id: 1, password_hash: 'hash' }])
    verifyPassword.mockResolvedValue(false)

    const req = {
      json: async () => ({ email: 'test@test.com', password: '123' })
    } as any

    const res = await POST(req)

    expect(res.status).toBe(401)
  })

  it('возвращает 200 при успешном логине', async () => {
    const { sql } = await import('@/lib/db')
    const { verifyPassword, createToken } = await import('@/lib/auth')

    sql.mockResolvedValue([
      { id: 1, email: 'test@test.com', name: 'Test', password_hash: 'hash', created_at: 'now' }
    ])

    verifyPassword.mockResolvedValue(true)
    createToken.mockResolvedValue('token123')

    const req = {
      json: async () => ({ email: 'test@test.com', password: '123' })
    } as any

    const res = await POST(req)

    expect(res.status).toBe(200)
  })

  it('возвращает 500 при ошибке', async () => {
    const req = {
      json: async () => { throw new Error('fail') }
    } as any

    const res = await POST(req)

    expect(res.status).toBe(500)
  })
})