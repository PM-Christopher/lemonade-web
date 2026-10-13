# e2e

Playwright end-to-end suite against a real running backend — see `docs/ARCHITECTURE.md` §17 for the
original "ten journeys" list this is meant to grow into. **Not automatically wired into `.github/workflows/ci.yml`**:
unlike this repo's other CI jobs, this one needs a live `lemonade-backend` and real (if low-stakes,
seed/demo) credentials, neither of which the existing CI environment has. Run it manually, or against a
CI environment that's been given both — see "Wiring into CI" below.

## What's actually covered today

All ten journeys have a spec now and run end to end. Payments are completed through a proxy, see "Payments in the suite" below. What's genuinely covered, against the real backend:

- **Signup + email verification + profile setup** (`tests/frontend/signup.spec.ts`) — journey 1, in
  full: sign up → verify email with a real OTP read from a local Mailpit inbox → complete all four
  `/profile-setup` steps → land on `/` with a real session. Found and fixed two real bugs blocking every
  real signup, not just this test — see "Real bugs this suite has already found" below.
- **Ticket purchase** (`tests/frontend/ticket-purchase.spec.ts`) — journey 4: buy a paid ticket → real
  order → real Paystack test-mode transaction → browser sent to a live `checkout.paystack.com` session.
  Nothing is issued yet. The payment is then completed through the proxy and the signed `charge.success`
  webhook is sent to the backend, and the ticket appears in the user's tickets.
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
- **Admin balance adjustment** (`tests/admin/wallet-adjustment.spec.ts`) — journey 7: an admin credits
  then debits the demo user's wallet from the user detail page. Reads the ledger through the BFF and
  asserts a `credit` then a `debit` entry of the same amount, with `balance_after_minor` back at its
  starting value. The debit undoes the credit, so the seed wallet ends where it started.
- **Report and moderate** (`tests/frontend/report-moderation.spec.ts`) — journey 8: the demo
  user joins a free public tribe, posts a thread and reports it through the UI. An admin context
  (`.auth/admin.json`) then finds the new report in the queue, opens it and clicks "Mark as resolved",
  and the API shows `pending` then `completed`. The reporter's notification is checked too.
  Leaves a tribe membership and a thread behind on the seed account.
- **Event create, publish, approve** (`tests/frontend/event-publish.spec.ts`) — journey 3: the user fills
  the create-event form and the ticket form through the UI (the image upload is stubbed, no Cloudinary
  credentials here), publishes, and the event is `pending` with its ticket. An admin approves it in the
  admin app and it moves to the user's upcoming events. The admin deletes it at the end.
- **Paid tribe join** (`tests/frontend/paid-tribe-join.spec.ts`) — journey 5: from the paid tribe's
  page, "Unlock Tribe content" then "Join Tribe now" goes to a live Paystack checkout, and the user can't
  read the threads yet. The payment is completed through the proxy and the browser comes back with
  `?trxref=`, so the app verifies it. The user is then a member and the tribe creator's wallet ledger
  gets a credit. The spec leaves the tribe again afterward.
- **Payout and approval** (`tests/frontend/withdrawal-approval.spec.ts`) — journey 6: an admin credits
  the demo user above the ₦100,000 minimum, the user requests a payout from the wallet page, the admin
  approves it in the admin app, and the status leaves `pending`. Approving sends a real transfer to
  Paystack's test mode, so it ends at `processing` or `failed`. Leaves a bank account on the demo user.
- **Subscription purchase and downgrade** (`tests/frontend/subscription-lifecycle.spec.ts`) — journey 9:
  the user buys the paid plan from the plan page and is sent to checkout, still on the free plan. The
  payment is completed through the proxy and the browser comes back with `?trxref=`, then the user's
  benefits switch to the paid plan's. The user downgrades from the plan page and they switch back.
- **Live Connect messaging** (`tests/frontend/connect-messaging.spec.ts`) — journey 10: two users, the
  second signed in through its own browser context. One sends a chat message and the other sees it with
  no reload, over Reverb. Needs `E2E_USER_TWO_*` (any existing active user with a known password) and a
  running `php artisan reverb:start`. Fails without Reverb, which is how it was checked.
- **Render-loop guard** (`tests/support/render-loop.ts`, used by both `smoke.spec.ts` files) — fails a
  page that logs the same console error or warning 5 or more times. A render loop never throws, so the
  `pageerror` check alone could not see it.

### What's not covered and why

- **Admin's `/reporting`, `/announcements`, `/wallet-management` detail pages, and frontend's `/event`
  detail page** — this seed data has zero rows in each of those tables ("0 Reports", "0 Announcements",
  "0 Wallets", confirmed by screenshot; `/event` has no `a[href^="/event/"]` to click after a 15s wait).
  A test asserting on a click target that doesn't exist isn't testing anything real — add these back once
  the seed data has real rows.
- **Admin's `/tribes`** — confirmed elsewhere in this repo (`docs/ARCHITECTURE.md` Phase 6) to be static
  mock content with no real data-driven navigation. Nothing to click into.

### Bugs the journeys found, now fixed

Each was found by a journey and fixed in the same pass, with a test where it lives.

- **Paid tribe page for a non-member** — was a 403, so "Unlock Tribe content" never rendered. A non-member
  now gets the summary (no threads, no member list), and the tribe page only loads threads for members.
- **Plan page after a reload** — lost the current plan. It now loads it from the subscription query.
- **Plans weren't enforced** — creating a tribe needs a plan with tribe creation, and events are capped
  per month by the plan (0 is unlimited). Drafts don't count, publishing does.
- **Request payout before the profile loads** — the button is disabled until the user has loaded.
- **Sending a chat message before the chat loads** — does nothing until the chat has loaded.
- **Success toast too early** — the paid-tribe join no longer says "Joined" before payment.
- **Report resolve** — the reporter now gets an in-app and push notification, once.
- **Subscription endpoint** — `GET /user/profile/subscription` returned a 500 for everyone.

### Payments in the suite

Paystack's hosted checkout is behind a Cloudflare bot challenge ("Just a moment..."), confirmed by
opening a real checkout URL with Playwright. Getting through that would mean defeating anti-automation
protection on a third party's site, which this suite won't do. A payment can't be charged by reference
through Paystack's API either: an initialized reference is refused as a duplicate, and a charge by access
code isn't supported.

So the backend talks to Paystack through `support/paystack-proxy.mjs`, which Playwright starts on port
9801. It forwards everything to the real Paystack test API, so initializing a payment still returns a live
checkout URL. A test marks a reference as paid (`markPaid` in `tests/support/paystack.ts`), and the
proxy then answers the backend's verify call with "success". The backend runs its real finalizing logic on
that. Flows that finish on a webhook (tickets) also send a signed `charge.success`
(`sendChargeSuccessWebhook`), and flows that finish on return (tribes, plans) go back to the app with
`?trxref=`. The proxy also stands in for Cloudinary's upload API, which the backend uses for ticket QR
codes.

The backend needs these in its `.env`, which `.env.e2e.example` and `.github/workflows/e2e.yml` also
list: `PAYSTACK_PAYMENT_URL=http://127.0.0.1:9801`, `CLOUDINARY_CLOUD_NAME=e2e`,
`CLOUDINARY_API_KEY=e2e`, `CLOUDINARY_API_SECRET=e2e`, `CLOUDINARY_UPLOAD_PREFIX=http://127.0.0.1:9801`
and an `ENCRYPTION_KEY`. It also needs Mailpit (ticket and signup emails) and `php artisan reverb:start`
(payments broadcast events, and chat uses it). Without them the webhook returns a 500.

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
- **`apps/frontend/src/app/(auth)/{login,signup}/page.tsx`** — both called `useGoogleLogin()`
  unconditionally. `@react-oauth/google`'s hook throws synchronously inside its own effect ("Missing
  required parameter client_id") when `GoogleOAuthProvider`'s `clientId` is empty, which it is in this
  local dev environment (`NEXT_PUBLIC_GOOGLE_CLIENT_ID` unset) — crashing the _entire_ login/signup page
  into its error boundary, not just disabling the Google button. First surfaced as
  `ticket-purchase.spec.ts` failing on an unrelated selector after a redirect to `/login`; root-caused by
  capturing `pageerror`/console output directly, same technique as the Firebase bug above. Fixed by
  extracting the hook into its own component, `apps/frontend/src/components/auth/GoogleAuthButton.tsx` —
  both pages now only mount it (so the hook only ever runs) when `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is
  actually set, same shape as the Firebase guard.
- **`apps/frontend/src/components/form-steps/{profile,address,skills,social}-step.tsx`** — all four
  profile-setup steps checked `if (data.status)` before advancing, but this backend's envelope has no
  `status` key (`{success, message, data}`) — the condition was always false, so `next_step()` was
  structurally unreachable no matter what the backend returned. Confirmed live: a real `profile-set-up`
  call returned a real 200 (`{"success":true,...}`) while the UI stayed put and showed "Something went
  wrong." Same envelope-key-drift bug class this list already had two entries for
  (`resolveReport`/`OpenedChat.tsx`/`SettingsModal.tsx`, tracked in `docs/ARCHITECTURE.md`). Fixed all 5
  occurrences (4 steps plus `profile-step.tsx`'s own avatar-upload branch) to check `data.success`.
- **`lemonade-backend`'s `app/Actions/Identity/SetupSocialLinks.php`** — the wizard's actual last step
  500'd for every real user, right behind the bug above. It used `DB::table('app_notification_settings')
  ->insert([...])` instead of the Eloquent model, bypassing `HasUuids` — the table's `id` is a UUID
  primary key with no DB-level default, so the raw insert always failed with `SQLSTATE[HY000]: ... Field
  'id' doesn't have a default value`. Every other row this same method creates already went through its
  model (`UserSubscription::create()`, `Wallet::create()`, etc.); a pre-existing backfill command,
  `GenerateUserNotificationSettings`, already did this table correctly — the fix mirrors it exactly.
  Together with the bug above: no real user has ever been able to complete this signup wizard. Zero test
  coverage existed on any of the four backend profile-setup actions; added
  `tests/Feature/Identity/SetupSocialLinksTest.php`, confirmed it actually catches the regression (500
  without the fix, 200 with it) before committing.

## Running it

`signup.spec.ts` needs a local Mailpit instance (`brew install mailpit`, then just run `mailpit` — SMTP
on `1025`, REST API on `8025`, no config needed) and `lemonade-backend`'s local `.env` pointed at it
(`MAIL_MAILER=smtp`, `MAIL_HOST=127.0.0.1`, `MAIL_PORT=1025`) — independent of whatever the production
mailer is (ADR-007 in that repo), since there's no way to read a real inbox through a real provider from
a test either way. `ticket-purchase.spec.ts` needs `E2E_PAID_EVENT_ID` (below) and a real
`PAYSTACK_SECRET_KEY`/`PAYSTACK_PUBLIC_KEY` (test-mode) in `lemonade-backend`'s `.env` — already the case
if you've followed that repo's own setup.

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

Written, not enabled yet — `.github/workflows/e2e.yml`, triggered by `workflow_dispatch` only (run it
manually from the Actions tab), deliberately not on `pull_request`/`push` like `ci.yml`'s other jobs.

It's a complete job, not a stub: MySQL and Mailpit service containers, a real `lemonade-backend` checkout,
`composer install` + `migrate` + seed (`ReferenceSeeder` then `LocalDemoSeeder`, the same deterministic
fixtures — see `config/seeding.php` and `database/seeders/E2eFixturesSeeder.php` in that repo — a local
`php artisan migrate:fresh --seed` in a `local`/`staging` environment produces), `php artisan serve`, then
the usual `pnpm install` / `playwright install` / `pnpm test` against it. Every credential the suite needs
(`E2E_USER_EMAIL` and the rest) is set as a **plain env var** in the workflow, not a secret — they're
`lemonade-backend`'s own deterministic seed defaults, not anything sensitive; the same values are already
committed in `.env.e2e.example`.

Two real secrets are what's actually missing before this can run automatically:

- **`LEMONADE_BACKEND_TOKEN`** — `lemonade-backend` (`github.com/PM-Christopher/lemonade-backend`) is
  private. A fine-grained PAT scoped to read-only contents access on just that repo is enough.
- **`PAYSTACK_SECRET_KEY`/`PAYSTACK_PUBLIC_KEY`** — real Paystack test-mode keys, for
  `ticket-purchase.spec.ts`'s real transaction-initialize call.

Once both exist as repo secrets: run the workflow manually once to confirm it's green, then flip `on:` in
`e2e.yml` to include `pull_request` (or fold the job into `ci.yml` directly) to make it a real merge gate.
