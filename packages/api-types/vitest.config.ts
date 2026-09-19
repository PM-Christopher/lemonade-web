import { mergeConfig, defineConfig } from "vitest/config";
import base from "@lemonade/config/vitest.base";

export default mergeConfig(
  base,
  defineConfig({
    test: {
      environment: "node",
    },
  }),
);
