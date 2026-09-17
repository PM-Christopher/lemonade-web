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
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { checkRuleBudget } from "./check-rule-budget.core.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

checkRuleBudget({
  ruleId: "@typescript-eslint/no-explicit-any",
  budgetPath: join(__dirname, "..", "no-any-budget.json"),
  label: "no-any-budget",
});
