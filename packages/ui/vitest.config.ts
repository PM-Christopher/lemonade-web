import react from "@vitejs/plugin-react";
import { mergeConfig, defineConfig } from "vitest/config";
import base from "@lemonade/config/vitest.base";

export default mergeConfig(
  base,
  defineConfig({
    plugins: [react()],
    test: {
      environment: "jsdom",
      setupFiles: ["./vitest.setup.ts"],
    },
  }),
);
