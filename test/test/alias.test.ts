import { describe, it, expect } from "vitest";
import { loginSchema } from "@/lib/schemas/user";

describe("alias", () => {
  it("работает импорт через @", () => {
    expect(loginSchema).toBeDefined();
  });
});