# generate-api-types

Generates `packages/api-types/src/generated/{routes,requests}.generated.ts`
from a `lemonade-backend` checkout's registered `v1/*` routes and their
`FormRequest::rules()`. See `docs/ARCHITECTURE.md` §7 (`@lemonade/api-types`)
and Phase 2.

## How it works

1. `introspect.php <backend-path>` boots the Laravel app, walks every
   registered `v1/*` route, resolves the `FormRequest` the controller method
   type-hints (via reflection — no HTTP request needed), and dumps a JSON
   manifest: method, URI, route name, auth guard, `FormRequest` class, and
   its validation rules as raw tokens (not baked example values).
2. `generate.mjs` reads that manifest (piped in, `--backend <path>` to run
   step 1 itself, or `--manifest <file>` for a saved snapshot) and emits:
   - `routes.generated.ts` — one `Object.freeze({...})` per `<guard>.<domain>`
     route-name prefix (e.g. `v1.admin.account.*` → `adminAccountRoutes`),
     covering all 290 named routes.
   - `requests.generated.ts` — one `interface` per distinct `FormRequest`
     class, with field types inferred from its validation rules
     (`rules-to-type.mjs`). Dot-notation fields (`settings.email`,
     `tickets.*.id`) become real nested objects/arrays, not literal dotted
     property names.

An unrecognized validation rule token falls through to `unknown` rather than
guessing — that means "go check the FormRequest by hand," not "this field
can be anything."

## Usage

```bash
# Against a live sibling checkout (regenerates + writes the snapshot used by CI)
pnpm --filter @lemonade/generate-api-types refresh-snapshot
pnpm --filter @lemonade/generate-api-types generate:from-backend

# Against the committed snapshot only (no PHP/backend checkout needed)
pnpm --filter @lemonade/generate-api-types generate:from-snapshot
```

`manifest.snapshot.json` is a point-in-time capture of the backend contract,
committed here so `generate:from-snapshot` and CI's contract-drift check
don't need a live backend checkout. Refresh it (`refresh-snapshot`) whenever
the backend's routes/FormRequests change and re-run `generate:from-snapshot`
to update the generated files in the same commit.

## What this doesn't cover yet

- **Response shapes.** The manifest only knows about request-side
  `FormRequest` rules — API Resources (the backend's response shape) aren't
  introspected, since that needs either running the actual serialization
  logic or a much deeper static-analysis pass. `packages/api-types/src/routes.ts`'s
  hand-written response interfaces (`LoginResult`, etc., in each
  `features/x/api.ts`) still need to be hand-maintained until this exists.
- **True live-backend drift detection in CI.** The `contract-drift` CI job
  regenerates from the _committed snapshot_ and fails if that differs from
  the committed generated files — it catches "someone hand-edited a
  generated file" or "the snapshot changed but generation wasn't re-run," not
  "the live backend's contract has moved since the snapshot was last
  refreshed." Wiring the latter needs `lemonade-backend` checked out in this
  repo's CI (a cross-repo access/secrets decision, not something to
  provision from here).
- **Replacing `packages/api-types/src/routes.ts`.** The generated route
  constants live under a separate `@lemonade/api-types/generated` import
  path specifically so they don't collide with (or silently replace) the
  hand-maintained, currently-consumed constants — several group names match
  by design (`adminAuthRoutes` exists in both), which would be an ambiguous
  `export *` otherwise. Migrating the ~15 features that import from
  `routes.ts` today over to the generated output is real, separate,
  mechanical work — worth doing once the generated naming has had a chance
  to prove itself, not folded into standing this pipeline up.
