#!/usr/bin/env node
// Enforces a DECLINING budget on `@typescript-eslint/no-explicit-any`
// warnings for one app — see docs/ARCHITECTURE.md Phase 3. The rule itself
// is "warn" at the app layer (apps/*/eslint.config.mjs), not "error" —
// pre-existing `any` usage is real debt, not something a single PR can
// clear, but it also shouldn't grow. This script is the actual enforcement:
// fails if an app's current count exceeds its budget entry, and prints a
// reminder to lower the budget when the count has genuinely dropped.
//
// Usage: node ../../packages/config/scripts/check-any-budget.mjs
// Run from the app's own directory (apps/frontend or apps/admin) — reads
// this app's own package.json "name" to find its budget entry.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const budgetPath = join(__dirname, "..", "no-any-budget.json");
const budget = JSON.parse(readFileSync(budgetPath, "utf8"));

const pkgName = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8")).name;
const allowed = budget[pkgName];

if (allowed === undefined) {
  console.error(
    `No no-any-budget.json entry for "${pkgName}" — add one (packages/config/no-any-budget.json).`,
  );
  process.exit(1);
}

let output;
try {
  output = execFileSync("./node_modules/.bin/eslint", [".", "--format", "json"], {
    cwd: process.cwd(),
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 32,
  });
} catch (err) {
  // ESLint exits non-zero when it finds errors (not just warnings) — the
  // JSON report is still on stdout either way, so use that rather than
  // treating a lint-error exit as a script failure here (the separate
  // "Lint" CI step is what should fail loudly for real errors).
  if (err.stdout) {
    output = err.stdout;
  } else {
    throw err;
  }
}

const results = JSON.parse(output);

let actual = 0;
for (const file of results) {
  for (const message of file.messages) {
    if (message.ruleId === "@typescript-eslint/no-explicit-any") actual++;
  }
}

if (actual > allowed) {
  console.error(
    `[no-any-budget] ${pkgName}: ${actual} \`any\` occurrences, budget is ${allowed}. ` +
      `Either fix some (great) or, if this genuinely needed a new one, raise the budget in packages/config/no-any-budget.json with a note why.`,
  );
  process.exit(1);
}

if (actual < allowed) {
  console.log(
    `[no-any-budget] ${pkgName}: ${actual} \`any\` occurrences, budget is ${allowed} — ` +
      `lower the budget in packages/config/no-any-budget.json to ${actual} to lock in the improvement.`,
  );
} else {
  console.log(`[no-any-budget] ${pkgName}: ${actual}/${allowed}, within budget.`);
}
