import { describe, it, expect, vi } from "vitest";

// 🧠 MOCKS
vi.mock("@/lib/db", () => ({
  sql: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(() => ({ id: 1 })),
}));

vi.mock("@/lib/db", () => ({
  sql: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: "Test plan",
      tasks: [],
    },
  ]),
}));

import { GET } from "./route";

describe("GET /api/plans", () => {
  it("возвращает список планов", async () => {
    const req = new Request("http://localhost");

    const res = await GET(req);
    expect(res.status).toBe(200);
  });
});