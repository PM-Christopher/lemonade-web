# ADR 0002: One shadcn style for `@lemonade/ui`, reconciled from both apps' divergence

**Status:** Accepted
**Date:** 2026-09-17

## Decision

`@lemonade/ui`'s primitives (`Button`, `Card`, `Input`, `Label`, `Select`, `Textarea`) use shadcn's
"new-york" style conventions as the base (icon-aware button sizing, `lucide-react` icons, mobile-safe
`text-base md:text-sm` input/textarea sizing), with two deliberate exceptions kept from the "default"
style because they're correctness fixes, not style preference: `Card`'s title/description render as
semantic `<h3>`/`<p>` (not `<div>`), and `Input` carries a password-visibility toggle gated on
`type="password"`.

## Context and rationale

`apps/admin` and `apps/frontend` each had their own `components/ui/` copy of these primitives, set up
independently and never reconciled — admin ended up on shadcn's "new-york" style, frontend on "default".
`packages/ui/src/index.ts` carried a `TODO(Phase 7)` flagging this as a known, unresolved blocker to
actually sharing the components.

Diffing all 7 overlapping files found the divergence wasn't purely cosmetic:

- `label.tsx` was byte-identical — no decision needed.
- `button.tsx`, `card.tsx`, `select.tsx`, `textarea.tsx` differed only in shadcn preset conventions
  (icon-sizing utilities, icon library, class ordering, responsive text sizing) — pick one, no
  functionality lost either way.
- `select.tsx` also had a real bug in frontend's copy: `data-[disabled]:pointer-tribes-none` instead of
  `pointer-events-none` — almost certainly a stray find-replace artifact from unrelated tribes-domain
  work elsewhere in the codebase. Fixed by taking admin's (correct) class as part of the same
  consolidation, not as a separate change.
- `input.tsx` had a genuine functional gap, not just style: frontend's version had a password
  show/hide toggle admin's completely lacked.

Chose new-york as the base because two of its differences are objectively better on their own merits,
independent of which app "started" with them: `lucide-react` is already the dominant icon library
everywhere else in both apps (frontend's `@radix-ui/react-icons` usage was confined to these primitives),
and the `text-base md:text-sm` input sizing avoids iOS Safari's auto-zoom-on-focus — a real mobile UX
win, notable since it happened to live in the "desktop" admin app rather than the mobile-first frontend
app that actually needs it.

Kept `Input`'s password toggle rather than dropping it, since removing a real feature to make a style
merge cleaner is a regression, not a simplification — and it's implemented as a behavior gated on
`type="password"`, not an app-specific flag, so it doesn't trip CLAUDE.md's "no app-shaped branching
inside a package" rule: any consumer gets it by passing that type.

## Consequences

- Every consumer of these 6 primitives (54 button call sites, 39 label, 34 input, 13 card, 12 select, 3
  textarea, across both apps) now renders through one shared implementation — a bug fixed in
  `packages/ui` is fixed everywhere, not just wherever someone remembers to port the fix.
- Admin's `Input` fields gained the password-visibility toggle it never had, purely as a side effect of
  promotion — a real, if incidental, UX improvement to admin's login and password-change flows.
- Both apps' local `components/ui/` directories dropped the 6 promoted files; admin's directory is gone
  entirely, since all 7 of its files turned out to also exist in frontend.
- The two apps' `class-variance-authority`/`@radix-ui/react-icons` dependency needs diverged as a result:
  frontend still needs both directly (other, non-promoted primitives — `badge.tsx`, `multi-select.tsx`,
  a couple of event components — still use them), admin needs neither anymore. Verified via grep before
  removing either from admin's `package.json`, not assumed.
