import { POST } from "./route";

describe("POST /api/auth/register", () => {
  it("создаёт пользователя", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        email: "new@test.com",
        password: "123456",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it("ошибка при дубликате email", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        email: "test@test.com",
        password: "123456",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(409);
  });
});