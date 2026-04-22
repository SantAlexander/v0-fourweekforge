import { describe, it, expect, vi } from "vitest";

// моки ДО импортов
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn().mockReturnValue(true),
  resetRateLimit: vi.fn(),
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
    (sql as any).mockResolvedValueOnce([]); // пользователя нет

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
    (sql as any).mockResolvedValueOnce([{ id: 1 }]); // уже есть

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        email: "test@test.com",
        password: "12345678",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(409);
  });
});