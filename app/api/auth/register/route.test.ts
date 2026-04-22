import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn().mockReturnValue({
    success: true,
    resetAt: Date.now() + 10000,
  }),
  getClientIp: vi.fn().mockReturnValue("127.0.0.1"),
}));

vi.mock("@/lib/db", () => ({
  sql: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  hashPassword: vi.fn().mockResolvedValue("hashed"),
  createToken: vi.fn().mockReturnValue("token"),
}));

import { POST } from "./route";
import { sql } from "@/lib/db";

describe("POST /api/auth/register", () => {
  it("создаёт пользователя", async () => {
    (sql as any)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        { id: "1", email: "new@test.com", name: "Test" },
      ]);

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        email: "new@test.com",
        password: "12345678",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it("ошибка при дубликате email", async () => {
    (sql as any).mockResolvedValueOnce([{ id: 1 }]);

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        email: "test@test.com",
        password: "12345678",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400); // ← исправлено
  });
});