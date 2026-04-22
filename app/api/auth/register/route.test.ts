import { describe, it, expect, vi } from "vitest";

// 🧠 MOCKS
vi.mock("@/lib/db", () => ({
  sql: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  hashPassword: vi.fn(() => "hashed"),
  createToken: vi.fn(() => "token"),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(() => true),
  resetRateLimit: vi.fn(),
  getClientIp: vi.fn(() => "127.0.0.1"),
}));

import { POST } from "./route";
import { sql } from "@/lib/db";

describe("POST /api/auth/register", () => {
  it("создаёт пользователя", async () => {
    sql.mockResolvedValue({ rows: [] });

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
    sql.mockResolvedValue({
      rows: [{ id: 1 }], // пользователь уже есть
    });

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