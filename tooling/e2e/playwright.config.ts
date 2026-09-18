import { existsSync, readFileSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

// No dotenv dependency — this repo's other tooling scripts avoid adding one
// just for local env loading, so match that. Real credentials live in a
// gitignored .env.e2e.local (see .env.e2e.example); CI sets these as real
// env vars instead, so this is a no-op there.
const envFile = new URL("./.env.e2e.local", import.meta.url);
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split("\n")) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match) process.env[match[1]] ??= match[2];
  }
}

// Runs against a real backend — see README.md for the live credentials this
// suite expects and which of docs/ARCHITECTURE.md §17's ten journeys are
// actually covered. `reuseExistingServer` mirrors this repo's other
// against-a-real-server checks (bundle-budget, Lighthouse): locally, reuse
// whatever's already running (this repo's dev servers, started against a
// real backend, aren't something this suite should kill and restart);
// in CI, always start clean.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false, // shared login state (storageState) per project — avoid cross-test races
  // Fully serial, not left to the CPU-count default — both apps' dev
  // servers compile routes on demand (next dev, not a production build),
  // and any concurrency was measured to cause real, non-deterministic
  // timeouts as the suite grew (a table or list taking longer than a test's
  // wait to populate under load), not a bug in the app or the test. This
  // suite is meant to be trustworthy on merge, not fast — a slower,
  // reliable 2 minutes beats a faster, flaky 1.
  workers: 1,
  forbidOnly: !!process.env.CI,
  // 1 even locally, not just in CI — session.spec.ts's post-reload check
  // against a real dev server has shown occasional single-retry flakiness
  // (the cookie/middleware round trip, not a reproducible app bug — see
  // README.md). A real backend and a real dev server are both slower and
  // less deterministic than a mock; absorb that rather than chase it
  // indefinitely.
  retries: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "frontend-setup",
      testMatch: /frontend\/auth\.setup\.ts/,
      use: { baseURL: "http://localhost:3000" },
    },
    {
      name: "frontend",
      testDir: "./tests/frontend",
      testIgnore: /auth\.setup\.ts/,
      dependencies: ["frontend-setup"],
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3000",
        storageState: ".auth/user.json",
      },
    },
    {
      name: "admin-setup",
      testMatch: /admin\/auth\.setup\.ts/,
      use: { baseURL: "http://localhost:3001" },
    },
    {
      name: "admin",
      testDir: "./tests/admin",
      testIgnore: /auth\.setup\.ts/,
      dependencies: ["admin-setup"],
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3001",
        storageState: ".auth/admin.json",
      },
    },
  ],
  webServer: [
    {
      command: "pnpm --filter lemonade-app exec next dev -p 3000",
      // "/login" specifically, not "/" — "/" 307-redirects when unauthenticated
      // (middleware.ts), and Playwright's readiness probe wants a real 2xx.
      url: "http://localhost:3000/login",
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      cwd: "../..",
    },
    {
      // Explicitly not the "dev" package.json script (`next dev --turbopack`)
      // — Turbopack hits an unrelated "Next.js package not found" internal
      // error in some environments (confirmed during this session, on this
      // machine). Plain `next dev` doesn't have that problem, and e2e
      // doesn't need Turbopack's faster HMR anyway.
      command: "pnpm --filter lemonade-admin exec next dev -p 3001",
      url: "http://localhost:3001/login",
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      cwd: "../..",
    },
  ],
});
