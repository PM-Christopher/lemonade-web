# lemonade-web

pnpm + Turborepo monorepo for the Lemonade admin console and public frontend. Both are Next.js 15 apps
that consume `lemonade-backend` (Laravel, separate repo) as their sole source of business logic — see
`CLAUDE.md`'s governing principle: the backend owns business logic, these apps own presentation and
interaction.

**Start here:** `docs/ARCHITECTURE.md` — the technical architecture and modernization plan this repo is
built against, including current status per phase. `CLAUDE.md` and `.cursor/rules/` distill the same rules
for AI coding agents.

## Status

Phases 0–5 of the modernization plan (working software, quality gates, monorepo consolidation, version
alignment, transport/auth, server-state migration) are done. Phases 6–8 (Server Components & performance,
design system, observability & hardening) are mostly done, with specific remaining items tracked in
`docs/ARCHITECTURE.md`'s own per-phase status — some blocked on backend work (server-side pagination) or
external resources (a Sentry account, a live backend for end-to-end tests) rather than anything left to
decide here.

## Structure

```
apps/
  admin/          Internal ops console — money, moderation, platform config. Desktop, client-heavy OK.
  frontend/       Public creator platform — tribes, events, wallet, Connect. Server-rendered where readable.
packages/
  api-client/     Shared HTTP transport: refresh-on-401, error normalization
  api-types/      Generated + hand-written contract types — see docs/CONTRACT.md
  domain/         Pure functions: money formatting, dates, status vocab, error copy
  ui/             Shared primitives (Button, Card, Input, Label, Select, Textarea) — no domain knowledge
  config/         Shared ESLint, TypeScript, Tailwind, Prettier, Vitest config
tooling/
  generate-api-types/   Backend route manifest → packages/api-types/src/generated/*
  bundle-budget/        Fails CI on a First Load JS regression vs. base branch
  lighthouse-ci/        Report-only LCP/CLS checks on the real public (pre-login) pages
  contrast-audit/       Report-only WCAG contrast check on the shared design tokens
docs/
  ARCHITECTURE.md       Full technical plan, phase-by-phase status, measured findings
  CONTRACT.md           API contract generation — what to do when it and reality disagree
  adr/                  Architecture decision records
```

Each app follows the same internal shape (`app/`, `features/<domain>/`, `components/`, `lib/`) — see
`apps/admin/README.md` and `apps/frontend/README.md`, and `docs/ARCHITECTURE.md` §9–10 for the full
layering rules.

## Commands

```bash
pnpm install
pnpm dev          # turbo run dev — both apps
pnpm build        # turbo run build
pnpm lint
pnpm typecheck
pnpm test
```

Per-app/package commands run the same way via `pnpm --filter <name> <script>` — e.g.
`pnpm --filter lemonade-app dev` for just the frontend, or `pnpm --filter @lemonade/ui test` for the
shared UI package.

## Requirements

- Node >= 22
- pnpm 11.x (`packageManager` field is pinned in `package.json`)
- A running `lemonade-backend` (separate repo) for anything beyond static rendering — see that repo's own
  README for setup. `apps/*/.env.example` documents the `LARAVEL_API_URL` and related variables each app
  expects.
