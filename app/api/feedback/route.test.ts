import { POST } from "./route";

describe("POST /api/feedback", () => {
  it("отправляет feedback", async () => {
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