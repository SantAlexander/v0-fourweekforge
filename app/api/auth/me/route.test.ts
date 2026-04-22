import { GET } from "./route";

describe("GET /api/auth/me", () => {
  it("возвращает пользователя если авторизован", async () => {
    const req = new Request("http://localhost", {
      method: "GET",
      headers: {
        Authorization: "Bearer test-token",
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(200);
  });

  it("401 без токена", async () => {
    const req = new Request("http://localhost");

    const res = await GET(req);
    expect(res.status).toBe(401);
  });
});