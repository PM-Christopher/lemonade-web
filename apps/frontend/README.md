# frontend (`lemonade-app`)

The public, mobile-first creator platform — tribes, threads, events, ticketing, business listings, jobs,
Connect messaging, wallet, subscriptions. Public + authenticated, at scale. Server-rendered wherever the
page is readable — first paint and SEO matter here in a way they don't for `apps/admin`. See root
`README.md` and `docs/ARCHITECTURE.md` for the wider monorepo context.

## Running it

```bash
pnpm install
cp .env.example .env.local   # fill in LARAVEL_API_URL at minimum
pnpm --filter lemonade-app dev
```

Needs a running `lemonade-backend` at `LARAVEL_API_URL` for anything beyond static rendering. `.env.example`
documents every variable, required and optional (Google OAuth, Pusher, Firebase push notifications — the
app degrades rather than crashing when the optional ones are unset).

## Structure

```
src/app/
  (auth)/       login, signup, forgot/reset password, verify-email, verify-code, profile-setup
  (main)/       everything behind auth — event, tribe, business, settings, connect
  api/          Route Handlers — the BFF layer (auth cookies, proxying to the backend)
src/features/
  authentication, business, connect, dashboard, events, settings, tribes, transaction, shared
src/components/  app-wide, cross-feature UI (nav, layout, global alerts)
src/lib/         app-local glue — logger, server-api (BFF transport), query-client, env validation
```

Route protection is `src/middleware.ts` (UX redirect only — see its own comments for the real
authorization chain) plus a `Content-Security-Policy-Report-Only` header with a per-request nonce (see
`docs/ARCHITECTURE.md` Phase 8).

## Commands

```bash
pnpm --filter lemonade-app dev          # localhost:3000
pnpm --filter lemonade-app build
pnpm --filter lemonade-app lint
pnpm --filter lemonade-app lint:any-budget      # fails if `any` usage grew — see packages/config/no-any-budget.json
pnpm --filter lemonade-app lint:pixel-budget    # fails if hardcoded [Npx] classes grew
pnpm --filter lemonade-app typecheck
pnpm --filter lemonade-app test
```

## Things worth knowing before changing this app

- **`"use client"` goes on the smallest component that needs it**, not a page or layout — see
  `CLAUDE.md`. A page that needs it is a signal data orchestration hasn't been lifted into a Server
  Component.
- **Money is displayed, never computed** — format via `@lemonade/domain`, render server-computed figures.
- **Shared UI primitives come from `@lemonade/ui`**, not a local `components/ui/` copy — that directory
  now only holds primitives with exactly one real consumer (this app), not the ones both apps share.
- Real known gaps are tracked in `docs/ARCHITECTURE.md`'s Phase 6/7/8 status sections, not silently fixed
  here — e.g. most modals are still hand-built `<div>`s rather than the `Dialog` primitive, and ~2,600
  hardcoded pixel Tailwind classes remain under a declining-budget lint ratchet.
