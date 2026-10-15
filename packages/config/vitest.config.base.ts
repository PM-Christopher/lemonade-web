import { defineConfig } from "vitest/config";

// Shared Vitest base. Packages extend this with `mergeConfig` and add their
// own `environment` (packages/domain and packages/api-client are pure Node;
// component tests need `jsdom`). See docs/ARCHITECTURE.md §17.
export default defineConfig({
  test: {
    globals: true,
    // axe accessibility checks are slow on busy CI runners; the 5s default flakes.
    testTimeout: 15_000,
    coverage: {
      provider: "v8",
      reporter: ["text-summary"],
      include: ["src/**"],
      exclude: ["**/*.test.*", "**/*.d.ts", "src/generated/**"],
      // 90% bar for packages/*, enforced by their `test` scripts. Apps don't run coverage.
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
    },
  },
});
