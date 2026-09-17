#!/usr/bin/env node
// Reads `next build`'s own stdout (piped in) and extracts the route table
// it already prints — First Load JS per route is a real number Next
// computes internally; re-deriving it from raw chunk files would just be a
// worse copy of the same logic. Outputs JSON: an array of
// { route, type, ownKB, firstLoadKB }.
//
// Usage: next build | node parse-build-output.mjs > current.json

import { readFileSync } from "node:fs";

// Matches a route row, e.g.:
//   ├ ƒ /event/[id]/add-ticket               5.4 kB          339 kB
//   └ ○ /wallet-management                   9.25 kB         203 kB
//   ├ ƒ /api/auth/login                      148 B           106 kB
const ROUTE_LINE =
  /^[┌├└]\s+([○ƒ])\s+(\S+)\s+([\d.]+)\s*(kB|B)\s+([\d.]+)\s*(kB|B)\s*$/;

function toKB(value, unit) {
  const n = Number(value);
  return unit === "B" ? n / 1024 : n;
}

export function parseBuildOutput(text) {
  const routes = [];

  for (const line of text.split("\n")) {
    const match = ROUTE_LINE.exec(line.trimEnd());
    if (!match) continue;

    const [
      ,
      typeGlyph,
      route,
      ownValue,
      ownUnit,
      firstLoadValue,
      firstLoadUnit,
    ] = match;

    routes.push({
      route,
      type: typeGlyph === "○" ? "static" : "dynamic",
      ownKB: Math.round(toKB(ownValue, ownUnit) * 100) / 100,
      firstLoadKB: Math.round(toKB(firstLoadValue, firstLoadUnit) * 100) / 100,
    });
  }

  return routes;
}

function main() {
  const input = readFileSync(0, "utf8"); // stdin
  const routes = parseBuildOutput(input);

  if (routes.length === 0) {
    console.error(
      "bundle-budget: parsed zero routes from stdin — is this really `next build` output, " +
        "or did Next change its table format?",
    );
    process.exit(1);
  }

  process.stdout.write(JSON.stringify(routes, null, 2) + "\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
