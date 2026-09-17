# admin (`lemonade-admin`)

The internal operations console — money, moderation, platform config. Small, authenticated, trained,
desktop audience. Client-heavy is acceptable here in a way it isn't for `apps/frontend`. See root
`README.md` and `docs/ARCHITECTURE.md` for the wider monorepo context.

## Running it

```bash
pnpm install
cp .env.example .env.local   # fill in LARAVEL_API_URL at minimum
pnpm --filter lemonade-admin dev
```

Needs a running `lemonade-backend` at `LARAVEL_API_URL` for anything beyond static rendering.
`--turbopack` is the default `dev` script here; if it hits an unrelated "Next.js package not found"
internal error in your environment, `next dev` (without `--turbopack`) works — `next build` (what CI and
production actually use) is unaffected either way.

## Structure

```
src/app/
  (auth)/       login, forgot/reset password
  (main)/       users, transactions, events, wallet-management, team, reporting, announcements, tribes
  api/          Route Handlers — the BFF layer (auth cookies, CSV export, proxying to the backend)
src/features/
  announcements, authentication, dashboard, events, exports, profile, reporting, team, transaction, user, wallet
src/components/  app-wide, cross-feature UI (main layout, global alerts)
src/lib/         app-local glue — logger, server-api (BFF transport), query-client, env validation
```

Route protection is `src/middleware.ts` (UX redirect only — see its own comments for the real
authorization chain) plus a `Content-Security-Policy-Report-Only` header with a per-request nonce (see
`docs/ARCHITECTURE.md` Phase 8).

## Commands

```bash
pnpm --filter lemonade-admin dev          # localhost:3000 (or :3001 if frontend's already running)
pnpm --filter lemonade-admin build
pnpm --filter lemonade-admin lint
pnpm --filter lemonade-admin lint:any-budget      # fails if `any` usage grew — see packages/config/no-any-budget.json
pnpm --filter lemonade-admin lint:pixel-budget    # fails if hardcoded [Npx] classes grew
pnpm --filter lemonade-admin typecheck
pnpm --filter lemonade-admin test
```

## Things worth knowing before changing this app

- **`"use client"` goes on the smallest component that needs it**, not a page or layout — see
  `CLAUDE.md`. Every real page's Server Component now prefetches its default tab's data and hands off to
  a client component for interactivity (search, filters, tabs) — see any `<Feature>Client.tsx` next to
  its `page.tsx` for the pattern.
- **Money is displayed, never computed** — format via `@lemonade/domain`, render server-computed figures.
  This matters more here than anywhere else in the monorepo: this app is where payouts, wallet balances,
  and commission adjustments actually happen.
- **Shared UI primitives come from `@lemonade/ui`**, not a local `components/ui/` copy — that directory
  doesn't exist in this app anymore; every primitive this app used turned out to also be used by
  `apps/frontend`, so all of them got promoted.
- Real known gaps are tracked in `docs/ARCHITECTURE.md`'s Phase 6/7/8 status sections, not silently fixed
  here — e.g. server-side pagination on the largest tables (users, transactions, reporting) is blocked on
  a backend change, and most modals are still hand-built `<div>`s rather than the `Dialog` primitive.
