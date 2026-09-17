#!/usr/bin/env node
// Enforces a DECLINING budget on `local/no-hardcoded-pixel-class` warnings
// for one app — see docs/ARCHITECTURE.md Phase 7 and
// eslint-rules/no-hardcoded-pixel-class.js. Same shape as
// check-any-budget.mjs: pre-existing `[Npx]` classes are real debt, not
// something a single PR can clear, but the count shouldn't grow either.
//
// Usage: node ../../packages/config/scripts/check-pixel-budget.mjs
// Run from the app's own directory (apps/frontend or apps/admin).
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { checkRuleBudget } from "./check-rule-budget.core.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

checkRuleBudget({
  ruleId: "local/no-hardcoded-pixel-class",
  budgetPath: join(__dirname, "..", "pixel-class-budget.json"),
  label: "pixel-class-budget",
});
