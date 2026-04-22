import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node", // важно для API (не jsdom)
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});