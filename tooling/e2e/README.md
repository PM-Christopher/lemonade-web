# e2e

Playwright end-to-end suite against a real running backend — see `docs/ARCHITECTURE.md` §17 for the
original "ten journeys" list this is meant to grow into. **Not automatically wired into `.github/workflows/ci.yml`**:
unlike this repo's other CI jobs, this one needs a live `lemonade-backend` and real (if low-stakes,
seed/demo) credentials, neither of which the existing CI environment has. Run it manually, or against a
CI environment that's been given both — see "Wiring into CI" below.

## What's actually covered today

Not the full ten journeys — those assume things this suite doesn't have yet: a payment gateway sandbox
(journey 4), a second seeded test account (journey 10 needs two parties messaging each other), and a way
to read a real OTP/verification email (journey 1's email verification step). What's genuinely covered,
against the real backend:

- **Auth** (`tests/{frontend,admin}/auth.setup.ts`) — real login for both a regular user and an admin,
  saving `storageState` so the rest of the suite doesn't re-login per test. This is also journey 2's
  login half.
- **Session persistence** (`tests/frontend/session.spec.ts`) — journey 2's other half: a hard reload
  doesn't lose the session, proving the httpOnly cookie (not just in-memory Redux state) is what's
  actually keeping the user logged in. Forcing a real token expiry mid-session isn't covered (would need
  the backend to issue a near-expired token on demand).
- **Smoke coverage** (`tests/{frontend,admin}/smoke.spec.ts`) — every top-level authenticated route in
  both apps, visited once each, asserting nothing throws client-side. This is the check this repo's other,
  curl-based smoke tests structurally can't do: curl never executes JavaScript, so a client-side throw is
  invisible to it. This suite's first real run against a live backend caught two genuine bugs neither
  typecheck, lint, nor a curl-based check had ever surfaced (see "Real bugs this suite has already found"
  below).
- **Real dynamic-data navigation** (`tests/admin/users-detail.spec.ts`,
  `tests/{frontend,admin}/detail-navigation.spec.ts`) — clicking a real row/card in a list navigates to
  that record's real detail page: admin's users, events, team and transactions tables; frontend's tribe
  and business lists. Exercises the list → detail flow these apps actually use day to day, not just a
  static route. Deliberately doesn't cover every list — see "What's not covered and why" below for the
  ones this seed data can't exercise yet.

### What's not covered and why

- **Admin's `/reporting`, `/announcements`, `/wallet-management` detail pages, and frontend's `/event`
  detail page** — this seed data has zero rows in each of those tables ("0 Reports", "0 Announcements",
  "0 Wallets", confirmed by screenshot; `/event` has no `a[href^="/event/"]` to click after a 15s wait).
  A test asserting on a click target that doesn't exist isn't testing anything real — add these back once
  the seed data has real rows.
- **Admin's `/tribes`** — confirmed elsewhere in this repo (`docs/ARCHITECTURE.md` Phase 6) to be static
  mock content with no real data-driven navigation. Nothing to click into.

## Real bugs this suite has already found

Fixed in the same pass that added the test that caught them, not left as known-broken:

- **`apps/frontend/src/lib/firebase.ts`** — `getMessaging(app)` throws synchronously when
  `NEXT_PUBLIC_FIREBASE_PROJECT_ID` (or the other required config) is unset. Since this ran at module
  load time with no guard beyond "are we in a browser", and `FcmProvider` wraps the entire root layout,
  an unconfigured Firebase crashed **every single page** in the app — despite `.env.example`'s comment
  claiming "the feature degrades rather than crashing when these are unset". Fixed by guarding on
  `firebaseConfig.projectId` being present and wrapping the init in try/catch; `messaging` is now honestly
  typed as possibly `undefined`, which surfaced three more call sites (`FcmContext.tsx` ×3,
  `requestNotificationPermission.ts` ×1) that assumed it was always defined and needed their own guards.
- **`apps/frontend/src/app/(main)/settings/page.tsx:100`** — `user?.socials.length > 0` only guards
  `user` being null, not `user.socials` itself — a broken optional chain, not a fully-optional one. Threw
  for any user whose `socials` field is null/undefined from the backend, which is the normal case for an
  account that hasn't set up social links (including the e2e test account this suite logs in as). Fixed
  to `user?.socials && user.socials.length > 0`.
- **`/event`'s image `src`, two separate bugs in the same code path** — first found as a non-fatal
  "empty string passed to src" console error on `EventCard.tsx` and 5 other card/list components, all
  passing `event?.event_image` straight to `next/image` with no fallback for a missing image. Fixing that
  (matching the `|| "/images/default-event.jpg"` fallback the `[id]` detail pages already used)
  surfaced a second, worse bug on re-verification: a **real, non-empty** `event_image` value from seed
  data — `https://example.com/events/career-night-kano.jpg`, clearly placeholder — pointed at a host not
  in `next.config.mjs`'s `images.remotePatterns` (only the DO Spaces bucket and Cloudinary are allowed),
  which throws `Invalid src prop` and crashes the **whole page**, not just that image. A plain `||`
  fallback only catches falsy values, not "present but from a disallowed host" — added
  `apps/frontend/src/lib/helper.ts`'s `getSafeImageSrc(url, fallback)`, which validates the hostname
  against the same allowlist and falls back for either failure mode. Applied everywhere `event_image`
  reaches `next/image`: the 6 card/list components plus the 5 `[id]` detail pages that already had the
  weaker `||` guard. 4 unit tests in `apps/frontend/src/lib/helper.test.ts`.

## Running it

```bash
cd tooling/e2e
cp .env.e2e.example .env.e2e.local   # fill in real credentials — never commit this file
pnpm install
pnpm exec playwright install chromium
pnpm test
```

Reuses whatever's already running on `localhost:3000`/`:3001` if those ports respond (see
`playwright.config.ts`'s `webServer` entries) — this repo's own dev servers, pointed at a real backend via
`.env.local`, work fine. Otherwise it starts both itself, deliberately bypassing each app's `dev` package
script in favor of plain `next dev` — admin's `--turbopack` default hits an unrelated "Next.js package not
found" internal error in some environments (confirmed on the machine this suite was built on); e2e doesn't
need Turbopack's faster HMR anyway.

`workers` is 1 (fully serial), and `fullyParallel` is off — both apps' dev servers compile routes on
demand, and any concurrency was measured to cause real, non-deterministic timeouts as the suite grew (a
table or list taking longer than a test's wait to populate under load), not a bug in the app or the test.
This suite is meant to be trustworthy on merge, not fast — a slower, reliable ~2 minutes beats a faster,
flaky one. `retries` is 1 even locally for the same reason: a real dev server and a real backend are both
slower and less deterministic than a mock, and one retry absorbs that without hiding a genuine failure
(all 26 tests have been run clean, back to back, multiple times — a test that fails twice in a row is a
real signal, not noise).

## Wiring into CI

Not done — would need `lemonade-backend` running in the CI environment (a cross-repo checkout/secrets
decision, same one `tooling/generate-api-types/README.md` flags for true live-backend contract-drift
detection) plus `E2E_USER_EMAIL`/`E2E_USER_PASSWORD`/`E2E_ADMIN_EMAIL`/`E2E_ADMIN_PASSWORD` as real CI
secrets pointing at seeded, low-stakes accounts — never real user credentials. Once both exist, this is a
normal new job: install, `playwright install chromium --with-deps`, `pnpm --filter @lemonade/e2e test`.
