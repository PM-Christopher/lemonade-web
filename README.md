# lemonade-web

pnpm + Turborepo monorepo for the Lemonade admin console and public
frontend. Both are Next.js apps that consume `lemonade-backend` (Laravel,
separate repo) as their sole source of business logic.

**Start here:** `docs/ARCHITECTURE.md` — the technical architecture and
modernization plan this repo is being built against. Sections 9, 10 and 13
are the operative ones for day-to-day work (folder structure, coding
patterns, auth flow). `CLAUDE.md` and `.cursor/rules/` distill the same
rules for AI coding agents.

## Status

Tooling scaffold only — `apps/admin` and `apps/frontend` are placeholders.
The real app code is migrated in with `git subtree` once each original
repo's Phase 0 (API contract repair) and Phase 1 (lint/CI/test gates) are
done — see `docs/ARCHITECTURE.md` §8 and §21.

## Structure

```
apps/           admin, frontend — Next.js apps (placeholders for now)
packages/       api-types, api-client, domain, ui, config — shared code
tooling/        generate-api-types
docs/           ARCHITECTURE.md, CONTRACT.md, adr/
```

## Commands

```bash
pnpm install
pnpm dev          # turbo run dev
pnpm build        # turbo run build
pnpm lint
pnpm typecheck
pnpm test
```

## Requirements

- Node >= 22
- pnpm 11.x (`packageManager` field is pinned in `package.json`)
