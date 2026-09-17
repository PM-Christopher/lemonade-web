// Shared core for the declining-budget scripts (check-any-budget.mjs,
// check-pixel-budget.mjs, and any future one) — same enforcement shape,
// different rule/budget file/label. See docs/ARCHITECTURE.md §18.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export function checkRuleBudget({ ruleId, budgetPath, label }) {
  const budget = JSON.parse(readFileSync(budgetPath, "utf8"));

  const pkgName = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8")).name;
  const allowed = budget[pkgName];

  if (allowed === undefined) {
    console.error(`No ${budgetPath} entry for "${pkgName}" — add one.`);
    process.exitCode = 1;
    return;
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
      if (message.ruleId === ruleId) actual++;
    }
  }

  if (actual > allowed) {
    console.error(
      `[${label}] ${pkgName}: ${actual} occurrences, budget is ${allowed}. ` +
        `Either fix some (great) or, if this genuinely needed a new one, raise the budget in ${budgetPath} with a note why.`,
    );
    process.exitCode = 1;
    return;
  }

  if (actual < allowed) {
    console.log(
      `[${label}] ${pkgName}: ${actual} occurrences, budget is ${allowed} — ` +
        `lower the budget in ${budgetPath} to ${actual} to lock in the improvement.`,
    );
  } else {
    console.log(`[${label}] ${pkgName}: ${actual}/${allowed}, within budget.`);
  }
}
