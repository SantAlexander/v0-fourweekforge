import { GET } from "./route";

describe("GET /api/plans", () => {
  it("возвращает список планов", async () => {
    const req = new Request("http://localhost");

    const res = await GET(req);
    expect(res.status).toBe(200);
  });
});