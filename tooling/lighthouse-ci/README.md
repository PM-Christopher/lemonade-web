# lighthouse-ci

Runs [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) against
both apps' pages, checking the LCP/CLS targets from
`docs/ARCHITECTURE.md` §15 ("LCP < 2.5s and CLS < 0.1 ... for public
pages").

## Scope — why only the pre-login pages

§15's target was written for "public pages": event, tribe, business,
discover. Those don't exist as public pages today — Phase 6's own status
found there's no `(public)` route group, and every one of frontend's
`PROTECTED_PREFIXES` (`/event`, `/tribe`, `/business`, `/settings`, `/`)
redirects an unauthenticated visitor to `/login`. Making them public is a
genuine product decision the user explicitly deferred, not a frontend
implementation detail — see that section for the full finding.

So this checks the pages that actually are reachable without a session
today: `middleware.ts`'s own `PUBLIC_PATHS` (login, signup,
forgot-password — a representative few, not all seven, to keep CI runtime
reasonable). That's a real, measurable subset, not a placeholder. When the
public-pages product decision lands, add those routes to
`lighthouserc.frontend.json`'s `collect.url` array — nothing else about
this setup needs to change.

## Why `warn`, not `error`

Every assertion here is `warn`, matching the same "report visible, don't
block on debt nobody's measured yet" reasoning as `ci.yml`'s `audit` job
(see that job's own comment). This is the first time these pages have had
Lighthouse run against them in CI at all — turning it into a hard gate
before establishing a real baseline would fail PRs on pre-existing
performance, not on anything the PR introduced. Flip individual assertions
to `error` once a baseline run confirms they pass cleanly.

## Running locally

```bash
pnpm --filter lemonade-app build
pnpm --filter @lemonade/lighthouse-ci frontend

pnpm --filter lemonade-admin build
pnpm --filter @lemonade/lighthouse-ci admin
```

Reports are written to `./lhci-reports/<app>/` (gitignored) — open any
`*.report.html` in a browser for the full trace, not just the pass/warn
summary Lighthouse CI prints to the terminal.
