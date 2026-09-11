# ADR 0001: One monorepo for admin + frontend; backend stays separate

**Status:** Accepted
**Date:** 2026-09-11

## Decision

`lemonade-web` is a pnpm + Turborepo monorepo containing `apps/admin`,
`apps/frontend`, and `packages/*`. `lemonade-backend` (Laravel) remains in
its own repository.

## Context and rationale

See `docs/ARCHITECTURE.md` §8 ("Monorepo vs. Multi-Repository") for the full
analysis: the three-repo status quo produced 32 diverged copy-paste files,
two incompatible auth implementations, and two design systems, because
sharing code across separate repos requires registry publishing and
version-bumping friction that a small team reliably abandons back into
copy-paste.

The backend stays separate because it's a different toolchain (Composer,
PHPUnit, Pint, PHPStan vs. Turborepo's JS graph), a different deployment
cadence, already has its own CI/tests/docs, and crosses the boundary as a
published contract (`@lemonade/api-types`, generated) rather than a file
import.

## Consequences

- A shared-package change can break both frontend apps in one commit —
  mitigated by Turborepo's affected-graph CI and the boundary rules in
  `docs/ARCHITECTURE.md` §7.
- The backend publishes its contract as an artifact; the web repo generates
  types from it. A contract-drift CI check catches divergence (see §19) —
  this is the direct fix for the `/api` vs `/v1` breakage that motivated
  this whole plan (see §3.1).
