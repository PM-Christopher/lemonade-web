import { defineConfig } from "vitest/config";

// Shared Vitest base. Packages extend this with `mergeConfig` and add their
// own `environment` (packages/domain and packages/api-client are pure Node;
// component tests need `jsdom`). See docs/ARCHITECTURE.md §17.
export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      // 90% is the bar for packages/* — the highest in the repo, because a
      // bug in a shared package hits both apps at once. App-level code is
      // not held to a coverage gate; see docs/ARCHITECTURE.md §17.
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
    },
  },
});
