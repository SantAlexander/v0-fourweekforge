import { describe, it, expect, vi } from "vitest";

// 🧠 MOCK DB
vi.mock("@/lib/db", () => ({
  sql: vi.fn(),
}));

import { POST } from "./route";
import { sql } from "@/lib/db";

describe("POST /api/feedback", () => {
  it("отправляет feedback", async () => {
    sql.mockResolvedValue({});

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        message: "test feedback",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("ошибка при пустом сообщении", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});