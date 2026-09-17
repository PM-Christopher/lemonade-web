#!/usr/bin/env node
// Fails on bundle-size regression vs. the base branch — never on an
// absolute number for a route that already existed, so the ratchet only
// turns one way (see docs/ARCHITECTURE.md §15). A route with no baseline
// (new this PR) has nothing to regress against, so it's checked against
// the app's absolute First Load JS ceiling instead.
//
// Usage:
//   node compare.mjs --base base.json --current current.json --app frontend
//   node compare.mjs --base base.json --current current.json --app admin

import { readFileSync } from "node:fs";

// docs/ARCHITECTURE.md §15's budgets. Frontend's public/authenticated
// split mirrors src/middleware.ts's PUBLIC_PATHS exactly — keep these two
// lists in sync if that file changes.
const FRONTEND_PUBLIC_PATHS = new Set([
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/verify-code",
  "/profile-setup",
]);

const BUDGETS_KB = {
  frontend: { public: 200, authenticated: 350 },
  admin: { flat: 500 },
};

// A route's own delta must clear this before it counts as a regression —
// chunk-hash/whitespace-level noise between two builds of identical code
// is common and shouldn't fail CI.
const DEFAULT_TOLERANCE_KB = 2;

function parseArgs(argv) {
  const args = { toleranceKb: DEFAULT_TOLERANCE_KB };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--base") args.base = argv[++i];
    else if (arg === "--current") args.current = argv[++i];
    else if (arg === "--app") args.app = argv[++i];
    else if (arg === "--tolerance-kb") args.toleranceKb = Number(argv[++i]);
  }
  if (!args.base || !args.current || !args.app) {
    console.error(
      "Usage: node compare.mjs --base <file> --current <file> --app <frontend|admin> [--tolerance-kb N]",
    );
    process.exit(2);
  }
  if (!BUDGETS_KB[args.app]) {
    console.error(
      `Unknown --app "${args.app}" — expected "frontend" or "admin".`,
    );
    process.exit(2);
  }
  return args;
}

function ceilingFor(app, route) {
  const budget = BUDGETS_KB[app];
  if ("flat" in budget) return budget.flat;
  return FRONTEND_PUBLIC_PATHS.has(route)
    ? budget.public
    : budget.authenticated;
}

function loadRoutes(path) {
  const routes = JSON.parse(readFileSync(path, "utf8"));
  return new Map(routes.map((r) => [r.route, r]));
}

export function compare({ base, current, app, toleranceKb }) {
  const findings = [];

  for (const [route, currentRoute] of current) {
    const baseRoute = base.get(route);
    const ceiling = ceilingFor(app, route);

    if (!baseRoute) {
      // New route this PR — nothing to regress against, so it's judged
      // against the absolute ceiling instead.
      if (currentRoute.firstLoadKB > ceiling) {
        findings.push({
          route,
          kind: "new-route-over-budget",
          firstLoadKB: currentRoute.firstLoadKB,
          ceiling,
        });
      }
      continue;
    }

    const deltaKB =
      Math.round((currentRoute.firstLoadKB - baseRoute.firstLoadKB) * 100) /
      100;
    if (deltaKB > toleranceKb) {
      findings.push({
        route,
        kind: "regression",
        baseKB: baseRoute.firstLoadKB,
        currentKB: currentRoute.firstLoadKB,
        deltaKB,
      });
    }
  }

  return findings;
}

function formatReport(findings, { app, toleranceKb }) {
  const lines = [
    `bundle-budget (${app}): ${findings.length} finding(s), tolerance ${toleranceKb} KB`,
  ];

  if (findings.length === 0) {
    lines.push("  No regressions, no new route over budget.");
    return lines.join("\n");
  }

  for (const f of findings) {
    if (f.kind === "regression") {
      lines.push(
        `  REGRESSION  ${f.route}  ${f.baseKB} KB -> ${f.currentKB} KB  (+${f.deltaKB} KB)`,
      );
    } else {
      lines.push(
        `  NEW ROUTE OVER BUDGET  ${f.route}  ${f.firstLoadKB} KB > ${f.ceiling} KB ceiling`,
      );
    }
  }

  return lines.join("\n");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const base = loadRoutes(args.base);
  const current = loadRoutes(args.current);

  const findings = compare({
    base,
    current,
    app: args.app,
    toleranceKb: args.toleranceKb,
  });
  console.log(
    formatReport(findings, { app: args.app, toleranceKb: args.toleranceKb }),
  );

  process.exit(findings.length > 0 ? 1 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
