import { describe, it, expect, vi } from "vitest";

// ✅ MOCK AUTH
vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

import { GET } from "./route";
import { getCurrentUser } from "@/lib/auth";

describe("GET /api/auth/me", () => {
  it("возвращает пользователя если авторизован", async () => {
    getCurrentUser.mockResolvedValue({
      id: 1,
      email: "test@test.com",
    });

    const req = new Request("http://localhost");

    const res = await GET(req);
    expect(res.status).toBe(200);
  });

  it("401 без токена", async () => {
    getCurrentUser.mockResolvedValue(null);

    const req = new Request("http://localhost");

    const res = await GET(req);
    expect(res.status).toBe(401);
  });
});