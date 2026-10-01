# API Contract

How `packages/api-types` is generated from `lemonade-backend`, and what to do when generation and reality
disagree. See `docs/ARCHITECTURE.md` §7 (`@lemonade/api-types`) and §19 (contract-drift CI check). The
full mechanics live in `tooling/generate-api-types/README.md` — this doc is the short version: where the
contract comes from, and what a CI failure or a real mismatch actually means for a PR.

## Where the types come from

`packages/api-types/src/generated/{routes,requests}.generated.ts` are generated, not hand-written, from
`lemonade-backend`'s registered `v1/*` routes and their `FormRequest::rules()`. Two ways to regenerate:

```bash
# Against a live sibling checkout of lemonade-backend
pnpm --filter @lemonade/generate-api-types refresh-snapshot
pnpm --filter @lemonade/generate-api-types generate:from-backend

# Against the committed snapshot only — no PHP or backend checkout needed
pnpm --filter @lemonade/generate-api-types generate:from-snapshot
```

`manifest.snapshot.json` is a point-in-time capture of the backend contract, committed in this repo so
the second form (and CI) work without a live backend. Refresh it whenever the backend's routes or
`FormRequest`s change, then regenerate in the same commit.

## What's generated vs. hand-written

- **Generated:** request-side shapes — route constants and the field types a `FormRequest`'s validation
  rules imply.
- **Still hand-written:** response shapes. The manifest only sees request-side rules; API Resources
  (the backend's actual response serialization) aren't introspected. Response interfaces (`LoginResult`
  and friends, defined per `features/x/api.ts`) still need a human to keep them in sync with what the
  backend actually returns.
- **Migrated, `routes.ts` deleted:** every feature in both apps now imports route constants from
  `@lemonade/api-types/generated` (`routes.generated.ts`) — the hand-maintained `packages/api-types/src/routes.ts`
  this section used to describe as a parallel, not-yet-migrated source is gone. Use `buildPath(template,
  params)` (`packages/api-types/src/build-path.ts`) to fill a generated route's `{param}` placeholders,
  e.g. `buildPath(adminUsersRoutes.SHOW, { id })` — a generated parameterized route already contains
  `{id}` (or whatever the backend's real route parameter is named) baked into the string, so it's never
  built by concatenating a suffix onto a separate BASE constant the way the old hand-written file worked.

## When generation and reality disagree

**CI's `contract-drift` job fails** ("regenerated output doesn't match what's committed"): someone
hand-edited a generated file directly, or changed `manifest.snapshot.json` without re-running
`generate:from-snapshot` afterward. Fix: run `generate:from-snapshot`, commit the result, don't hand-edit
`*.generated.ts`.

**A field is typed `unknown`:** the generator hit a validation rule token it doesn't recognize and refused
to guess. That's not a bug to silently work around with `as` — go read the actual `FormRequest` by hand
and either widen `rules-to-type.mjs`'s rule vocabulary (if the rule is common enough to be worth teaching
the generator) or type the field by hand at the call site with a comment explaining why.

**The live backend has changed but the snapshot hasn't:** `contract-drift` only catches drift against the
_committed_ snapshot, not the live backend — there's no live-backend check in CI today (would need
`lemonade-backend` checked out in this repo's CI, a cross-repo access decision, not something to
provision unilaterally). If a PR's manual testing turns up a real request/response shape mismatch against
the actual running backend, that's a signal to refresh the snapshot, not evidence the generator is wrong.

**A response shape is wrong:** since response types are hand-written, this is a normal bug — fix the
interface in the owning feature's `api.ts`, no generator involved.
