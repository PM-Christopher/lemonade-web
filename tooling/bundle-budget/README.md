# bundle-budget

Fails CI on a bundle-size regression vs. the base branch, per
`docs/ARCHITECTURE.md` §15: "fail the build on regression rather than on
absolute numbers, so the ratchet only turns one way." Two small scripts, no
new runtime dependency — `next build` already prints First Load JS per
route; this just parses that table instead of re-deriving the same number
worse from raw chunk files.

## How it works

1. `parse-build-output.mjs` reads `next build`'s stdout (piped in) and
   extracts `{ route, type, ownKB, firstLoadKB }` for every route row into
   JSON.
2. `compare.mjs` takes two such snapshots (base branch, current branch) plus
   `--app frontend|admin`, and reports:
   - **Regression** — a route present in both snapshots whose `firstLoadKB`
     grew by more than `--tolerance-kb` (default 2 KB, to absorb ordinary
     chunk-hash noise between builds of otherwise-identical code).
   - **New route over budget** — a route with no baseline (new this PR) is
     judged against the app's absolute ceiling instead, since there's
     nothing to regress against:
     - `admin`: flat 500 KB
     - `frontend`: 200 KB for routes in `PUBLIC_PATHS` (mirrors
       `apps/frontend/src/middleware.ts` exactly — keep both lists in sync),
       350 KB for everything else
   - An **existing** route that's already over budget from before this PR
     is never flagged on that alone — only on regressing further. That's
     the "ratchet only turns one way" rule: this tool burns down new debt,
     it doesn't retroactively block on debt nobody introduced this PR.

Exits `1` if there's any finding, `0` otherwise.

## Usage

```bash
# Base branch
git checkout origin/main
pnpm --filter lemonade-app build | node tooling/bundle-budget/parse-build-output.mjs > base.json

# PR branch
git checkout -
pnpm --filter lemonade-app build | node tooling/bundle-budget/parse-build-output.mjs > current.json

node tooling/bundle-budget/compare.mjs --base base.json --current current.json --app frontend
```

See `.github/workflows/ci.yml`'s `bundle-budget` job for how this runs in
CI — it builds both branches once each, not per-PR-push.
