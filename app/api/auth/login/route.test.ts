import { describe, it, expect, vi, beforeEach } from "vitest";

// ✅ моки ДО импортов
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(),
  resetRateLimit: vi.fn(),
  getClientIp: vi.fn().mockReturnValue("127.0.0.1"),
}));

vi.mock("@/lib/db", () => ({
  sql: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  createToken: vi.fn().mockResolvedValue("token"),
}));

vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
  },
}));

// ✅ импорты после моков
import { POST } from "./route";
import { sql } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";

describe("POST /api/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // ✅ по умолчанию rate limit НЕ блокирует
    (checkRateLimit as any).mockReturnValue({
      success: true,
      resetAt: Date.now() + 10000,
    });
  });

  it("возвращает 400 если нет email", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        password: "12345678",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("возвращает 401 если пользователь не найден", async () => {
    (sql as any).mockResolvedValueOnce([]); // нет пользователя
    (bcrypt.compare as any).mockResolvedValue(false);

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        email: "notfound@test.com",
        password: "12345678",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("возвращает 401 если пароль неверный", async () => {
    (sql as any).mockResolvedValueOnce([
      {
        id: "1",
        email: "test@test.com",
        name: "Test",
        password_hash: "hashed",
      },
    ]);

    (bcrypt.compare as any).mockResolvedValue(false);

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        email: "test@test.com",
        password: "12345678",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("возвращает 200 при успешном логине", async () => {
    (sql as any).mockResolvedValueOnce([
      {
        id: "1",
        email: "test@test.com",
        name: "Test",
        password_hash: "hashed",
      },
    ]);

    (bcrypt.compare as any).mockResolvedValue(true);

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        email: "test@test.com",
        password: "12345678",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("возвращает 500 при ошибке", async () => {
    (sql as any).mockRejectedValueOnce(new Error("DB error"));

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        email: "test@test.com",
        password: "12345678",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});