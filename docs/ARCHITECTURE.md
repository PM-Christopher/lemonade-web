# Lemonade Admin & Frontend — Technical Architecture & Modernization Plan

**Revision:** B · 14 September 2026 (see [§21](#21-phased-implementation-roadmap) for live status)
**Scope:** `lemonade-admin` and `lemonade-frontend` (two Next.js apps) + a proposed shared layer
**Source of truth:** `lemonade-backend` (Laravel 13) — its running behaviour, not this document
**Status:** In progress. Phases 0 and 4 substantially shipped and live-verified; Phase 5 underway
(auth + 3 admin domains done). Every phase heading in §21 below now carries a status tag — that
section is the current "what's left" answer; the rest of this document is still the target-state
plan and hasn't been rewritten to match.

> **Canonical location.** This file was originally duplicated into both Next.js repos; this copy,
> at `lemonade-web/docs/ARCHITECTURE.md`, is the one being kept current as of Revision B. The two
> per-app copies (`lemonade/{admin,frontend}/docs/ARCHITECTURE.md`, outside this monorepo) were not
> touched by this revision and are now stale — treat this file as the only canonical one going
> forward, and delete or archive the other two rather than trying to keep three in sync.
>
> A rendered version of Revision A is published at
> <https://claude.ai/code/artifact/60740609-3946-4c13-a3d2-b2989ac68b41> (predates this revision).

---

## Table of contents

1. [Executive Summary](#1-executive-summary)
2. [Current-State Assessment](#2-current-state-assessment)
3. [Problems & Risks Identified](#3-problems--risks-identified)
4. [Target Architecture](#4-target-architecture)
5. [Admin Application Architecture](#5-admin-application-architecture)
6. [Frontend Application Architecture](#6-frontend-application-architecture)
7. [Shared Package Strategy](#7-shared-package-strategy)
8. [Monorepo vs. Multi-Repository](#8-monorepo-vs-multi-repository)
9. [Project & Folder Structure](#9-project--folder-structure)
10. [Recommended Coding Patterns](#10-recommended-coding-patterns)
11. [Data Fetching & API Architecture](#11-data-fetching--api-architecture)
12. [State, Forms & Validation](#12-state-forms--validation)
13. [Authentication & Authorization](#13-authentication--authorization)
14. [Error Handling & Reliability](#14-error-handling--reliability)
15. [Performance Strategy](#15-performance-strategy)
16. [Security Strategy](#16-security-strategy)
17. [Testing Strategy](#17-testing-strategy)
18. [Code Quality & Developer Experience](#18-code-quality--developer-experience)
19. [CI/CD & Deployment](#19-cicd--deployment)
20. [Version Upgrade & Migration Plan](#20-version-upgrade--migration-plan)
21. [Phased Implementation Roadmap](#21-phased-implementation-roadmap)
22. [Risks, Trade-offs & Alternatives](#22-risks-trade-offs--alternatives)
23. [Definition of Done](#23-definition-of-done)

**Priority legend:** **[MUST]** · **[SHOULD]** · **[NICE]**

---

## 1. Executive Summary

> The backend has already been modernized. The two Next.js apps have not, and they are currently
> pointed at an API surface that no longer exists. The work is to bring the frontends up to the
> standard the backend now sets — starting with making them run again.

The Laravel backend completed a substantial rewrite (ADR-003): ~280 action classes, a double-entry
ledger, escrow, eight domain policies, Sanctum token abilities, a standardized response envelope,
and a `composer test:ci` gate running Pint, PHPStan/Larastan and PHPUnit. It is documented to a high
standard in `claude-lemonade-architecture-guide.md` and `PLATFORM_IMPLEMENTATION_REVIEW.md`.

The two frontends did not move with it. They are copy-paste siblings that have drifted, share no
code, have no tests, no lint configuration, no CI, and — critically — both build their base URL as
`${NEXT_PUBLIC_BASE_URL}/api` while the backend now registers all 288 routes under `/v1` with
`apiPrefix: ''`. **Every request from both apps 404s against the current backend.**

### The seven decisions in this document

| #   | Decision                                                                                | Replaces                                                  | Priority   |
| --- | --------------------------------------------------------------------------------------- | --------------------------------------------------------- | ---------- |
| 1   | Consolidate both apps into one pnpm + Turborepo monorepo; backend stays in its own repo | Three independent repos                                   | **MUST**   |
| 2   | Five narrow shared packages with enforced boundaries, not one `@lemonade/shared`        | 32 diverged copy-paste files                              | **MUST**   |
| 3   | TanStack Query owns server state; Redux keeps only real client state                    | 151 hand-written `createAsyncThunk`s                      | **MUST**   |
| 4   | Move the bearer token into an httpOnly cookie brokered by Next Route Handlers           | Token in localStorage + 87 manual `Authorization` headers | **MUST**   |
| 5   | Generate TypeScript types from the backend contract; stop hand-writing them             | 574 `any` annotations                                     | **MUST**   |
| 6   | React Hook Form + Zod, with schemas mirroring backend `FormRequest` rules               | Formik + Yup across 45 files                              | **SHOULD** |
| 7   | One UI primitive library and one token set; delete MUI, antd, Evergreen                 | Four overlapping component systems                        | **SHOULD** |

### Sequencing, in one line

**Make it work → put gates around it → consolidate → upgrade once → refactor behind the gates.**

Repairing the API contract and standing up CI comes first because every later phase depends on being
able to tell whether a change broke something. Version upgrades land _after_ monorepo consolidation
so they are done once instead of twice, and _before_ the large refactors so the refactors are not
written twice.

**Effort shape.** Phase 0 is days, not weeks, and restores a working system. Phases 1–2 are
mechanical and low-risk. Phases 3–5 are the bulk of the engineering and are structured to run
domain-by-domain so the apps stay shippable throughout.

---

## 2. Current-State Assessment

All figures were measured against the working trees on 10 September 2026 (backend
`ft_architecture_upgrade`, admin `master`, frontend `main`; all three clean).

### Repositories

| Repo                | Stack                   | src LOC | .tsx | Router             | Tests                           | CI           |
| ------------------- | ----------------------- | ------: | ---: | ------------------ | ------------------------------- | ------------ |
| `lemonade-backend`  | Laravel 13 · PHP 8.3    |       — |    — | 288 routes `/v1/*` | PHPUnit 12 + Architecture suite | `DO_DEV.yml` |
| `lemonade-admin`    | Next 15.1.11 · React 18 |  14,667 |  102 | App Router         | None                            | None         |
| `lemonade-frontend` | Next 14.2.7 · React 18  |  35,018 |  177 | App Router         | None                            | None         |

### Measured debt

| Metric                              | Count |
| ----------------------------------- | ----: |
| `: any` annotations                 |   574 |
| `createAsyncThunk`                  |   151 |
| Manual bearer headers               |    87 |
| Hardcoded `[Npx]` classes           | 7,041 |
| `console.log` left in               |    62 |
| Tests / lint configs / CI pipelines |     0 |

### What the backend actually guarantees

This is the contract the frontends must be written against. It is stable and well-defined — the
frontends simply do not currently honour it.

| Concern             | Backend contract                                                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Base path           | `apiPrefix: ''` in `bootstrap/app.php:44` → routes live at `/v1/{admin\|user\|shared}/…`, auto-discovered per directory by `routes/api.php`                   |
| Success envelope    | `{ success: true, message: string, data?: unknown }` — `data` is omitted entirely when null                                                                   |
| Error envelope      | `{ success: false, message: string, error_code: string, errors?: Record<string,string[]> }`                                                                   |
| Error codes         | 18-case `App\Enums\Shared\ErrorCode` — `validation-failed`, `credentials-not-valid`, `account-suspended`, `subscription-required`, `plan-feature-required`, … |
| Validation failures | HTTP 422, `error_code: validation-failed`, `message` = first error, `errors` = full Laravel bag                                                               |
| Auth                | Two Sanctum guards — `auth:user` (User model) and `auth:admin` (Admin model). Separate token namespaces.                                                      |
| Token abilities     | `TokenType` enum gates routes via `ability:` middleware — `access_token`, `refresh_token`, `password_reset`, `password_reset_verification`, `two_factor`, …   |
| Refresh             | `POST /v1/user/auth/refresh` — token in the JSON **body**, no auth header read                                                                                |
| Money               | `App\Support\Money` — minor units throughout; never floats                                                                                                    |
| Pagination          | **Only 10 `paginate()` call sites across ~280 actions.** Most list endpoints return unbounded collections.                                                    |

### How the frontends are built today

Both follow the same shape: `src/app` (App Router) → `src/features/*.slice.ts` (Redux Toolkit
slices, one per domain, each holding both server data and request state) → `src/lib/axiosInstane.ts`
→ backend. Pages are almost entirely client components: **45 of 46 in frontend, 25 of 32 in admin**.
Forms are Formik + Yup. Realtime is Pusher; the user app adds Firebase Cloud Messaging.

The pattern in every page is the same:

```tsx
// admin/src/app/(main)/reporting/page.tsx — representative of ~40 pages
"use client";
const { authToken } = useSelector((s: RootState) => s.auth);
const { reportData } = useSelector((s: RootState) => s.report) as { reportData: any };

// client-side pagination over the whole dataset
const totalPages = Math.ceil(reportData?.reports?.length / perPage);
const paginatedData = reportData?.reports?.slice(startIndex, startIndex + perPage);

useEffect(() => {
  if (authToken) dispatch(getReportData({ token: authToken }));
}, []); // authToken read but not declared — stale on rehydrate
```

### Divergence between the two apps

41 files exist at the same path in both apps. **9 are byte-identical; 32 have drifted.** This is the
clearest single argument for a shared package: the code was already meant to be shared, and was
copied instead.

| File                                                     | Admin                                                     | Frontend                                                                     | State                    |
| -------------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------ |
| `lib/axiosInstane.ts`                                    | No auth interceptor; 401 → wipe cookies + `location.href` | Auth interceptor; refresh-on-403 with request queue; 5-min cache on all GETs | Deeply diverged          |
| `lib/helper.ts`                                          | 33 lines                                                  | 146 lines                                                                    | 117 differing lines      |
| `hooks/useRequest.tsx`                                   | 50 lines                                                  | 60 lines                                                                     | 58 differing lines       |
| `lib/dateTimeFormatter.ts`                               | 66 lines                                                  | 68 lines                                                                     | 81 differing lines       |
| `components/ui/button.tsx`                               | shadcn `new-york`                                         | shadcn `default`                                                             | Different design systems |
| `lib/checkError.ts`, `lib/utils.ts`, `redux/hook.ts`, +6 | Byte-identical duplicates                                 |                                                                              | Pure duplication         |

---

## 3. Problems & Risks Identified

Ordered by severity. Each is a verified finding with a file reference, not a stylistic preference.

### P0 — the apps do not work against the current backend

#### 3.1 Base URL points at a deleted API surface **[MUST]**

- **Evidence** — `admin/src/config/url.ts:3` and `frontend/src/config/url.ts:3` both compute
  ``baseUrl = `${mainUrl}/api` ``. The backend sets `apiPrefix: ''`; a route listing returns 288
  routes under `v1` and **zero** under `api`.
- **Impact** — Every authenticated and unauthenticated request from both apps returns 404.
- **Fix** — Small: `baseUrl` is imported in only 3 files per app. But the prefix is the easy half;
  see 3.2 and 3.3.

#### 3.2 Request payloads drift from the new contract **[MUST]**

- **Evidence** — `API-BREAKING-CHANGES.md` documents changes the frontends never adopted: the
  refresh token moved from the `Authorization` header into the JSON body; `callback_url` was renamed
  to `redirect_url` on tribe-join and job-pay.
- **Impact** — These fail _after_ the prefix is corrected, and two of them fail silently rather than
  loudly — a renamed field is simply absent.
- **Fix** — Work through `API-MIGRATION-AUDIT.md` endpoint by endpoint. This is the single
  highest-value document in the backend repo for this phase.

#### 3.3 The shared request hook tests the wrong envelope key **[MUST]**

- **Evidence** — `frontend/src/hooks/useRequest.tsx:43` guards on `if (response?.data?.status)`. The
  backend envelope (`app/Traits/ApiResponses.php`) emits `success`, never `status`.
- **Impact** — The condition is never true, so `data` is never set — the hook returns `null` forever
  with `error: false`. A silent failure that looks like an empty result.
- **Fix** — Do not patch it. Delete the hook as part of the TanStack Query migration (§11) and
  normalize the envelope in one place.

### P1 — security

#### 3.4 Bearer tokens are reachable from JavaScript **[MUST]**

- **Evidence** — Admin persists the whole `auth` slice — including `authToken` and `adminToken` —
  through redux-persist to `localStorage`. The user app spreads tokens across `js-cookie` (35
  writes), `localStorage` (17 references) and `react-cookie` (30 uses).
- **Impact** — Any XSS, including one arriving through a third-party dependency, exfiltrates a live
  session token. Three storage mechanisms for one token also means logout cannot reliably clear it;
  both apps resort to iterating `document.cookie` and blanking every key.
- **Fix** — httpOnly cookie brokered by Next Route Handlers (§13). This also unlocks Server
  Components and edge middleware.

#### 3.5 Admin has no route protection at all **[MUST]**

- **Evidence** — No `middleware.ts` anywhere in `lemonade-admin`. The user app has one, but it only
  checks that a `token` cookie is _present_, never that it is valid.
- **Impact** — Admin route protection is entirely incidental — it depends on an API call failing and
  an axios interceptor redirecting. Every admin page shells out, renders, and only then bounces.
  Server-rendered admin content is not gated.
- **Fix** — Middleware in both apps as a UX guard; the backend policies remain the real authority.

#### 3.6 `firebase-admin` is a runtime dependency of a browser app **[MUST]**

- **Evidence** — `frontend/package.json` lists `firebase-admin@^13.5.0` in `dependencies`. It is a
  privileged server-only SDK. No `src/` file imports it (FCM is used via the scoped `@firebase/app`
  and `@firebase/messaging` packages in `src/lib/firebase.ts`).
- **Impact** — Unused today, but one careless import away from bundling service-account handling
  into client code. It should not be in the dependency graph of an app that ships to browsers.
- **Fix** — Remove. If server-side FCM is ever needed, it belongs in a Route Handler with an
  explicit `server-only` import guard.

### P1 — correctness and reliability

#### 3.7 A global 5-minute cache sits on every GET in the user app **[MUST]**

- **Evidence** — `frontend/src/lib/axiosInstane.ts` wraps the client in
  `setupCache(..., { ttl: 300000, methods: ["get"], interpretHeader: false })` — applied
  indiscriminately, with server cache headers explicitly ignored.
- **Impact** — Wallet balances, ticket availability, escrow state and chat history can all be served
  up to five minutes stale, with no invalidation after a mutation. On a platform that moves money
  this is a correctness bug, not a performance tuning choice.
- **Fix** — Delete it. Per-query staleness policy under TanStack Query (§11), with money and
  availability queries set to `staleTime: 0`.

#### 3.8 Refresh is triggered on 403, and only in one of the two apps **[MUST]**

- **Evidence** — The user app refreshes on **403**; the backend returns **401** for an expired or
  absent token and reserves 403 for policy denial. Admin has no refresh path at all — it wipes
  cookies and hard-redirects on 401.
- **Impact** — Sessions expire abruptly in admin. In the user app, a legitimate authorization denial
  can trigger a pointless refresh-and-retry loop, and a genuinely expired token is not refreshed at
  all. The refresh call also targets `${baseUrl}/auth/refresh`, which is not a route that exists.
- **Fix** — One shared transport with a single, correct refresh policy keyed on 401 (§13).

#### 3.9 Lists are paginated in the browser after downloading everything **[MUST]**

- **Evidence** — 7 call sites slice a full array with `startIndex`/`perPage`; 14 files compute
  `Math.ceil(length / perPage)`. This mirrors the backend: only 10 `paginate()` calls exist across
  ~280 actions.
- **Impact** — Payload size, memory and render cost all grow linearly with platform data. Admin's
  users, transactions and reporting tables are the first to break.
- **Fix** — **Requires backend coordination.** This is a joint change, not a frontend fix — see §22,
  Conflict 1.

#### 3.10 Effect dependency arrays are systematically wrong **[SHOULD]**

- **Evidence** — 32 effects in admin's `app/` alone close over state while declaring `[]`. The
  canonical case reads `authToken` from a redux-persist-rehydrated slice inside an effect that never
  re-runs.
- **Impact** — Data fails to load on hard refresh when rehydration lands after first paint — an
  intermittent, hard-to-reproduce empty-page bug.
- **Fix** — Largely dissolves under TanStack Query, which keys fetches rather than sequencing them
  by hand. `eslint-plugin-react-hooks` with `exhaustive-deps` as an error prevents recurrence.

### P2 — maintainability and developer experience

| Finding                                                      | Evidence                                                                                                                                                                                                                                              | Priority   |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `strict: true` is defeated by 574 `any` annotations          | 190 admin, 384 frontend; plus `as { reportData: any }` casts on selectors                                                                                                                                                                             | **MUST**   |
| No ESLint config in either app, despite a `next lint` script | No `.eslintrc*` / `eslint.config.*` in either repo                                                                                                                                                                                                    | **MUST**   |
| No Prettier, no formatting convention                        | Tabs and spaces, 2- and 4-space indents, mixed quote styles within single files                                                                                                                                                                       | **SHOULD** |
| Zero test files in either app                                | Backend has PHPUnit + an Architecture suite; frontends have nothing                                                                                                                                                                                   | **MUST**   |
| No CI for either app                                         | Backend has `.github/workflows/DO_DEV.yml`; neither Next app has `.github/`                                                                                                                                                                           | **MUST**   |
| SVGR configured for webpack, but admin dev runs Turbopack    | `dev: "next dev --turbopack"` with an SVGR loader in `webpack(config)`, which Turbopack does not read. 116 SVGs are imported as components (`import FlameIcon from "@/icons/flameIcon.svg"`), typed `any` via `svg.d.ts`.                             | **MUST**   |
| Four overlapping component systems                           | MUI, antd, Evergreen and Radix/shadcn all installed; MUI is imported in **1** admin file and **0** frontend files, antd in 1–2, Evergreen in 3–4                                                                                                      | **SHOULD** |
| Dead dependencies                                            | 31 of 58 admin and 19 of 66 frontend runtime deps have no direct import. Confirmed dead: `react-quill`, `draft-js`, `react-draft-wysiwyg` (zero references anywhere), `zod` and `zustand` in admin, two date pickers, two scroll-into-view libraries. | **SHOULD** |
| 7,041 hardcoded pixel classes                                | `w-[285px]`, `text-[12px]`, `rounded-[12px]` — no scale, no tokens, no responsive story                                                                                                                                                               | **NICE**   |
| Decorative controls                                          | Reporting page ships a search input with no handler and two filter dropdowns that are static `<div>`s                                                                                                                                                 | **SHOULD** |
| 62 `console.log` calls in shipped code                       | Includes `console.log(status, "status error")` in the admin interceptor                                                                                                                                                                               | **SHOULD** |
| Deprecated Next image config                                 | Both apps use `images.domains`, superseded by `images.remotePatterns`                                                                                                                                                                                 | **SHOULD** |

> **Fixed (2026-09-21).** `app/Exceptions/Handler.php`'s `isApiRoute()` checked for an `'api/'` path
> prefix, with a comment asserting routes are served under `api/`. Since `apiPrefix` is `''`, that
> predicate was false for all 288 real routes; JSON rendering survived anyway because
> `shouldReturnJson()` also checks `expectsJson()`, which `ForceJsonResponse` satisfies
> unconditionally. Fixed to check what `routes/api.php` actually registers (`v1/*` plus the bare
> `health`/`ready` routes) instead. A reflection-based unit test
> (`tests/Unit/Support/HandlerIsApiRouteTest.php`) locks this in, since no real HTTP request can
> exercise it independently of `ForceJsonResponse` always winning first.

---

## 4. Target Architecture

> Four layers, one direction of dependency. Nothing below a layer may import from above it, and
> neither app may import from the other.

```
┌─────────────────────────────────────────────────────────────────────┐
│  ROUTE LAYER  app/**                        Server Components first
│  Segment layouts · loading.tsx · error.tsx · Route Handlers (BFF)
│  Owns: URL shape, auth gating, data orchestration, streaming
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
┌──────────────────────────────────▼──────────────────────────────────┐
│  FEATURE LAYER  features/{domain}/            App-local, not shared
│  queries.ts · mutations.ts · schema.ts · components/ · types.ts
│  Owns: one bounded context's UI + server-state policy
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
┌──────────────────────────────────▼──────────────────────────────────┐
│  SHARED LAYER  packages/*                    Two real consumers only
│  api-client · api-types · domain · ui · config
│  Owns: transport, contract types, money/date rules, primitives
└──────────────────────────────────┬──────────────────────────────────┘
                                   │  HTTP · /v1 · Bearer (server-side)
┌──────────────────────────────────▼──────────────────────────────────┐
│  BACKEND  lemonade-backend                  Separate repo · authority
│  Controllers → Actions → Services → Eloquent · Policies · Ledger
│  Owns: all business rules, money, authorization, persistence
└─────────────────────────────────────────────────────────────────────┘
```

### The governing principle

**The backend owns business logic. The frontends own presentation and interaction.** Every rule that
decides what is true — whether a tribe join is paid, what a creator earns, whether an escrow can
release, whether a plan grants a feature — lives in a Laravel action and is enforced by a policy. The
frontends may _mirror_ a rule for responsiveness (disable a button, show a validation hint) but may
never be the only place it exists.

This matters concretely: `app/Support/Money.php` works in minor units and the backend has a
double-entry ledger. The frontends must format and display money, never compute it. No client-side
fee arithmetic, no client-side balance derivation, no client-side proration.

### Responsibility boundaries

| Concern                                      | Backend                         | Shared pkg                                  | App                         |
| -------------------------------------------- | ------------------------------- | ------------------------------------------- | --------------------------- |
| Business rules, money arithmetic, ledger     | **Owns**                        | —                                           | —                           |
| Authorization decisions                      | **Owns** (8 Policies)           | Predicate helpers reading server-sent flags | Renders / hides accordingly |
| Validation                                   | **Authority** (FormRequest)     | Zod schemas mirroring it                    | Binds schema to form        |
| Contract types                               | **Source** (routes + Resources) | **Generated**, published                    | Consumes only               |
| HTTP transport, refresh, error normalization | —                               | **Owns**                                    | Consumes only               |
| Query keys, staleness, invalidation          | —                               | Factory helpers                             | **Owns** per feature        |
| Routing, layout, copy, navigation            | —                               | —                                           | **Owns**                    |
| UI primitives & design tokens                | —                               | **Owns**                                    | Composes                    |
| Feature components (EventCard, TribeHeader)  | —                               | —                                           | **Owns**                    |

### Common architecture, different postures

|                  | Admin                                               | Frontend (user app)                                                          |
| ---------------- | --------------------------------------------------- | ---------------------------------------------------------------------------- |
| Audience         | Small, authenticated, trained, desktop              | Public + authenticated, mobile-first, at scale                               |
| Guard            | `auth:admin`                                        | `auth:user`                                                                  |
| Dominant surface | Dense tables, detail panes, bulk actions            | Feeds, media, forms, checkout, chat                                          |
| Rendering bias   | Client-heavy is acceptable; interactivity dominates | Server Components wherever the page is readable — SEO and first paint matter |
| Caching bias     | Short `staleTime`; operators need current state     | Longer for discovery content, zero for wallet/tickets/escrow                 |
| Bundle budget    | Relaxed                                             | Strict — mobile network is the constraint                                    |
| Realtime         | Pusher for moderation queues                        | Pusher for chat + FCM for push                                               |

---

## 5. Admin Application Architecture

`lemonade-admin` is an internal operations console over money, moderation and platform configuration.
Its architecture should optimize for correctness under operator pressure and for auditability, not
for bundle size.

### Route groups

Keep the existing `(auth)` / `(main)` split — it is correct. Add a third group for money, because
those routes carry stricter requirements (confirmation steps, idempotency, audit visibility) and
grouping them makes that enforceable in one layout.

```
app/
  (auth)/              login · forgot-password · reset-password · check-otp
  (console)/           dashboard · users · tribes · events · reporting
                       moderation · announcements · team · page-content
  (money)/             transactions · wallet-management · payouts
                       subscriptions · affiliates
                       └ layout.tsx enforces confirm-step + audit banner
  api/                 BFF Route Handlers (auth broker, exports, webhooks)
```

### Server vs client split

Today 25 of 32 admin route files are client components. Target: **page shells and data orchestration
on the server, interactivity in leaves.** A typical list page becomes a Server Component that reads
`searchParams` for filters, prefetches on the server, and hands a dehydrated cache to a small client
island holding the table.

> **Rule.** `"use client"` goes on the smallest component that needs it — a filter bar, a row-action
> menu, a modal — never on a page or layout. If a page needs `"use client"`, that is a signal the
> data orchestration has not been lifted out of it.

### Tables are the admin's core primitive

Admin is fundamentally a table application, and today every table is hand-rolled with a 931-line
`src/data/tableData.ts` of column definitions and manual slicing. Standardize on one headless table
primitive (TanStack Table) exposed through `@lemonade/ui`, with:

- **Server-driven state.** Page, per-page, sort and filters live in the URL as `searchParams`, not
  `useState`. Shareable, back-button-correct, and directly usable by a Server Component.
- **Column definitions colocated with the feature**, not centralized. `features/users/columns.tsx` —
  deleting the feature deletes its columns.
- **Typed rows** from `@lemonade/api-types`. No `any` rows.
- **One empty, loading, error and permission-denied state**, supplied by the primitive so every
  table behaves the same.

### Money surfaces get extra ceremony

Balance adjustments, withdrawal approvals, refunds and payout releases are irreversible and audited
by the backend ledger. The `(money)` layout should require, as a matter of architecture rather than
per-page discipline:

- A typed confirmation step naming the exact amount, currency and counterparty — rendered from the
  server's own figures, never from a locally computed value.
- An idempotency key generated per intent and sent with the mutation, so a double-submit or retry
  cannot double-post to the ledger.
- Optimistic updates **disabled**. Money mutations invalidate and refetch; they never guess.
- The resulting transaction reference surfaced in the success state so an operator can trace it in
  the ledger.

### Admin-specific authorization

The `admins` table carries a single `role` column defaulting to `'admin'`, and there is no
roles/permissions enum in the backend. The admin app must therefore **not invent a permission
model**. Render from what the server sends; where a finer-grained team-member permission model is
genuinely needed, it is a backend change first. See §22, Conflict 2.

---

## 6. Frontend Application Architecture

`lemonade-frontend` is the public, mobile-first creator platform: tribes, threads, events and
ticketing, business listings and jobs, Connect messaging, wallet, subscriptions. It is the larger app
(35k LOC, 177 components) and the one where rendering strategy actually affects the business.

### Public vs authenticated surfaces

The single most valuable structural change is separating what can be server-rendered and cached
publicly from what is per-user. Today 45 of 46 route files are client components, so a public event
page is an empty shell until JavaScript boots — bad for first paint on mobile and invisible to
crawlers.

```
app/
  (public)/            Server Components · cacheable · indexable
    event/[id]/          event detail, ticket types, venue
    tribe/[id]/          tribe landing, public threads
    business/[id]/       listing detail
    discover/            search & category browse

  (auth)/              login · signup · verify · profile-setup

  (app)/               Authenticated · per-user · mostly client
    dashboard/ · settings/ · wallet/ · connect/
    event/create · event/[id]/edit · event/[id]/add-ticket
    business/add · business/[id]/edit
    tribe/[id]/threads

  api/                 BFF Route Handlers (auth broker, FCM token, uploads)
```

A public event page becomes: Server Component fetches the event → renders content, metadata and Open
Graph tags → a small client island handles ticket selection and purchase. The page is meaningful
before hydration.

### The big client files are the migration targets

Four files carry a disproportionate share of the complexity and should be treated as named work items
rather than absorbed into a general refactor:

| File                                     | Lines | Problem                                                                     | Target                                                                                       |
| ---------------------------------------- | ----: | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `components/Skeletons.tsx`               | 1,394 | Every loading state in the app in one file; guarantees merge conflicts      | Colocate each skeleton with its feature; use route-level `loading.tsx` for page-level states |
| `features/events/event.slice.ts`         |   937 | Server cache, request state and UI state in one reducer                     | Split into `queries.ts` / `mutations.ts`; slice disappears                                   |
| `app/(main)/event/create-event/page.tsx` |   893 | Multi-step form, validation, uploads and submission in one client component | Step components + one Zod schema per step + a typed wizard hook                              |
| `features/tribes/tribe.slice.ts`         |   752 | Same as events                                                              | Same as events                                                                               |

### Multi-step forms deserve a named pattern

Event creation, ticket setup, business listing and profile setup are all multi-step wizards, each
currently reimplemented. One shared pattern in `@lemonade/ui`: a wizard hook holding step index and
accumulated values, one Zod schema per step composed into a final submit schema, per-step validation
on advance, and draft persistence keyed by wizard id. Steps become presentational components that
receive typed values and an `onNext`.

### Realtime and push

Pusher (Connect chat, notifications) and Firebase Cloud Messaging both currently initialize inside
components. Move both behind explicit providers mounted once in the authenticated layout, with the
Pusher auth endpoint proxied through a Route Handler so the private-channel auth call carries the
httpOnly cookie rather than a JS-readable token. The backend already defines private channels in
`routes/channels.php`.

> **Cleanup.** The `firebase` umbrella package can be dropped — `src/lib/firebase.ts` imports the
> scoped `@firebase/app` and `@firebase/messaging` packages directly. `firebase-admin` must be
> dropped outright (§3.6).

---

## 7. Shared Package Strategy

> **Yes — introduce shared packages.** The evidence is already on disk: 41 files exist at the same
> path in both apps, 9 byte-identical and 32 drifted. The code was always meant to be shared; it was
> copied instead, and then diverged.

But "a shared repo" is the wrong unit. A single `@lemonade/shared` becomes the everything-package the
brief warns about: everything imports it, every change rebuilds both apps, and nobody can tell what
is safe to touch. Instead, **five packages with distinct rules for what may enter.**

### `@lemonade/api-types` **[MUST]**

- **Contains** — The response envelope (`ApiSuccess<T>`, `ApiError`), the `ErrorCode` union mirroring
  the backend's 18-case enum, `TokenType`, paginated-list types, and one type per API Resource.
- **Rule** — **Generated, never hand-written.** Derived from the backend's Postman collection
  (`postman/generate-collection.mjs` already exists) or an OpenAPI export. Hand-edits are rejected in
  review.
- **Why** — 574 `any`s exist because types were never worth hand-maintaining against a moving
  backend. Generation makes contract drift a build failure instead of a runtime surprise.
- **Not this** — Form types, view models, component props. Those are app-local.

### `@lemonade/api-client` **[MUST]**

- **Contains** — One transport: base URL resolution, envelope unwrapping, error normalization into a
  typed `ApiError`, auth attachment, refresh-once-then-fail with request coalescing, timeouts,
  correlation-id propagation (the backend sets a `CorrelationId` middleware — carry it), and typed
  `get/post/patch/delete`.
- **Rule** — Transport only. **No endpoint functions, no React, no hooks.** The moment it knows what
  a tribe is, the boundary has been crossed.
- **Why** — The two axios instances have diverged into genuinely different — and separately wrong —
  auth behaviour. This is the single highest-value thing to share.
- **Trade-off** — A bug here breaks both apps at once. Mitigated by it being the most heavily
  unit-tested package in the repo.

### `@lemonade/domain` **[SHOULD]**

- **Contains** — Pure functions with no I/O: money formatting from minor units (matching
  `App\Support\Money`), currency display, date/timezone formatting, status vocabularies and their
  display mappings, `error_code` → user-facing copy, permission predicates that read server-sent
  flags.
- **Rule** — Pure, synchronous, no React, no network, 100% unit-tested. **Mirrors backend rules;
  never originates them.**
- **Why** — `dateTimeFormatter.ts` and `formatNumber.ts` have already drifted between apps — meaning
  the same timestamp or amount can render differently to a user and to the operator reviewing it.

### `@lemonade/ui` **[SHOULD]**

- **Contains** — Design tokens (one Tailwind preset), and primitives only: Button, Input, Field,
  Select, Dialog, Table, Pagination, Toast, Skeleton, EmptyState, FormField.
- **Rule** — **Primitives, not features.** If it knows about an event, tribe, wallet or user, it
  belongs to an app. No component in this package may import from `@lemonade/api-client`.
- **Why** — The two apps are on different shadcn styles (`new-york` vs `default`) with independently
  modified copies of the same components. One token set also gives the 7,041 hardcoded pixel values
  somewhere to go.
- **Trade-off** — Admin (dense, desktop) and the user app (spacious, mobile) have real visual
  differences. Handle via token values and variants, not forks. If a primitive needs an `isAdmin`
  prop, the abstraction is wrong.

### `@lemonade/config` **[MUST]**

- **Contains** — Shared ESLint flat config, base `tsconfig`, Tailwind preset, Prettier config, Vitest
  base config.
- **Rule** — Configuration only. Zero runtime code.
- **Why** — Neither app has any lint config today. Standing one up once and extending it twice is the
  cheapest quality win available.

### What must _not_ be shared

This list is as important as the one above, and should be enforced in review.

| Not shared                                | Why                                                                                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Endpoint hooks (`useEvents`, `useWallet`) | Admin and user surfaces hit different routes with different shapes and different caching needs, even for the same domain             |
| Feature components                        | An admin EventRow and a user EventCard share a type, not markup. Forcing one component creates a prop-matrix nobody can reason about |
| Redux slices / client state               | Client state is app-local by definition                                                                                              |
| Route definitions, navigation, copy       | Different information architecture, different voice                                                                                  |
| Full-page layouts                         | Different shells; sharing them couples navigation changes across apps                                                                |
| Anything with one consumer "for now"      | The two-consumer rule below                                                                                                          |

### Four rules that keep the boundary honest

1. **Two real consumers, today.** Not "both apps will need this." If only one app uses it, it lives
   in that app until the second one genuinely needs it. Promotion is cheap; demotion never happens.
2. **No app-shaped branching inside a package.** A parameter named `isAdmin`, `app`, or
   `variant: "admin" | "user"` is a boundary violation, not a feature.
3. **Dependencies point one way.** `config → domain/api-types → api-client/ui → apps`. No package
   imports an app; no app imports another app. Enforced by `eslint-plugin-boundaries` in CI, not by
   convention.
4. **Each package owns its tests.** A package that cannot be tested without mounting an app is not a
   package.

---

## 8. Monorepo vs. Multi-Repository

### Recommendation **[MUST]**

**One monorepo for the two Next apps and the shared packages; the Laravel backend stays in its own
repository.**

- **Problem** — Three independent repos with no shared code have already produced 32 diverged files,
  two incompatible auth implementations and two different design systems. Shared packages across
  separate repos would require publishing to a registry and version-bumping two consumers for every
  change — enough friction that in practice people would copy code again.
- **Decision** — `lemonade-web`: pnpm workspaces + Turborepo, containing `apps/admin`,
  `apps/frontend` and `packages/*`. `lemonade-backend` remains separate.
- **Why** — A change to the API contract touches the generated types and both consumers in a single
  atomic commit and a single CI run. Turborepo's affected-graph means a change to `apps/admin` does
  not rebuild or retest `apps/frontend`, so CI stays fast as the repo grows. Both apps are already
  the same framework, language and toolchain — the marginal cost of the merge is low, and it is the
  only structure in which the shared-package plan survives contact with deadlines.
- **Trade-off** — A shared-package change can break both apps at once, and CI configuration is more
  involved than two `next build`s. Mitigated by the affected-graph, package-level tests, and the
  boundary lint rules in §7.

### Why the backend does not join

This is a deliberate exception, and worth stating plainly because "monorepo" often means
"everything."

- **Different toolchain entirely.** Composer, PHPUnit, Pint, PHPStan. Turborepo orchestrates a
  JavaScript dependency graph; it has nothing to offer a Laravel app.
- **Different deployment cadence and target.** The backend deploys via
  `.github/workflows/DO_DEV.yml` to DigitalOcean with migrations, queue workers and a scheduler. The
  Next apps deploy as static-plus-server bundles. Coupling their release trains helps nobody.
- **The backend is already healthy.** It has tests, static analysis, a CI gate and current
  documentation. Merging it into a repo undergoing heavy refactor imports risk for no gain.
- **The contract crosses the boundary as an artifact, not a file import.** The backend publishes a
  contract (Postman collection today, ideally OpenAPI); the web repo generates `@lemonade/api-types`
  from it. That is a clean seam that a shared filesystem would blur.

### Alternatives considered

| Option                                                          | Assessment                                                                                                                                                                                      |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keep three repos, publish shared packages to a private registry | **Rejected.** Publish-and-bump friction on every shared change. With a small team this reliably degrades back into copy-paste — which is exactly how the current 32 diverged files came about.  |
| Keep three repos, use git submodules for shared code            | **Rejected.** Submodules are a well-known source of "works on my machine"; contributors routinely commit stale pointers. Worse ergonomics than a registry with none of the versioning benefits. |
| Merge admin into the user app as a route group                  | **Rejected.** Different auth guards (`auth:admin` vs `auth:user`), different audiences, different deploy and access requirements. It would ship admin code to public browsers.                  |
| One monorepo including the backend                              | **Rejected** for the reasons above. Revisit only if the team adopts a unified deploy pipeline.                                                                                                  |

### Migration mechanics

Preserve history — this is a one-time cost that pays back on every future `git blame`:

1. Create `lemonade-web` with the pnpm workspace and Turborepo scaffolding.
2. `git subtree add --prefix=apps/admin` from `lemonade-admin`, and the same for `apps/frontend`.
   History for both is retained.
3. Extract the 9 byte-identical files into packages first — zero-risk moves that validate the wiring.
4. Archive the old repos read-only once CI is green on the monorepo. Do not leave them writable; a
   dual-write period is how divergence restarts.

---

## 9. Project & Folder Structure

```
lemonade-web/
├─ apps/
│  ├─ admin/
│  │  ├─ src/app/                  routes only — thin
│  │  │  ├─ (auth)/ (console)/ (money)/
│  │  │  └─ api/                   BFF Route Handlers
│  │  │     ├─ auth/[...action]/route.ts
│  │  │     └─ export/[resource]/route.ts
│  │  ├─ src/features/<domain>/    the unit of ownership
│  │  │  ├─ queries.ts             useQuery hooks + key factory
│  │  │  ├─ mutations.ts           useMutation + invalidation
│  │  │  ├─ schema.ts              Zod, mirrors backend FormRequest
│  │  │  ├─ columns.tsx            table columns (admin only)
│  │  │  ├─ components/            feature-local UI
│  │  │  └─ index.ts               public surface of the feature
│  │  ├─ src/components/           app-wide, cross-feature only
│  │  ├─ src/lib/                  app-local glue
│  │  └─ middleware.ts             auth gate — currently missing
│  └─ frontend/                    same shape; (public) (auth) (app)
│
├─ packages/
│  ├─ api-types/     generated · envelope, ErrorCode, resources
│  ├─ api-client/    transport, refresh, error normalization
│  ├─ domain/        money · dates · statuses · error copy · predicates
│  ├─ realtime/      Reverb/pusher-js connection-options builder (ADR-005, lemonade-backend)
│  ├─ ui/            tokens + primitives (no domain knowledge)
│  └─ config/        eslint · tsconfig · tailwind · prettier · vitest
│
├─ tooling/
│  └─ generate-api-types/          reads backend contract → api-types
│
├─ turbo.json · pnpm-workspace.yaml · .github/workflows/
└─ docs/
   ├─ ARCHITECTURE.md              this document, checked in
   ├─ CONTRACT.md                  backend contract + regeneration
   └─ adr/                         0001-monorepo.md, 0002-query.md, …
```

### Why feature-folders, and what "feature" means here

A feature maps to a backend bounded context — the same names the backend already uses under
`app/Actions/{Domain}/`: Event, Tribe, Forum, Business, Connect, Payment, Subscription, Wallet,
Identity, Affiliate, Discovery, Moderation. Using the backend's vocabulary means a developer tracing a
bug moves between the two codebases without translating names.

The test for a correct feature folder: **deleting the directory removes the feature and breaks
nothing else.** That fails today — deleting `features/events` in the user app would break
`components/Skeletons.tsx`, `data/tableData.ts`, the store's `combineReducers`, and several unrelated
pages.

### Import rules

| From                  | May import                                           | May not                                                                        |
| --------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------ |
| `app/**`              | features, components, ui, domain, api-types          | another feature's internals; api-client directly                               |
| `features/x/**`       | ui, domain, api-client, api-types, its own internals | `features/y/**` internals — go through `features/y`'s index, or lift to shared |
| `packages/ui`         | domain, api-types                                    | api-client, any app, any feature                                               |
| `packages/api-client` | api-types                                            | React, ui, domain, any app                                                     |
| `packages/domain`     | api-types                                            | everything else — it is pure                                                   |
| `packages/realtime`   | (nothing)                                            | env reading, vendor client construction, any app — it is pure                  |

Enforced with `eslint-plugin-boundaries` and failing CI. A rule that is only written down is a rule
that erodes.

---

## 10. Recommended Coding Patterns

> Conventions are only worth writing down if they are enforceable and if they replace something
> specific. Each pattern below names the current practice it retires.

### Keep · Refactor · Remove

| Existing practice                                     | Verdict    | Reasoning                                                                                                                                       |
| ----------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Feature-folder organization under `src/features/`     | **Keep**   | Already aligns with the backend's `app/Actions/{Domain}/` layout. Extend it; don't replace it.                                                  |
| App Router with `(group)` route groups                | **Keep**   | Correct choice; needs more groups and far fewer client components.                                                                              |
| `@/*` path aliases                                    | **Keep**   | Consistent across both apps; extend with workspace package names.                                                                               |
| Radix / shadcn primitives                             | **Keep**   | The most-used system in both apps. Consolidate on one style and lift to `@lemonade/ui`.                                                         |
| Middleware auth gate (user app)                       | **Keep**   | Right idea. Port to admin; upgrade from cookie-presence to token validity.                                                                      |
| Redux Toolkit slices as server cache                  | Refactor   | 151 thunks reimplement caching, deduplication and invalidation by hand. TanStack Query does it correctly. Redux stays for genuine client state. |
| Formik + Yup                                          | Refactor   | Formik is in maintenance; RHF re-renders less and Zod gives inferred types plus a schema that mirrors backend `FormRequest` rules.              |
| Per-call manual `Authorization` headers               | **Remove** | 87 occurrences. The transport attaches auth; call sites never see a token.                                                                      |
| Token threaded through component props and thunk args | **Remove** | Disappears entirely once the token is httpOnly and server-attached.                                                                             |
| `hooks/useRequest.tsx`                                | **Remove** | Diverged in both apps and checks the wrong envelope key (§3.3). Superseded by TanStack Query.                                                   |
| `src/data/tableData.ts` (931 lines)                   | **Remove** | Central column registry; colocate columns with features.                                                                                        |
| `components/Skeletons.tsx` (1,394 lines)              | **Remove** | Colocate skeletons; use route-level `loading.tsx`.                                                                                              |
| Global axios GET cache                                | **Remove** | Serves stale money data (§3.7).                                                                                                                 |
| MUI, antd, Evergreen                                  | **Remove** | 1–4 files each. Three component systems' worth of bundle for a handful of components.                                                           |
| `react-quill`, `draft-js`, `react-draft-wysiwyg`      | **Remove** | Zero references in either codebase. Also the main React 19 blockers.                                                                            |

### Pattern 1 — the feature module is the unit of ownership

One domain, one folder, one public surface via `index.ts`. Everything the feature needs lives inside;
everything other code may use is exported explicitly. Cross-feature reads go through the index, never
into internals.

### Pattern 2 — server state and client state are different things

> **Rule.** If the server is the source of truth, it belongs in TanStack Query. If it only exists in
> this browser tab — a modal being open, a wizard's current step, a sidebar's collapsed state, an
> unsent draft — it belongs in local state, or Redux when genuinely global. There is no third
> category, and server data is never copied into Redux "so components can read it."

### Pattern 3 — the API contract is generated, never described by hand

No hand-written response interfaces. No `as any` on a response. No `as { reportData: any }` on a
selector. Types come from `@lemonade/api-types`, which is generated from the backend contract. When
the backend changes and a build fails, that is the system working.

### Pattern 4 — components receive data, they do not fetch it

Presentational components take typed props and render. Fetching lives in a Server Component, a
feature query hook, or a container. This makes components testable without a network and, in the user
app, makes the server/client boundary a natural cut rather than a refactor.

### Pattern 5 — errors are values with a type, not strings

Every failure surfaces as `ApiError { status, errorCode, message, fieldErrors }`, normalized once in
`@lemonade/api-client`. Components branch on `errorCode` — a member of the backend's own 18-case enum
— never on message text.

### Pattern 6 — URL state for anything shareable

Pagination, sorting, filters, tabs and search all live in `searchParams`. Today they are `useState`,
which means an operator cannot send a colleague a link to a filtered view, the back button does not
work, and a Server Component cannot read the current view. Local state only for things that genuinely
should not survive a refresh.

### Pattern 7 — money is displayed, never computed

The backend works in minor units and posts to a double-entry ledger. Frontends format via
`@lemonade/domain` and display server-computed figures. No client-side fee, total, proration or
balance arithmetic — a rounding disagreement between client and ledger is a support incident.

### Naming and file conventions

| Thing                                  | Convention                                  | Example                                  |
| -------------------------------------- | ------------------------------------------- | ---------------------------------------- |
| Components                             | PascalCase, one per file, named export      | `TicketSummary.tsx`                      |
| Hooks                                  | `use` + camelCase                           | `useEventQuery.ts`                       |
| Query hooks                            | `use<Entity>Query` / `use<Entity>ListQuery` | `useWalletQuery`                         |
| Mutation hooks                         | `use<Verb><Entity>Mutation`                 | `useApprovePayoutMutation`               |
| Zod schemas                            | `<action>Schema` + inferred type            | `createEventSchema` → `CreateEventInput` |
| Query keys                             | Factory per feature, never inline arrays    | `eventKeys.detail(id)`                   |
| Route Handlers                         | `app/api/<domain>/<action>/route.ts`        | `app/api/auth/login/route.ts`            |
| Booleans                               | `is` / `has` / `can` prefix                 | `canApprovePayout`                       |
| Files that must never reach the client | Import `server-only` at the top             | `lib/session.ts`                         |

> **Also.** Fix `lib/axiosInstane.ts` → `lib/api.ts` during the transport migration. A typo
> replicated across two repos is a small thing, but it is the kind of small thing that tells a new
> developer how much care the codebase expects.

---

## 11. Data Fetching & API Architecture

### Decision: TanStack Query owns all server state **[MUST]**

- **Problem** — 151 `createAsyncThunk`s hand-implement loading flags, error flags, caching,
  deduplication and invalidation. Each is 15–20 lines of identical boilerplate; each is an
  opportunity to get one of those wrong, and several have. Server data is then persisted through
  redux-persist, so stale API responses survive across sessions.
- **Decision** — TanStack Query v5 as the single server-state layer in both apps. Redux keeps only
  genuine client state — and in admin, may be removed entirely once the slices are gone.
- **Why** — It solves deduplication, background refetch, per-query staleness, retry policy, mutation
  invalidation, optimistic updates with rollback, and SSR hydration — all things being reimplemented
  by hand today, mostly incorrectly. It also deletes the largest category of code in both apps.
- **Trade-off** — A second state library during migration, and a genuine mental-model shift for the
  team. Mitigated by migrating one domain at a time — both can coexist, and each domain's cutover is
  independently shippable.

### Four layers, each with one job

| Layer        | Lives in                       | Responsibility                                                                             | Must not                        |
| ------------ | ------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------- |
| Transport    | `@lemonade/api-client`         | HTTP, auth attach, refresh, envelope unwrap, error normalization, correlation id, timeouts | Know any endpoint or domain     |
| Endpoints    | `features/x/api.ts`            | Typed functions, one per route: `listEvents(params): Promise<Event[]>`                     | Contain React or caching policy |
| Query policy | `features/x/queries.ts`        | Hooks, key factory, `staleTime`, retry, `select`                                           | Build URLs or handle HTTP       |
| Consumption  | Components / Server Components | Render data and states                                                                     | Call the transport directly     |

### Envelope handling belongs in exactly one place

The backend returns `{ success, message, data? }` and omits `data` when null. The transport unwraps
this once and returns `T`; nothing above the transport should ever see `.data.data`. Today unwrapping
is repeated inside all 151 thunks, and `useRequest` gets it wrong.

### Staleness policy, by data class

This replaces the current blanket 5-minute cache on every GET.

| Data class           | staleTime | Refetch on focus | Examples                                                          |
| -------------------- | --------: | ---------------- | ----------------------------------------------------------------- |
| Money & availability |         0 | Yes              | Wallet balance, ledger, ticket stock, escrow state, payout status |
| Operational queues   |       30s | Yes              | Moderation reports, withdrawal requests, admin dashboards         |
| User-owned content   |       60s | Yes              | My events, my tribes, my business listings, profile               |
| Discovery content    |        5m | No               | Public event lists, tribe browse, search results                  |
| Reference data       |        1h | No               | Countries, timezones, banks, categories, plans                    |

### Query keys are hierarchical and produced by factories

```ts
// features/events/queries.ts
export const eventKeys = {
  all: () => ["events"] as const,
  lists: () => [...eventKeys.all(), "list"] as const,
  list: (p: EventQuery) => [...eventKeys.lists(), p] as const,
  details: () => [...eventKeys.all(), "detail"] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  tickets: (id: string) => [...eventKeys.detail(id), "tickets"] as const,
};
```

Hierarchy is what makes invalidation precise: publishing an event invalidates `eventKeys.detail(id)`;
creating one invalidates `eventKeys.lists()` without discarding cached detail pages. Inline key arrays
are banned — they are how invalidation silently stops matching.

### Mutations declare their invalidations

Every mutation names what it invalidates, in the same file. Two rules on top:

- **Optimistic updates only for cheap, reversible, non-financial actions** — likes, follows,
  read-receipts, bookmarks.
- **Never optimistic for money or state machines** — payments, payouts, refunds, escrow transitions,
  subscription changes. These invalidate and refetch. The ledger is authoritative; a UI that guesses
  and rolls back is worse than a UI that waits.

### Server Components and prefetching

For pages that can render on the server: prefetch into a `QueryClient` in the Server Component, pass a
dehydrated state through a boundary, and let client islands `useQuery` the same keys — they hydrate
from cache with no request on mount. The same endpoint functions serve both paths, so there is no
duplicate fetching layer.

### Pagination

Standardize on a page-based list envelope in `@lemonade/api-types`, and read page state from
`searchParams`. **This requires the backend to paginate consistently** — only 10 of ~280 actions do
today. Until each endpoint is paginated server-side, the corresponding table keeps client-side slicing
behind the same hook interface, so the swap is a one-line change per feature when the backend lands.
See §22, Conflict 1.

---

## 12. State, Forms & Validation

### State taxonomy

| Kind                | Owner              | Examples                                              | Notes                             |
| ------------------- | ------------------ | ----------------------------------------------------- | --------------------------------- |
| Server state        | TanStack Query     | Everything from `/v1/*`                               | Never persisted to disk           |
| URL state           | `searchParams`     | Page, sort, filters, tab, search                      | Shareable, back-button correct    |
| Form state          | React Hook Form    | Field values, touched, errors                         | Uncontrolled by default           |
| Ephemeral UI state  | `useState`         | Modal open, dropdown, hover                           | Colocated with the component      |
| Global client state | Redux (or Context) | Session summary, toasts, feature flags, unsent drafts | Small enough to audit at a glance |

> **Persistence.** Today redux-persist whitelists `["auth"]` in admin and `["auth", "event"]` in the
> user app — so the entire event slice, a server cache, is written to `localStorage` and rehydrated on
> next visit. Server data must never be persisted: it goes stale invisibly and there is no
> invalidation path. After the migration, persist nothing but small, non-sensitive client preferences.

### Decision: React Hook Form + Zod, replacing Formik + Yup **[SHOULD]**

- **Problem** — Formik is in maintenance mode and re-renders the whole form on every keystroke —
  visible on the 893-line event-creation wizard. Yup schemas are not the source of TypeScript types,
  so form values are typed by hand or as `any`. And `lib/checkError.ts` — duplicated byte-for-byte in
  both apps — is a 25-branch ternary chain mapping field names to Formik error lookups, one branch per
  field, which must be edited every time a field is added.
- **Decision** — React Hook Form for state, Zod for schemas, one `FormField` primitive in
  `@lemonade/ui` that renders label, control, description and error from the resolver — deleting
  `checkError.ts` outright.
- **Why** — Uncontrolled inputs mean typing does not re-render the form. `z.infer` makes the schema
  the single source of both validation and types. And a Zod schema can be written to mirror a backend
  `FormRequest`'s `rules()` directly, which makes divergence reviewable.
- **Trade-off** — 45 files use Formik. Migrate per feature alongside that feature's query migration —
  never as a separate sweep. Both libraries coexist without conflict during the transition. Note `zod`
  is already a dependency in admin (currently unused), so this is partly adopting a decision already
  made.

### Validation is mirrored, never authoritative

The backend's `FormRequest` classes are the authority; a 422 with `error_code: validation-failed` is
the real verdict. Client schemas exist to make the UI responsive, not to decide anything.

- Each Zod schema carries a comment naming the backend `FormRequest` it mirrors, so a reviewer can
  check them side by side.
- Server `errors` (the Laravel bag) map back onto form fields via `setError`, so a server rejection
  lands on the field that caused it rather than in a toast.
- Where a rule cannot be mirrored — uniqueness, entitlements, balance sufficiency — do not guess.
  Submit and render the server's answer.
- Password rules mirror `App\Support\PasswordRules`, replacing the `handleTest` regex helper currently
  duplicated in both apps.

### Shared vs app-local schemas

Auth, profile, address and money-amount schemas go in `@lemonade/domain` — both apps validate them
identically because the backend does. Event creation, ticket setup, business listings, moderation
actions and payout approval stay app-local: only one app submits them.

---

## 13. Authentication & Authorization

### Decision: move the bearer token into an httpOnly cookie, brokered by Next Route Handlers **[MUST]**

- **Problem** — Tokens live where JavaScript can read them — `localStorage` via redux-persist in
  admin, and three overlapping mechanisms in the user app. Any XSS, including one from a transitive
  dependency, takes a live session. It also forces every page to be a client component, because only
  the client can read the token.
- **Decision** — Credentials go to a Next Route Handler (`app/api/auth/login`). It calls
  `/v1/{user|admin}/auth/login` server-side, and sets the access and refresh tokens as
  `httpOnly; Secure; SameSite=Lax` cookies. Browser JavaScript never holds a token. Server Components,
  Route Handlers and middleware read the cookie; client components call same-origin `/api/*` handlers
  that attach the bearer server-side.
- **Why** — It closes the XSS exfiltration path, unlocks Server Components and real middleware gating,
  gives one place to implement refresh correctly, and removes all 87 manual `Authorization` headers.
  The backend needs no change — it still receives a normal bearer token from a server-side caller.
- **Trade-off** — Adds a network hop and makes the Next server a required runtime component (no static
  export). Both are acceptable: the apps already need a Node runtime, and the hop is same-region. CSRF
  becomes relevant once auth rides on cookies — mitigate with `SameSite=Lax` plus an origin check in
  the handlers.
- **Alternative** — Keep bearer tokens in JS and accept the XSS exposure. Cheaper, and the only reason
  to choose it would be an inability to run a Node server — which does not apply here. Rejected.

### Session flow

```
  Browser                Next (BFF)                    Laravel /v1
     │                       │                              │
     ├─ POST /api/auth/login ►│                              │
     │   {email, password}    ├─ POST /v1/user/auth/login ──►│
     │                        │◄─ {token, refresh_token} ────┤
     │◄─ 200 + Set-Cookie ────┤    httpOnly · Secure · Lax   │
     │   {user}  no token     │                              │
     │                        │                              │
     ├─ GET /api/events ─────►│  reads cookie                │
     │                        ├─ GET /v1/user/events ───────►│
     │                        │      Authorization: Bearer   │
     │◄─ 200 {data} ──────────┤◄─────────────────────────────┤
     │                        │                              │
     │   on 401:              ├─ POST /v1/user/auth/refresh ►│  token in BODY
     │                        │◄─ new token ─────────────────┤
     │                        └─ rewrite cookie, retry once  │
```

### Three rules the current code gets wrong

- **Refresh on 401, not 403.** The backend returns 401 for expired or absent credentials and 403 for
  policy denial. Refreshing on 403 (as the user app does) retries a request that will always fail, and
  never refreshes one that would succeed.
- **Refresh sends the token in the JSON body.** `API-BREAKING-CHANGES.md` is explicit: no auth header
  is read on that route. The user app's current call would fail even if the URL were right.
- **Refresh once, then fail.** One in-flight refresh, with concurrent requests queued behind it — the
  user app's queue logic is correct and should be preserved in the shared transport. On refresh
  failure, clear cookies and redirect once.

### Two guards, two token namespaces

The backend defines `auth:user` (User model) and `auth:admin` (Admin model) as separate Sanctum
guards. This must stay visible in the frontend architecture: separate cookie names (`lm_admin_at` vs
`lm_user_at`), separate Route Handler namespaces, separate refresh endpoints. An admin token is not a
user token and must never be sent to a user route.

### Token abilities

The backend gates routes on `TokenType` abilities via `ability:` middleware — a password-reset token
can only reach reset routes, a verification token only verification routes. Frontend flows must thread
the right token through the right step: `forgot-password` → `check-otp`
(`password_reset_verification`) → `reset-password` (`password_reset`). Model these as distinct
short-lived session states, not as "logged in."

### Authorization: three layers, one authority

| Layer  | Mechanism                                            | Purpose                               |
| ------ | ---------------------------------------------------- | ------------------------------------- |
| Edge   | `middleware.ts` — cookie present and unexpired       | Redirect before render. UX only.      |
| Render | Server Component reads session, renders permitted UI | Never ship markup the user cannot use |
| API    | Laravel Policies (8 domains) + guards + abilities    | **The only real authority**           |

> **Non-negotiable.** Hiding a control in the UI is a courtesy, not a security boundary. Every mutation
> must be independently authorized server-side, and it already is — the backend has policies for
> Business, Event, Forum, Order, Subscription, Thread, Tribe and Wallet. The frontend must never be the
> reason an action is safe.

---

## 14. Error Handling & Reliability

### One normalized error type

The transport converts every failure — HTTP error, network failure, timeout, malformed response — into
one shape, so nothing above it inspects raw axios errors:

```ts
type ApiError = {
  status: number; // HTTP status
  errorCode: ErrorCode; // backend enum, 18 cases
  message: string; // backend message, safe to show
  fieldErrors?: Record<string, string[]>; // Laravel bag, 422 only
  correlationId?: string; // from CorrelationId middleware
  kind:
    | "validation"
    | "auth"
    | "permission"
    | "notFound"
    | "conflict"
    | "rateLimit"
    | "server"
    | "network"
    | "timeout";
};
```

`kind` is derived from status and `errorCode` so components branch on intent rather than on numbers,
and never on message text.

### Handling by kind

| Kind              | Status | Retry                 | Presentation                                                                |
| ----------------- | -----: | --------------------- | --------------------------------------------------------------------------- |
| validation        |    422 | No                    | Map `fieldErrors` onto form fields via `setError`                           |
| auth              |    401 | Refresh once, then no | On refresh failure: clear session, redirect to login with `?next=`          |
| permission        |    403 | No                    | Inline "not available to your account" — never a redirect loop              |
| notFound          |    404 | No                    | Route-level `not-found.tsx`                                                 |
| conflict          |    409 | No                    | Refetch and show current state — common on escrow and payout transitions    |
| rateLimit         |    429 | Backoff               | Backend uses `throttle:auth` on auth routes; surface a wait, disable submit |
| server            |    5xx | 3× exponential        | Error boundary with retry; report with correlation id                       |
| network / timeout |      — | 3× exponential        | Offline-aware banner; queue nothing that moves money                        |

### Error boundaries per route segment — done (2026-09-21)

Both apps now have `error.tsx` (recoverable, with a "Try again" retry) and `not-found.tsx` under both
`(main)` and `(auth)`, `loading.tsx` under both too, a root `global-error.tsx` for root-layout failures,
and a root `not-found.tsx`. `(main)`'s boundaries wrap with `MainLayout` so the nav stays usable — the
blast radius of a failure is one segment, not the app; `(auth)`'s stay unwrapped since `AuthLayout` does
its own pathname/cookie-based redirects, not something an error boundary should depend on while
recovering. `loading.tsx` is standalone in both apps too, to avoid an extra profile/current-user fetch
firing on every navigation.

**A real routing behavior found live, not assumed**: neither the admin app's `middleware.ts` permission-
gate rewrite (§22 Conflict 2) nor a genuinely unmatched path resolves to a route-group-level
`not-found.tsx` at all — Next falls back to the root one, since the path doesn't match anything under
`(main)`/`(auth)` for it to pick a layout tree from. Both apps needed the root-level `not-found.tsx` for
either case to show custom content instead of Next's generic default; confirmed via a real production
build (`next build && next start`), not dev mode. Verified the same way for `error.tsx`: a deliberately-
thrown error in a temporary probe route (removed after) rendered the recoverable UI with the sidebar
still intact, not a blanked page.

**Restyled to match each app's real design, not shadcn defaults (2026-09-21).** The first pass used
`@lemonade/ui`'s `Button` and generic tokens (`bg-primary`, `text-muted-foreground`) — real primitives,
but nothing either app's actual pages look like: every real page hand-rolls its primary CTA as a
green-gradient button (`border-step-color` + `bg-gradient-green`) with the app's own `text-grey`/
`light-black` tokens at pixel sizing, not shadcn's default scale. Caught by screenshotting a boundary
next to a real page (team members) side by side — visibly generic by comparison. `(main)`'s boundaries
and the root `not-found.tsx` now wrap with `MainLayout` for the real sidebar/logo; `(auth)` and
`global-error.tsx` stay unwrapped (no assumed session) but hand-replicate the logo + light-grey shell
instead of rendering bare.

One real per-app difference surfaced fixing this: admin's root `not-found.tsx` is safe to wrap in
`MainLayout` because its `middleware.ts` denies by default — any unauthenticated request to a
non-public path redirects to `/login` before a 404 can ever render. Frontend's `middleware.ts` instead
allowlists specific prefixes (`PROTECTED_PREFIXES`); a random unmatched path passes through
unauthenticated, so frontend's root `not-found.tsx` stays deliberately unwrapped, unlike admin's.
`(main)`'s boundaries in both apps are still safe to wrap, since every real `(main)` route is itself
behind auth.

### Error copy is a mapping, not a passthrough

`@lemonade/domain` maps each `ErrorCode` to user-facing copy and a suggested action.
`subscription-required` and `plan-feature-required` should route to the upgrade flow rather than render
a raw sentence; `account-suspended` should explain what happens next. The backend message is the
fallback, never the design.

### Reliability practices

- **Idempotency keys** on every money mutation, generated at intent time so a retry cannot double-post
  to the ledger.
- **Disable-on-submit** everywhere, enforced by the shared form primitive rather than remembered per
  form.
- **Timeouts on every request** — the current clients set none, so a hung request hangs a spinner
  forever.
- **Never retry non-idempotent mutations** automatically. Reads retry; writes ask.
- **Correlation id in every error report**, so a frontend report joins the backend's own logs for that
  request.

---

## 15. Performance Strategy

Ordered by expected impact on the user app, which is mobile-first and where performance is a business
concern rather than a nicety.

| #   | Action                                                                                                                                                  | Impact                                                                   | Priority   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------- |
| 1   | Server-render public pages (event, tribe, business, discover) instead of shipping empty client shells                                                   | First contentful paint on mobile; crawlable content for the first time   | **MUST**   |
| 2   | Remove MUI, antd, Evergreen — 1–4 files each                                                                                                            | Three component libraries plus Emotion out of the graph                  | **SHOULD** |
| 3   | Remove confirmed-dead deps (`react-quill`, `draft-js`, `react-draft-wysiwyg`, duplicate date pickers and scroll libraries, `zustand`, `firebase-admin`) | Smaller install, faster CI, fewer React 19 blockers                      | **MUST**   |
| 4   | Server-side pagination for admin tables                                                                                                                 | Payload stops scaling with platform size                                 | **MUST**   |
| 5   | Replace 151 thunks with query hooks                                                                                                                     | Deduplication and background refetch remove redundant in-flight requests | **MUST**   |
| 6   | Split the 1,394-line `Skeletons.tsx` and the 931-line `tableData.ts`                                                                                    | These are imported broadly, so they land in many bundles                 | **SHOULD** |
| 7   | Lazy-load heavy leaf UI: chart panels, image croppers, wizards, modals                                                                                  | Off the initial bundle                                                   | **SHOULD** |
| 8   | `next/image` with `remotePatterns`, explicit sizes, and priority only above the fold                                                                    | Cloudinary and DO Spaces assets stop shipping unoptimized                | **SHOULD** |
| 9   | `next/font` with subsetting; drop unused faces                                                                                                          | Admin loads Geist, Geist Mono and Inter but applies only Inter           | **NICE**   |
| 10  | Virtualize tables past ~200 rows                                                                                                                        | Only after server pagination; may prove unnecessary                      | **NICE**   |

> **Not a performance tool.** The user app's global 5-minute GET cache reads as a performance
> optimization and is really a correctness bug (§3.7). Removing it may increase request volume; that is
> the correct trade, and per-query `staleTime` recovers most of the benefit without serving stale wallet
> balances.

### Budgets, enforced in CI

Budgets that are not measured are aspirations. Track with `@next/bundle-analyzer` and Lighthouse CI on
pull requests; fail the build on regression rather than on absolute numbers, so the ratchet only turns
one way.

- User app, public route: **< 200 KB** first-load JS (gzipped)
- User app, authenticated route: **< 350 KB**
- Admin route: **< 500 KB** — relaxed deliberately; admin is desktop and authenticated
- LCP < 2.5s and CLS < 0.1 on a throttled mobile profile for public pages

---

## 16. Security Strategy

The backend has had a security hardening pass — policies on all eight domains, throttled auth routes, a
`SecurityHeaders` middleware, secrets kept out of flashed input. The frontends have not had an
equivalent pass. These are the gaps.

| Risk                            | Present state                                                                                       | Target                                                       | Priority   |
| ------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ---------- |
| Token theft via XSS             | Tokens in `localStorage` and JS-readable cookies                                                    | httpOnly cookies via BFF (§13)                               | **MUST**   |
| Privileged SDK in a browser app | `firebase-admin` in frontend `dependencies`                                                         | Removed; server-only code guarded with `server-only`         | **MUST**   |
| Unprotected admin routes        | No middleware in admin at all                                                                       | Middleware gate in both apps                                 | **MUST**   |
| Incomplete logout               | Iterates `document.cookie` and blanks keys; cannot clear httpOnly or other paths                    | Server-side session clear + backend token revocation         | **MUST**   |
| No Content-Security-Policy      | Absent in both apps                                                                                 | CSP with nonces via middleware; start report-only            | **SHOULD** |
| No dependency scanning          | None. The one security fix in admin's history was an externally-reported RSC CVE.                   | Dependabot + `pnpm audit` in CI                              | **MUST**   |
| Unvalidated env at boot         | `process.env.NEXT_PUBLIC_BASE_URL` read raw; undefined yields the string `"undefined"` in URLs      | Zod-validated env module, fails at build                     | **MUST**   |
| CSRF once auth is cookie-based  | Not applicable today                                                                                | `SameSite=Lax` + origin check in Route Handlers              | **MUST**   |
| Data leakage via logs           | 62 `console.log` calls, including in the auth interceptor                                           | No `console` in production; structured logger with redaction | **SHOULD** |
| Open image host allowlist       | Includes `images.unsplash.com` and `encrypted-tbn0.gstatic.com` — placeholders in production config | `remotePatterns` limited to Cloudinary + DO Spaces           | **SHOULD** |
| Client-trusted authorization    | UI hides controls; correctness depends on backend policies holding                                  | Unchanged — but stated and tested, never assumed             | **MUST**   |

### Environment variables

Neither app has a committed `.env.example`, and neither can start without one — `NEXT_PUBLIC_BASE_URL`
and `NEXT_PUBLIC_PUSHER_KEY` are both undefined today. Introduce a validated env module per app:

- A Zod schema splitting `server` and `client` variables, validated at build and boot. A missing
  variable fails the build rather than producing `"undefined/api/v1/..."` at runtime.
- **Only genuinely public values carry `NEXT_PUBLIC_`.** Once the BFF exists, the backend URL becomes a
  server variable — the browser talks to same-origin `/api/*` and never needs to know where Laravel
  lives.
- A committed `.env.example` in each app listing every variable with a comment. This is also the
  fastest fix for onboarding, which currently fails at step one.

---

## 17. Testing Strategy

> There are zero tests in either app. The backend has PHPUnit with unit, feature and architecture
> suites gated in CI. The goal is not parity of coverage percentage — it is that the large refactors
> ahead are survivable.

### Test before you refactor, not after

The ordering matters more than the tooling. A characterization test written against current behaviour —
even imperfect behaviour — is what lets a domain be moved from thunks to queries without silently
changing what users see. Write the test for a feature immediately before migrating that feature.

| Layer                  | Tool                          | Scope                                                                                       | Target                                                         | Priority   |
| ---------------------- | ----------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ---------- |
| Unit — shared packages | Vitest                        | Money formatting, dates, error mapping, transport, refresh queue, schemas                   | **≥ 90%** — highest bar in the repo; a bug here hits both apps | **MUST**   |
| Contract               | Vitest + MSW                  | Envelope unwrap, all 18 `ErrorCode`s, 422 field mapping, 401 refresh, pagination            | Every case                                                     | **MUST**   |
| Component              | Vitest + Testing Library      | Forms (validation, server-error mapping), tables (empty/loading/error), money confirmations | Every form and money surface                                   | **MUST**   |
| Integration            | Testing Library + MSW         | Feature flows against a mocked `/v1`                                                        | Each migrated domain                                           | **SHOULD** |
| End-to-end             | Playwright                    | Critical journeys against a real backend                                                    | ~10 journeys, on merge                                         | **SHOULD** |
| Visual regression      | Playwright snapshots          | `@lemonade/ui` primitives, both themes                                                      | Primitives only                                                | **NICE**   |
| Accessibility          | `axe-core` in component tests | Forms, dialogs, tables, navigation                                                          | No serious/critical violations                                 | **SHOULD** |

### The ten end-to-end journeys

Deliberately few, deliberately the ones that cost money or trust when they break:

1. Sign up → verify email → complete profile setup
2. Log in → refresh an expired token mid-session → stay logged in
3. Create an event → add ticket types → publish
4. Buy a ticket → payment redirect → confirmation → ticket appears
5. Join a paid tribe → creator wallet credited (ledger assertion)
6. Request a withdrawal → admin approves → payout status advances
7. Admin adjusts a user balance → ledger entry created and visible
8. Report content → admin moderates → resolution reflected to reporter
9. Subscribe to a plan → gated feature unlocks → cancel → gate returns
10. Connect: send a message → recipient receives it over Pusher

### Mocking

MSW handlers are generated from the same backend contract as `@lemonade/api-types` and live in
`packages/api-types/mocks`. This matters: hand-written mocks drift from the API, and a test suite that
passes against a fictional backend is worse than no suite. When the contract regenerates, stale
handlers fail to typecheck.

### What not to test

No snapshot tests of large component trees — they fail on every legitimate change and get regenerated
without reading. No tests asserting implementation details of TanStack Query or React Hook Form. No
coverage threshold on app code as a merge gate; thresholds on the shared packages, where they mean
something.

---

## 18. Code Quality & Developer Experience

### The current onboarding experience

Worth stating plainly, because it is the cheapest thing on this list to fix: a new developer clones
either app, runs `yarn dev`, and gets an app that compiles and immediately fails every request — no
`.env.example`, no README setup section, no lint config, no tests, and a backend URL that is wrong even
once the variable is set. **Phase 0 should end with "clone, install, copy env, run, and it works."**

### Toolchain

| Concern            | Tool                 | Configuration                                                                                                                                              | Priority   |
| ------------------ | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Package manager    | pnpm                 | Workspaces; single lockfile. Replaces the current mix — both apps carry _both_ `yarn.lock` and `package-lock.json`, so nobody knows which is authoritative | **MUST**   |
| Task orchestration | Turborepo            | Affected-graph builds, remote cache                                                                                                                        | **MUST**   |
| Linting            | ESLint 9 flat config | Shared in `@lemonade/config`; `next`, `react-hooks`, `@typescript-eslint`, `boundaries`                                                                    | **MUST**   |
| Formatting         | Prettier             | One config; one formatting commit; add it to `.git-blame-ignore-revs`                                                                                      | **MUST**   |
| Types              | TypeScript strict+   | Add `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`                                                                         | **SHOULD** |
| Pre-commit         | husky + lint-staged  | Format and lint changed files only                                                                                                                         | **SHOULD** |
| Commits            | Conventional Commits | Backend already follows this (`feat(payouts): …`) — match it                                                                                               | **SHOULD** |
| Dependency hygiene | knip + Dependabot    | Catch the 50 unimported deps and keep them from returning                                                                                                  | **SHOULD** |

### Lint rules that encode this document

Each of these prevents a specific measured problem from recurring:

| Rule                                                           | Level                         | Prevents                                           |
| -------------------------------------------------------------- | ----------------------------- | -------------------------------------------------- |
| `@typescript-eslint/no-explicit-any`                           | error (warn during migration) | Return of the 574 `any`s                           |
| `react-hooks/exhaustive-deps`                                  | error                         | The 32 stale-closure effects                       |
| `boundaries/element-types`                                     | error                         | Cross-feature and package-boundary violations (§9) |
| `no-restricted-imports`: axios outside `api-client`            | error                         | A third HTTP client appearing                      |
| `no-restricted-imports`: MUI, antd, Evergreen                  | error                         | Removed libraries creeping back                    |
| `no-console` (allow `warn`/`error`)                            | error                         | The 62 stray logs                                  |
| `no-restricted-syntax`: `localStorage.setItem` with token keys | error                         | Tokens returning to JS-readable storage            |
| `@next/next/no-img-element`                                    | error                         | Unoptimized images                                 |

### Design tokens retire the 7,041 hardcoded pixels

One Tailwind preset in `@lemonade/ui` defining spacing, type scale, radii, colour and elevation.
Arbitrary values (`w-[285px]`, `text-[12px]`) become lint warnings, then errors. Migrate
opportunistically — when a component is touched for another reason, it comes onto the scale. A
dedicated sweep across 7,041 occurrences is not a good use of a sprint.

### Documentation

- **`docs/ARCHITECTURE.md`** — this document, checked into the repo and updated when decisions change.
- **`docs/adr/`** — one short ADR per significant decision, matching the backend's existing ADR practice
  (it references ADR-003 for its own rewrite).
- **`docs/CONTRACT.md`** — how the backend contract is consumed, how to regenerate types, what to do
  when generation and reality disagree.
- **`README.md` per app** — setup, env, scripts, deploy. Both current READMEs are unmodified
  `create-next-app` boilerplate.
- **`CLAUDE.md` at the repo root** — conventions in a form an AI coding agent will actually follow: the
  import rules, naming table, and the keep/refactor/remove list from §10.

---

## 19. CI/CD & Deployment

The backend has a deployment workflow (`DO_DEV.yml`) and a `composer test:ci` gate chaining clean →
format → lint → static analysis → tests. Neither Next app has any CI. Mirror the backend's gate shape so
both halves of the system feel the same to work on.

### Pull-request pipeline

```
on: pull_request
 │
 ├─ install (pnpm, frozen lockfile, cached)
 │
 ├─ turbo run --filter=...[origin/main]   affected packages only
 │    ├─ lint          eslint 9, zero warnings
 │    ├─ typecheck     tsc --noEmit
 │    ├─ test          vitest, coverage on packages/*
 │    └─ build         next build (both apps if affected)
 │
 ├─ contract-drift     regenerate api-types → fail if diff
 ├─ audit              pnpm audit + Dependabot
 ├─ bundle-budget      fail on regression vs base branch
 └─ e2e                playwright, 10 journeys (merge queue only)
```

> **Why the contract-drift check earns its place.** It regenerates `@lemonade/api-types` from the
> backend contract and fails if the result differs from what is committed. That turns "the backend
> changed and nobody told the frontend" — the exact failure that produced the current `/api` vs `/v1`
> breakage — from a production incident into a red pull request.

### Environments

| Environment | Trigger         | Backend        | Purpose                                    |
| ----------- | --------------- | -------------- | ------------------------------------------ |
| Preview     | Every PR        | Dev API        | Review with a real URL; run e2e against it |
| Staging     | Merge to `main` | Staging API    | Contract verification before release       |
| Production  | Tagged release  | Production API | Manual approval                            |

### Versioning and release

- **Changesets** for the shared packages: any change to `packages/*` requires a changeset naming the
  affected apps. This makes the blast radius explicit at review time rather than at deploy time.
- **Apps version by date-tag** (`admin-v2026.09.10`), not semver — they have no external consumers, and
  semver on an application is theatre.
- **Backend contract versions independently.** The `/v1` prefix is the compatibility boundary; a
  breaking change means `/v2`, not a silent reshape of `/v1`. That is precisely the lesson of the
  current migration.
- **Deploy apps independently.** Turborepo's affected-graph means an admin-only change does not
  redeploy the user app.
- **Rollback is a redeploy of the previous tag.** Because the frontends hold no migrations, rollback is
  genuinely cheap — but only if the backend maintains `/v1` compatibility, which is why the versioning
  rule above matters.

### Deployment order for coupled changes

When a change spans both repos, the order is fixed: **backend first, additively.** Add the new field or
endpoint while keeping the old one working → deploy → update the frontends to use it → deploy → remove
the old surface in a later backend release. The current breakage happened because the backend's old
surface was removed before its consumers moved. Never again in one step.

---

## 20. Version Upgrade & Migration Plan

> **Executed — see Phase 3's status for what actually happened.** Both apps are on Next 15.1.11 and
> React 19 now. The plan below is kept as the pre-execution risk assessment it was, not updated line by
> line to match the outcome — it called the react-quill/draft-js/react-draft-wysiwyg removals and the
> evergreen-ui migration correctly, ahead of time.

> The two apps are on different Next majors (15.1.11 and 14.2.7) and both on React 18. Align them
> before refactoring — otherwise every shared package must satisfy two framework versions, and every
> large refactor gets written twice.

> **Verify at execution time.** Version numbers below reflect what is installed today and what was
> current as of this analysis. Confirm the latest stable Next and React majors and re-read their upgrade
> guides before starting Phase 3 — the _sequence_ and the risks are what this section is for; the exact
> numbers should be checked.

### Target versions

| Package                                      | Admin           | Frontend        | Target                                             | Risk   |
| -------------------------------------------- | --------------- | --------------- | -------------------------------------------------- | ------ |
| next                                         | 15.1.11         | 14.2.7          | Same latest stable major, both apps                | High   |
| react / react-dom                            | ^18             | ^18             | 19.x                                               | High   |
| typescript                                   | ^5              | ^5              | Latest 5.x, pinned                                 | Low    |
| eslint                                       | none            | none            | 9.x flat config                                    | Medium |
| tailwindcss                                  | ^3.4.1          | ^3.4.1          | Stay on 3.x through Phase 6; evaluate 4 separately | Medium |
| @reduxjs/toolkit                             | ^2.5.0          | ^2.2.8          | Shrinking, then possibly removed                   | Low    |
| formik + yup                                 | ^2.4.6 / ^1.6.1 | ^2.4.6 / ^1.4.0 | Replaced by RHF + Zod                              | Medium |
| axios                                        | ^1.7.9          | ^1.9.0          | Single version in `api-client`, or native fetch    | Low    |
| axios-cache-interceptor                      | —               | ^1.8.3          | **Removed**                                        | Low    |
| @mui/material + @emotion                     | ^6.3.0          | ^6.1.3          | **Removed**                                        | Low    |
| antd                                         | ^5.25.3         | ^5.24.8         | **Removed**                                        | Medium |
| evergreen-ui                                 | ^7.1.9          | ^7.1.9          | **Removed**                                        | Low    |
| react-quill / draft-js / react-draft-wysiwyg | installed       | installed       | **Removed** — zero references                      | Low    |
| firebase-admin                               | —               | ^13.5.0         | **Removed** — server SDK in a client app           | Low    |
| moment                                       | —               | ^2.30.1         | Replaced by `dayjs`, already present in both       | Low    |

### Breaking changes to plan for

#### Next 14 → 15 (frontend app only; admin is already on 15)

- **Async request APIs.** `params`, `searchParams`, `cookies()`, `headers()` and `draftMode()` became
  asynchronous. A codemod covers most of it; every dynamic route needs review. _Lower impact here than
  usual_ — 45 of 46 route files are client components today and do not use these. That flips as Server
  Components are adopted, so getting the upgrade in first is the cheaper order.
- **Caching defaults inverted.** `fetch` requests, GET Route Handlers and client-side router navigation
  are no longer cached by default. Anything relying on implicit caching must opt in explicitly.
- **ESLint 9 flat config.** Since neither app has a config, this is a greenfield write rather than a
  migration — a rare piece of good luck.
- **`images.domains` deprecated** in favour of `remotePatterns`. Both apps use the old key.

#### React 18 → 19 (both apps)

- **Removed APIs:** string refs, legacy context, `defaultProps` on function components, `propTypes`.
  Older transitive dependencies are the usual casualties.
- **Ref-as-prop** makes `forwardRef` unnecessary; existing usage still works. Relevant when lifting
  shadcn primitives into `@lemonade/ui`.
- **Stricter hydration errors** — previously tolerated mismatches now surface loudly. Expect noise on
  first run; it is finding real bugs.
- **Peer-dependency friction** is the main practical risk. Audit every UI dependency for React 19
  support _before_ upgrading. Two known blockers, `react-quill` and `draft-js`, are already dead code —
  removing them in Phase 0 clears the path. Verify `react-slideshow-image`, `react-spinner-overlay`,
  `react-switch`, `react-otp-input` and `evergreen-ui`; replace any that are unmaintained rather than
  pinning React 18 for them.

#### Turbopack and SVGR

Admin's dev script uses `--turbopack` while its SVGR loader is configured under `webpack(config)`, which
Turbopack does not read — with 116 SVGs imported as React components. Resolve deliberately: either
configure SVG handling for Turbopack, or drop `--turbopack` until it is configured. Do not leave dev and
build on different asset pipelines.

### Migration order, and why

| Order | Work                                                     | Rationale                                                                                                                                      |
| ----- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Repair the API contract; add env files; delete dead deps | Nothing can be verified while the apps cannot talk to the backend. Removing dead deps first shrinks the surface every later step must upgrade. |
| 2     | ESLint, Prettier, TypeScript strictness, CI, smoke tests | Gates before changes. Every subsequent step needs a signal that it broke something.                                                            |
| 3     | Monorepo consolidation                                   | Mechanical, no behaviour change. Do it before upgrades so upgrades happen once.                                                                |
| 4     | Next alignment + React 19                                | Once, in one dependency graph, before large refactors so refactors target the final framework.                                                 |
| 5     | Transport + auth (BFF, httpOnly cookies)                 | Unblocks Server Components and removes 87 manual headers. Everything downstream assumes it.                                                    |
| 6     | Server-state migration, domain by domain                 | The bulk of the work; each domain is independently shippable.                                                                                  |
| 7     | Forms, per feature, alongside step 6                     | Same files are already open. Migrating forms separately means touching them twice.                                                             |
| 8     | Server Components + performance                          | Needs 5 and 6 in place; premature otherwise.                                                                                                   |
| 9     | Design system consolidation                              | Safe to defer — visible, not structural.                                                                                                       |

### Keeping the applications working throughout

- **The strangler pattern per domain.** Old thunks and new query hooks coexist. Migrate one domain, ship
  it, verify, take the next. Never a big-bang cutover.
- **Additive backend changes only.** New pagination shapes and fields ship alongside old ones; old
  surfaces are removed a release later, once no consumer uses them.
- **Feature flags for risky cutovers** — the BFF auth switch in particular. Both paths live
  simultaneously; flip per environment; keep the rollback one config change away.
- **Characterization tests before each migration**, as in §17.
- **One formatting commit, isolated**, added to `.git-blame-ignore-revs` so history stays readable.
- **No refactor rides along with an upgrade.** If a React 19 upgrade PR also restructures a feature, a
  regression cannot be attributed. Separate PRs, always.

---

## 21. Phased Implementation Roadmap

Nine phases. Each ends in a shippable state; none requires a freeze. Effort is indicative for a small
team and should be re-estimated against actual capacity.

> **How to read the status tags below.** Each phase heading now carries one of: **[DONE]**
> (verified, either live against the real backend or via the test suite — not just typechecked),
> **[IN PROGRESS]** (some of the phase shipped, see its own status note for exactly what), or
> **[NOT STARTED]**. The original bullet list under each phase is left exactly as written — the
> plan as designed — with a **Status:** paragraph appended describing what actually happened,
> including where reality diverged from the plan. Where something diverged, that's named, not
> smoothed over.

### Phase 0 — Restore working software **[MUST]** **[DONE]**

Nothing else can be verified until the apps can reach the backend. Days, not weeks — and it ends with a
system a new developer can actually run.

- Repoint `baseUrl` from `/api` to `/v1` (3 files per app) and split admin vs user base paths
- Work `API-MIGRATION-AUDIT.md` endpoint by endpoint; apply every change in `API-BREAKING-CHANGES.md` —
  refresh token to body, `callback_url` → `redirect_url`
- Add `.env.example` and a README setup section to both apps
- Delete confirmed-dead dependencies; settle on one lockfile per repo
- Fix or remove the Turbopack/SVGR mismatch in admin
- Manual smoke pass over the ten critical journeys; write down what is broken

**Status:** `baseUrl` fixed to `/v1` in both apps; ~130 frontend call sites (and admin's, which were
already correct) rewritten to the real `/v1/{admin|user|shared}/...` paths, cross-checked against the
backend's own generated Postman collection rather than guessed. `job-pay`'s `callback_url` →
`redirect_url` rename applied. `.env.local` now exists in both apps (`LARAVEL_API_URL`, gitignored) —
local dev works with a plain `next dev`. Stale lockfiles removed (`yarn.lock`, `package-lock.json`,
the leftover `packageManager: yarn` field) — one `pnpm-lock.yaml` at the root is the real one now. Not
done: `.env.example` / README setup docs, and the Turbopack/SVGR mismatch was not investigated. **Three
endpoints remain genuinely broken** and need a product/backend decision, not a guess: `tribe.slice.ts`'s
`verifyTribePayment`, business-boost verify, and business verify-payment all reference routes that
don't exist in the current backend contract.

### Phase 1 — Quality gates **[MUST]** **[DONE]**

Put a signal in place before changing anything structural.

- ESLint 9 flat config, Prettier, one isolated formatting commit
- GitHub Actions: lint, typecheck, build on every PR
- Vitest wired up; first smoke and characterization tests
- Dependabot and `pnpm audit` in CI
- Zod-validated env module in both apps

**Status:** Shipped. Both apps extend `@lemonade/config`'s shared flat ESLint config, layer
`eslint-config-next` (pinned to each app's own Next major via FlatCompat) and
`eslint-plugin-boundaries`'s cross-feature-family check, and lint clean (zero errors — the
`no-explicit-any`/axios-and-MUI-import-restriction/`no-unused-vars` rules are downgraded to `warn` at
the app layer only, since those describe target states ~150–300 pre-existing occurrences per app don't
meet yet; `packages/*` keeps the strict `error` level). Fixing lint to zero surfaced and fixed real
bugs, not just style — several `react-hooks/rules-of-hooks` violations in money-adjacent wallet modals
(hooks called after an early `return null`), a cross-feature-internals import
`eslint-plugin-boundaries` was added specifically to catch, a stale-Pusher-user-id bug, and more — see
the `fix(admin)`/`fix(frontend)` commits from this phase for the full list. `.github/workflows/ci.yml`
runs lint/typecheck/test/build via `pnpm turbo run <task> --filter=...[origin/main]`, plus a
report-only `audit` job (74 pre-existing advisories, mostly transitive through antd/draft-js/sharp,
make it non-blocking for now — Dependabot is what burns that down). Both apps have a jsdom Vitest
config extending `@lemonade/config/vitest.base`, with a characterization test and a Testing-Library
component smoke test each. `src/lib/env.{server,client}.ts` in both apps validate `process.env` with
Zod at import time; `.env.example` documents every var each app actually reads. The repo-wide Prettier
pass landed as its own isolated commit, verified not to change lint/typecheck/test/build outcomes.

Two rules were tried and dropped, not shipped silently broken: an `app/**` must-not-import-`@lemonade/api-client`
check and a feature-entry-point-must-be-`index.ts` check both produced zero hits against known real
violations (the BFF route handlers under `app/api/**` that are _supposed_ to import `@lemonade/api-client`
directly; pages importing their own matching feature's `queries.ts` directly, the established
correct pattern everywhere in both apps) — `eslint-plugin-boundaries`'s external-package matching and
its `entry-point` rule didn't work as expected in this workspace. Revisit if picked back up later.

One local-dev friction now fixed rather than worked around: `pnpm-workspace.yaml` had unresolved
"set this to true or false" placeholders left over from an interrupted `pnpm approve-builds` run —
`pnpm run <script>`/`pnpm turbo run <task>` failed outright on those (unlike a plain `pnpm install`,
which only warned), which would have broken CI the moment it ran. Fixed by setting real `allowBuilds`
booleans (esbuild/unrs-resolver approved, the other five denied — `next build` and `vitest` both pass
without them).

> **Update, 29 September 2026: the first real push to `origin/main` since this pipeline was built
> surfaced five genuine gaps, none of them new regressions — this CI pipeline had apparently never
> actually run against a real push before.** All four confirmed fixed by reproducing them locally first
> (not guessed from the CI log alone), then re-running the exact failing command clean before pushing
> again.
>
> 1. **`contract-drift` failed for real.** `tooling/generate-api-types/manifest.snapshot.json` (the
>    committed snapshot `generate:from-snapshot` regenerates from) was stale — an earlier session
>    regenerated `packages/api-types/src/generated/*` directly against the live backend
>    (`generate:from-backend`) when removing the dead Connect-messaging routes, but never re-ran
>    `refresh-snapshot` to update the snapshot file those two generation paths are supposed to agree on.
>    Re-ran `php introspect.php <backend path> > manifest.snapshot.json`, confirmed
>    `git diff --exit-code -- packages/api-types/src/generated` now passes clean.
> 2. **`build` failed: `Invalid server environment variables: LARAVEL_API_URL Required`.** Both apps'
>    `lib/env.server.ts` validate `LARAVEL_API_URL` with Zod at import time and throw if it's missing —
>    `next build`'s page-data collection imports that module chain for every Route Handler even though no
>    real backend is ever called during a build. `ci.yml`'s `build` job never set it. The value itself
>    doesn't matter (nothing during a build calls it), only that it parses as a URL.
> 3. **Same error persisted even after adding the env var to the job — a second, independent cause.**
>    Turborepo's strict env mode strips any var not declared in a task's `env` array in `turbo.json`,
>    even when it's genuinely present in the job's environment — confirmed by reproducing locally:
>    `LARAVEL_API_URL=... pnpm turbo run build` still failed until `turbo.json`'s `build` task declared
>    `"env": ["LARAVEL_API_URL", "NEXT_PUBLIC_APP_URL", "NEXT_PUBLIC_BASE_URL"]` (the three vars both
>    apps' `env.server.ts`/`env.client.ts` require, not optional). `NEXT_PUBLIC_*` vars get some
>    framework-aware inference from Turbo automatically; `LARAVEL_API_URL` (server-only, no
>    `NEXT_PUBLIC_` prefix) does not, which is why only it showed up in the error even though all three
>    were missing.
> 4. **A real, pre-existing type error in `@lemonade/api-client`'s own test suite**, introduced during
>    the signed-in-cookie work and missed at the time because only `vitest run` (which doesn't
>    typecheck) was run against that change, not `tsc --noEmit` — `axios-mock-adapter`'s `reply()` typing
>    only accepts a single string per header, not an array; the `requestWithHeaders` test had passed an
>    array to model a real multi-`Set-Cookie` response. Fixed to a plain string for that one mock call —
>    `getSetCookieValue`'s own array-handling is separately and directly unit-tested without going
>    through this mock library at all, so nothing lost coverage.
> 5. **A fifth, structural gap found right after fixing the first four and re-verifying locally**:
>    `pnpm turbo run test --filter=...[origin/main]` (`ci.yml`'s real "Test" step, not the broader
>    unfiltered `pnpm turbo run test` used to sanity-check the rest of this list) picks up
>    `@lemonade/e2e#test` too, confirmed via `--dry-run=json`, since e2e spec files are genuinely part of
>    this push's diff. That task is a real Playwright run against a live `lemonade-backend` — MySQL,
>    Mailpit, `php artisan serve` — infrastructure only `.github/workflows/e2e.yml`'s manual job sets up;
>    `ci.yml`'s `build` job has none of it. Left as-is, every future PR touching any e2e file would hit
>    this same failure. Fixed by adding `--filter='!@lemonade/e2e'` to the Test step specifically —
>    confirmed via the same `--dry-run=json` check that this excludes only that one package, and via a
>    real (non-dry-run) local run that the other 10 tasks still execute and pass.
>
> Also locked in a real, already-earned improvement surfaced while re-running the full local sweep:
> `packages/config/no-any-budget.json`'s `lemonade-app` budget lowered 208 → 207 (the Google-auth-button
> extraction earlier this session replaced one `tokenResponse: any` with a real type, dropping the count
> for free — the budget just hadn't been told).
>
> Full local verification before pushing again: `pnpm turbo run lint/typecheck/test/build` (all green,
> 9/9 tasks), both apps' any-type and pixel-class budgets within budget, `composer test:ci` in
> `lemonade-backend` unaffected (571 tests).

### Phase 2 — Monorepo consolidation **[MUST]** **[DONE]**

**Archiving the old pre-monorepo repos, closed 25 September 2026:** the user confirmed this is considered
attended to — `lemonade-web` is the actively developed monorepo, and the old pre-monorepo `lemonade/{admin,frontend}`
repos are deliberately left untouched, not worked on or updated. No further action needed here.

Mechanical and low-risk. No behaviour changes in this phase — that is the point.

- Create `lemonade-web`; `git subtree` both apps in with history
- pnpm workspaces + Turborepo; affected-graph CI
- Extract `@lemonade/config`, then the 9 byte-identical files into `@lemonade/domain`
- Stand up `@lemonade/api-types` generation from the backend contract; add the contract-drift CI check
- Add `eslint-plugin-boundaries` with the §9 import rules
- Archive the old repos read-only

**Status:** `lemonade-web` exists and is the actively developed monorepo — pnpm workspaces and
Turborepo are real and in use (`turbo.json`, `packages/{api-client,api-types,domain,ui,config}`).
Whether the original `git subtree`-with-history step is how it got there wasn't verified this phase.
`@lemonade/api-types` exists and is genuinely load-bearing (every domain's route constants live there,
~20 route-constant objects, plus the shared `ErrorCode`/`TokenType` enums mirrored from the backend's
PHP enums) — **still hand-maintained for now** (see below for what changed), but the generation
pipeline the doc's §7 intent describes is real and working. `@lemonade/api-client` (the transport
package, not `@lemonade/domain`) is built and is the one genuinely new, tested shared package.
`eslint-plugin-boundaries` is wired up in both apps' ESLint
configs (Phase 1) — its cross-feature-family check, specifically; two other rules it was tried for
(app/\*\* must not import `@lemonade/api-client` directly, a feature may only be entered through its
own `index.ts`) didn't work as expected against known real cases and were dropped rather than shipped
silently broken. The 9 byte-identical files: re-measured this phase rather than trusted from the
original table above (membership had shifted, though the count still lands on 9) — `checkError.ts` and
`formatCountry.ts` moved into `@lemonade/domain` with characterization tests; `redux/hook.ts` and
`redux/toastifySlice.ts` deliberately did not move (Redux/client state is explicitly excluded from
anything shared, per this doc's own package rules, and `hook.ts` is typed against each app's own
store besides); `components/ui/label.tsx`, `lib/utils.ts`'s `cn()`, and `hooks/useDebounce.ts` are
`@lemonade/ui` candidates, not `@lemonade/domain`, but `packages/ui` is already pinned to React 19
while both apps are still on React 18 (Phase 3), and Phase 7 is explicitly where the two apps'
diverged shadcn styles (admin: `new-york`, frontend: `default`) get reconciled — moving one primitive
there now, unconsumed by either app, would be a half-migration; `favicon.ico` is a binary asset, not
extractable the same way.

`tooling/generate-api-types` is real and working, built against the local `lemonade-backend`
checkout: `introspect.php` boots the Laravel app, walks every registered `v1/*` route (290 today,
up from the 288 this doc originally measured), and for each one resolves the controller's
type-hinted `FormRequest` (via reflection, no HTTP request needed) and dumps its `rules()` as raw
token arrays. `generate.mjs` turns that into `packages/api-types/src/generated/routes.generated.ts`
(35 `<guard><Domain>Routes` groups covering all 290 named routes — not the hand-picked ~20 the
existing `routes.ts` covers) and `requests.generated.ts` (77 `FormRequest` interfaces, field types
inferred from validation rules — `in:a,b,c` becomes a string-literal union, dot-notation fields like
`tickets.*.id` become real nested arrays/objects, not literal dotted keys, and an unrecognized rule
honestly falls through to `unknown` rather than guessing). `manifest.snapshot.json` is a committed
point-in-time capture of the backend contract, so `generate:from-snapshot` and CI's new
`contract-drift` job don't need PHP or a live backend checkout — that job regenerates from the
snapshot and fails if the committed generated files differ. What that check does **not** catch: drift
against the actual live backend since the snapshot was last refreshed (needs `lemonade-backend`
checked out in this repo's CI, a cross-repo access decision, not something to provision from here) or
response shapes (API Resources aren't introspected — only request-side `FormRequest` rules). The
generated output lives under a separate `@lemonade/api-types/generated` import specifically so it
doesn't collide with (or silently replace) `routes.ts` — several group names match by design
(`adminAuthRoutes` exists in both). See `tooling/generate-api-types/README.md` for the full picture.

**Migration to the generated output — done, `routes.ts` deleted.** All 18 feature domains across
both apps (9 admin, 9 frontend — every `features/*/api.ts`/`api.server.ts` pair, plus the auth-
critical `lib/server-api.ts` and `app/api/auth/{login,logout}/route.ts` files in both apps) now
import from `@lemonade/api-types/generated` instead of the hand-maintained `routes.ts`, which is
gone — confirmed zero remaining importers repo-wide before deleting it, per this doc's own
Definition of Done ("no feature exists in both the old pattern and the new pattern when a phase
ends"). Added one small piece of new infrastructure this required: `buildPath(template, params)`
(`packages/api-types/src/build-path.ts`, 5 unit tests) fills the `{param}` placeholders the
generated routes bake into the string itself (e.g. `"/admin/users/{id}"`) — `routes.ts`'s old
pattern of hand-concatenating `` `${BASE}/${id}` `` onto a shared prefix constant doesn't apply to
generated output, since a parameterized route is already a complete, real path template.

The generated file's shape is meaningfully different from the hand-written one it replaced, not
just a renaming exercise — three real differences this migration had to handle correctly, not
paper over: **(1)** naming is per-endpoint, not per-prefix — `adminTransactionRoutes.PLAN_SUBSCRIPTION`
served both the list and the `+ /:id` detail endpoint before; the generated version has separate
`SUBSCRIPTIONS`/`SUBSCRIPTION` constants, one already carrying `{id}`. **(2)** some endpoints moved
to a different, more accurate group entirely — `userAuthRoutes.LOGOUT` and `userSettingsRoutes.PROFILE`/
`.SUBSCRIPTION`/`.NOTIFICATION_SETTINGS` are grouped by their real backend controller now
(`userProfileRoutes`), not by the frontend-side domain that happened to consume them; frontend's
thread/message actions split out of `userTribeRoutes`/`userConnectRoutes` into their own
`userThreadsRoutes`/`userMessagesRoutes` groups the same way. **(3)** multi-param routes keep their
real backend parameter names, which don't always match the frontend's local variable names — e.g.
`userEventsRoutes.EVENT_PROMOTION`'s second placeholder is `{promo_id}`, called `promotionId` at the
one call site that uses it; `userThreadsRoutes.POST_COMMENT`'s second placeholder is `{id}`, not
`{thread_id}` as the old hand-rolled suffix implied. Every one of these was resolved by reading the
real generated route string and the real call site side by side, not by pattern-matching names.

Verified beyond typecheck (which does catch a renamed key or group, but not a wrong route *string*):
lint and build clean in both apps, then live curl-verified roughly 30 endpoints across every migrated
domain in both apps against the real backend post-migration, including the trickiest `buildPath`
cases — admin's wallet add/deduct/withdrawal-request, user suspend/deactivate/reactivate, event
suspend/activate/delete; frontend's tribe detail/threads (confirmed the route resolves — the first
attempt used the wrong identifier, `id` instead of `slug`, caught by getting a real `"Tribe not
found"` back rather than a routing 404, then confirmed again with a real 403 from the actual
authorization check once the right identifier was used), the multi-param thread/poll actions, and
the events guest-list/check-in endpoints. Full existing Playwright e2e suite re-run after: 35
passing, 1 pre-existing flaky test recovered on retry (unrelated — frontend detail-navigation,
already documented elsewhere in this doc).

Not migrated, and deliberately out of scope: the handful of call sites `routes.ts`'s own original
header comment already flagged as raw un-migrated strings (OTP/password-reset sub-flows, file
uploads, a couple of payment-verify endpoints referencing routes that don't exist in the backend
contract at all) — these never used a route *constant* in the first place, so there was nothing for
this pass to move off of. They're the same gaps this doc has tracked since Phase 0/4, not a new find.

Not done: archiving the old `lemonade/{admin,frontend}` repos —
`github.com/PM-Christopher/lemonade-admin` and `github.com/PM-Christopher/lemonade-frontend`, found by
checking the local checkouts' own `git remote -v`. A destructive action on repos outside this one, so
left for direct action rather than automated from here; no tooling access to do it automatically
either way (no `gh` CLI in this environment). They still exist, untouched, now stale relative to this
monorepo (see the canonical-location note at the top of this document).

### Phase 3 — Version alignment **[MUST]** **[DONE]**

Once, in one dependency graph, before the refactors that would otherwise be written twice.

- Audit every UI dependency for React 19 support; replace unmaintained ones
- Frontend app to the same Next major as admin; run the async-request-API codemod
- React 19 in both apps; work through hydration warnings rather than suppressing them
- `images.domains` → `remotePatterns`, restricted to Cloudinary and DO Spaces
- Tighten `tsconfig`; `no-explicit-any` as a warning with a declining budget

**Status:** The Next 14/15 asymmetry this phase set out to remove was real through Phase 4/5 (`apps/frontend`
was Next 14.2.7 with synchronous `cookies()`/Route Handler `params`; `apps/admin` was already on Next
15.1.11 with both async) and required care during that work — it's gone now, both apps are on Next 15
and `server-api.ts`/`app/api/v1/[...path]/route.ts` are the same shape in both apps again.

Three of five bullets are done:

- `images.domains` → `remotePatterns`: done, in both apps, narrowed to DigitalOcean Spaces and
  Cloudinary — grepped both apps' source first and confirmed the two dropped hosts
  (`images.unsplash.com`, `encrypted-tbn0.gstatic.com`) were dead config, referenced nowhere.
- The React 19 UI dependency audit: done — every `dependencies` entry shared between the two apps or
  frontend-only was checked against its actual installed version's `peerDependencies.react` and, for
  anything capping below 19, against npm's latest published version (not just what's installed, in
  case an update exists that hasn't been pulled in yet). Five packages cap below React 19 with no
  newer version published upstream:
  - `draft-js`, `react-draft-wysiwyg`, `react-quill` — all three had **zero real usages** in either
    app (confirmed by grep, including a stray orphaned `react-draft-wysiwyg` CSS import in frontend's
    create-event page with no matching `Editor` import anywhere). Removed outright, along with their
    `@types/*` packages — 28 packages gone from the lockfile.
  - `evergreen-ui` and `react-spinner-overlay` (last published 2023-06 and 2021-11 respectively;
    react-spinner-overlay's peer doesn't even claim React 18 support, despite both apps already
    running 18 today without issue) — both now removed too, in a follow-up pass. Of evergreen-ui's 6
    imports (2 frontend, 4 admin) and react-spinner-overlay's 2 (frontend only), all but one were
    dead — imported, never rendered. The one real usage (`OpenedChat.tsx`'s upload spinner) and
    admin's three real `MoreIcon`/`ChatIcon` usages moved to `lucide-react`, already this codebase's
    icon library everywhere else. `evergreen-ui`'s removal is also this doc's own Phase 7 item ("MUI,
    antd and Evergreen are retired in favour of `@lemonade/ui`") — done from the dependency-tree side;
    Phase 7 is still where `@lemonade/ui` gets real primitives to replace what these icons/spinners
    were standing in for.
  - Everything else checked — `antd`, `@mui/material`, `@radix-ui/*`, `@tanstack/react-query`,
    `@reduxjs/toolkit`, `react-redux`, `zustand`, `formik`, `framer-motion`, `react-datepicker`,
    `react-date-picker`, `cmdk`, `react-dropzone`, `react-switch`, `react-cookie`, `react-icons`,
    `react-hot-toast`, `react-number-format`, `react-otp-input`, `react-responsive`,
    `react-copy-to-clipboard`, `react-loader-spinner`, `react-slideshow-image`,
    `@ant-design/nextjs-registry`, `@bprogress/next`, `@react-oauth/google` — either explicitly
    declares React 19 support or has a peer range wide enough to permit it. `antd` (peer
    `>=16.9.0`, no upper bound) is the one worth a second look even so: a loose peer range means it
    _installs_ under React 19, not that its actual runtime behavior has been verified there — it's
    deeply integrated across both apps (this doc's own Phase 7 scope again), so that verification is
    real work, not a formality.

The version bumps landed too — checked in before starting, given the risk. `apps/frontend` is now on
Next 15.1.11 (matching admin) via Next's own `next-async-request-api` codemod, and both apps are on
React 19. The two bumps turned out not to be separable for frontend specifically: the codemod's
output for Client Component dynamic pages (`const params = use(props.params)`) depends on React's
`use()` hook, which doesn't exist at runtime in React 18.3 (confirmed directly — `typeof
require("react").use` was `undefined` before the bump, a real function after; TypeScript alone didn't
catch this, only running the actual page would have). The codemod's output was reviewed file by file,
not trusted blind — `lib/server-api.ts` was the one place it fell back to Next's
`UnsafeUnwrappedCookies` escape hatch rather than converting cleanly, since `getToken`/
`getRefreshToken`/etc.'s signatures weren't trivial for it to make async automatically; replaced by
hand with the same fully-async pattern `apps/admin/src/lib/server-api.ts` already used (that file's
been on Next 15 since Phase 4). One real React 19 breaking type change found by typecheck outside the
codemod's scope: the bare global `JSX` namespace moved under `React.JSX` — one occurrence, fixed.
Verified beyond lint/typecheck/build: ran `next start` against the production build for both apps
together with the real local backend, confirmed real page HTML renders with no server errors,
middleware still correctly gates protected routes, and the async-params BFF proxy round-trips through
to the live backend. Not verified: full authenticated flows through a real login (no test credentials
available in this environment) — the 16 dynamic pages' `use()` pattern is Next's own tested codemod
output, not hand-written, but wasn't exercised live end-to-end behind auth.

`no-explicit-any`'s declining budget is now real, not just the `"warn"` override Phase 1 landed
anticipating it: `packages/config/scripts/check-any-budget.mjs` counts each app's current occurrences
and fails CI if the count grows past `packages/config/no-any-budget.json`'s entry for that app (209
frontend, 105 admin — today's real counts), with a nudge to lower the budget file when the count
genuinely drops. Wired into CI right after the Lint step.

Every bullet in this phase is done.

### Phase 4 — Transport & authentication **[MUST]** **[DONE, with named deviations]**

The keystone phase. Everything after it depends on the token being server-side.

- Build `@lemonade/api-client`: envelope unwrap, typed `ApiError`, correlation id, timeouts,
  refresh-once with queue
- BFF Route Handlers for login, refresh, logout; httpOnly cookies with distinct admin and user names
- `middleware.ts` in both apps — admin has none today
- Remove all 87 manual `Authorization` headers; delete the token from Redux and localStorage
- Delete the global axios GET cache and `hooks/useRequest.tsx`
- Ship behind a feature flag; flip per environment

**Status:** The core cutover is done and live-verified end to end against the real backend, in both
apps: `@lemonade/api-client` built (envelope unwrap, typed `ApiError`, refresh-once-with-coalescing on
401, correlation-id propagation); `app/api/auth/{login,logout}/route.ts` + `app/api/v1/[...path]/route.ts`
BFF proxy; httpOnly cookies with distinct names per guard (`lemonade_user_token`/`_refresh`,
`lemonade_admin_token`/`_refresh`); `middleware.ts` added to admin (had none) and repointed in frontend
to check the real cookie. Verified live: login sets the httpOnly cookie with no token in the JSON body,
an authenticated proxy call succeeds on the cookie alone, logout revokes the token server-side (a reused
old cookie correctly 401s afterward). The ~87 manual `Authorization` headers were removed from ~100
files across both apps in a dedicated later pass (the "Tier 2" cleanup below) — not in the same push as
the cutover itself, and with one deliberate, load-bearing exception: the pre-login signup/email-
verification/password-reset flow authenticates with a distinct, narrowly-scoped Sanctum token (not the
main session) via a `newToken` cookie, which is a real, still-functional mechanism, not dead weight —
see the BFF proxy's `bearerTokenOverride` support, added specifically for this. **Named deviations from
the plan:** shipped as a direct cutover, not behind a feature flag (the whole point of a flag —
comparing old vs. new behaviour side-by-side under real traffic — wasn't available in an
agent-driven single-environment workflow); `hooks/useRequest.tsx` was not deleted, only the blanket
5-minute cache wrapper on `axiosInstance` that it and everything else rode on was removed, so the hook
itself still exists and is used by several still-unmigrated Phase 5 domains. Two live regressions
introduced by the cutover itself were found and fixed in the same phase: multipart/file-upload bodies
initially 415'd through the JSON-only proxy (fixed — raw `Buffer` forwarding); the pre-login onboarding
token flow initially 401'd through the proxy (fixed — see `bearerTokenOverride` above). Two unrelated
live Redux bugs found and fixed while in this code: both apps' `resetAuth` reducer set
`isLoggedIn: true` (backwards), and admin's `MainLayout.tsx` synchronously redirected to `/login`
whenever the _old_ token cookie was absent — which post-cutover is always true.

> **Update, 27 September 2026: a non-sensitive signed-in indicator cookie, backend-driven.**
> `lemonade-backend`'s `SyncSignedInCookie` middleware (ADR-008) sets/clears
> `lemonade-network-signed-in` on every `/v1/*` response — value always `1`, HttpOnly, never
> authoritative. In this app's BFF architecture the browser never talks to Laravel directly, so that
> Set-Cookie header lands on a server-side axios response inside Next.js and never reaches the browser
> on its own — it had to be explicitly relayed. `@lemonade/api-client` gained an additive
> `requestWithHeaders()` method (keeps the raw response headers alongside the unwrapped data; every
> other existing call site is untouched) plus a small `getSetCookieValue()` helper. Both apps'
> `lib/server-api.ts` gained `syncSignedInCookieFromHeaders()`, called from the BFF proxy (every ordinary
> authenticated call — this is what actually gives the cookie its sliding-window renewal) and from the
> login Route Handler (only on the fully-onboarded branch, not the `needsOnboarding` one — an onboarding
> user has no main httpOnly session, so marking them "signed in" would be the wrong signal for
> `middleware.ts`). The one spot that can't relay a header — a refresh triggered deep inside
> `@lemonade/api-client`'s own interceptor, servicing an unrelated call with no response object to attach
> a cookie to — sets the cookie directly instead, since a successful refresh is exactly the condition
> under which the backend's own `TokenRotationService::rotate()` marks the visitor signed in anyway.
> Logout doesn't need relaying at all: `clearUserSession()`/`clearAdminSession()` now delete this cookie
> alongside the real token cookies they already cleared. `middleware.ts` in both apps now gates on
> `SIGNED_IN_COOKIE` **or** the real token cookie's presence — the `or` matters for a smooth rollout: an
> already-logged-in session has the old cookie but not the new one until its first proxied call sets it,
> and middleware runs before that call ever happens. Admin's middleware needed one extra bit of care: it
> also uses the token's *value* (not just presence) to fetch permissions for section-gating, so only the
> redirect check was widened to the `or`, not the downstream permission fetch, which still requires the
> real token specifically.
>
> Live-verified end to end against the real backend, not just typechecked — real login through both
> apps' actual Route Handlers (`curl`, not a browser) showed the real `Set-Cookie` line for the new
> cookie alongside the existing token cookies; a follow-up authenticated proxy call showed its `Expires`
> moving forward (the sliding window working, not just a one-time set at login); logout showed all three
> cookies cleared in one response; hitting a protected route with no cookies at all 307-redirected to
> `/login`, and the same route with fresh cookies returned 200. Also fixed in passing while touching
> these two files: a stale comment in admin's `server-api.ts` and BFF proxy claiming frontend was "still
> on Next 14 with sync `cookies()`" — both apps have been on Next 15 (async `cookies()`) since Phase 3;
> the comment had just never been updated.

### Phase 5 — Server state, domain by domain **[MUST]** **[COMPLETE — 19 of ~19 domains]**

The largest phase. Migrate in this order — lowest risk first, money last, once the pattern is proven.

- TanStack Query providers; key factories; the staleness policy from §11
- Order: Reference data → Discovery → Events → Tribes/Forum → Business → Connect → Profile/Settings →
  **Wallet, Transactions, Subscriptions, Payouts last**
- Per domain: characterization test → queries/mutations → migrate consumers → delete the slice → ship
- Migrate that domain's forms to RHF + Zod in the same pass; delete `checkError.ts` when the last
  consumer goes
- Retire `Skeletons.tsx` and `tableData.ts` incrementally as their features migrate
- Ends with redux-persist holding nothing but small client preferences

**Status:** Started, both apps have `QueryClientProvider` wired (`redux/QueryProvider.tsx`, wrapping
the existing Redux `Provider`, not replacing it — Redux keeps everything not yet migrated). Domains
done so far, each with a hierarchical key factory and live-verified against the real backend through
the actual BFF proxy (not just typechecked): **auth/session** (both apps — `useCurrentUserQuery`/
`useCurrentAdminQuery`, `useLoginMutation`, `useLogoutMutation`), then, **admin only**: **dashboard**
(1 query), **wallet** (3 queries, 4 mutations — the first money domain), **reporting** (2 queries, 2
mutations), **profile** (1 query), **exports** (1 mutation — a one-shot CSV download, not cacheable
server state, plus its own pass-through proxy route since the backend streams raw CSV, not the standard
JSON envelope `browserApi` expects), **announcements** (2 queries, read-only — create/edit aren't wired
to anything in the UI yet), **team** (2 queries, 1 mutation), **transaction** (3 queries, no mutations —
a pure reporting domain; its wallet-detail query reuses the wallet domain's own hook instead of
duplicating it, since it's the exact same backend endpoint), **user** (4 queries, 3 mutations —
list/detail/affiliate-detail/account-info, plus suspend/deactivate/reactivate; two dead cross-domain
`userAction` imports found in `modals/events/{Suspend,Delete}Modal.tsx` and removed — only referenced
from a commented-out line in both; also surfaced a pre-existing backend bug, not fixed here — the
affiliate list is built from the `Referrer` model but its detail endpoint looks the id up in the
unrelated `Affiliate` table, so most row clicks 400 with "Affiliate not found," same as the old axios
code — needs a backend/product decision, not a frontend fix), and **events + promotion** (both slices
in `features/events/` migrated together in one pass since they shared a folder and the events page
composes both: 4 queries covering the events list/detail plus the affiliates and promotions-queue tabs,
and the separate promotions catalog `add-promotions/page.tsx` uses; 7 mutations — suspend/activate/
delete-event, update-commission-charge, and create/update/delete-promotion. Two real bugs found live-
testing and fixed as part of the migration, not just noted: `deletePromotion`'s old fulfilled handler
filtered the cached list by `payload.data.id`, a field the backend never actually returns (it returns
`{deleted: true}`), so a deleted promotion never disappeared without a manual reload — fixed by
mutations owning their own invalidation, same class of fix as team's `AddMemberModal`; and promotion
create/update sent `price` as a string, which crashes `Money::fromUnits()` (`int|float` only) with a
500 — confirmed live both ways, fixed by coercing with `Number(...)` before sending. One bug found and
left alone, needing a product decision: `CreatePromotionRequest`/`UpdatePromotionRequest` both require
an `image` field `CreatePromotionModal.tsx`'s form never collects, so every create/update 422s —
confirmed live; fixing it means adding real image-upload UI, out of scope for a transport migration).
Each migration deleted its old `*.slice.ts` outright and removed the reducer from
`store.ts`, per this phase's own rule that a feature never exists in both patterns at once.
**Named deviations from the plan:** the prescribed migration order (reference data → discovery → ...
→ wallet/transactions/subscriptions/payouts _last_) was not followed — auth went first (reasonable,
everything else depends on it), then dashboard and reporting (small, low-risk, matching the plan's
spirit), but **wallet went third**, ahead of most non-money domains, because it was the next domain
picked without re-consulting this ordering. It was treated with the care the plan asks of money
domains regardless (staleTime 0, invalidate-not-optimistic on every mutation), and its live-testing
paid for itself: it surfaced two real backend bugs meaning the admin wallet credit/debit feature had
_never actually worked_ from this UI (fixed in `lemonade-backend`, tests added). Forms were **not**
migrated to React Hook Form + Zod in the same pass as their domain, contra the plan — every migrated
domain kept its existing Formik + Yup forms untouched; `checkError.ts` is still in use.
`tableData.ts` retirement done (2026-09-21) — 16 of its 30 exports had zero real consumers left
(confirmed per file, not just by export name, since several files imported a live header alongside a
dead fixture-data array) and were deleted; the rest are real column headers, still rendered, kept.
`tribeTlnData`/`tribeTlnHeaders` stay too — "TLN Tribes" has no backend equivalent, so it's intentional
placeholder UI, not dead code. `Skeletons.tsx` no longer exists in the codebase at all — the doc's own
reference to it was stale. **All of `apps/admin`'s tracked Phase 5 domains are now on TanStack Query**
— no `features/*/*.slice.ts` files remain under `apps/admin`.
(`redux/general.slice.ts` was never one of the tracked domains and turned out to be fully dead — no
importers anywhere, not even wired into `store.ts` — found while checking for stragglers; deleted
2026-09-21.)
`apps/frontend`'s **dashboard** domain is now migrated too (3 queries — tribes/events/businesses, no
mutations, single consumer `app/(main)/page.tsx`; `staleTime: 5*60_000`, CLAUDE.md's "discovery content"
bucket, since this is public trending/featured content rather than user-owned data). Reused the existing
shared `TribeInterface`/`EventInterface`/`BusinessInterface` from `src/interfaces/` rather than
hand-rolling new response types — those are pre-existing, widely-used types outside this domain (the
still-unmigrated tribes/events/business domains own them), and live-testing surfaced they're already a
bit stale against the real backend response (e.g. `monetized` comes back as a JSON boolean, the
interface types it `number`) — not fixed here, since rewriting a shared interface is that domain's call
when it migrates, not a side effect of migrating dashboard. **settings** (the profile/wallet/payout
sub-domain of `features/settings/`) is migrated too — 2 queries (profile, wallet — `staleTime: 60s` and
`0` respectively, the latter CLAUDE.md's money bucket), 2 mutations (request-payout, create-bank-account)
— plus a small **shared** package stood up alongside it (`features/shared/`: `useBanksQuery`,
`useVerifyAccountMutation`) since two of settings' own modals needed the same banks-list/account-
verification endpoints. Scoped narrowly to what `profile.slice.ts` and the direct `settingsApi`
consumers actually used — `ProfileController` owns ~30 more routes (notification settings, subscription/
billing, account deletion, per-field profile edits) that other pages still reach via the legacy
`useRequest` hook or haven't touched at all; explicitly not migrated in this pass, tracked as its own
follow-up. Confirmed live that `getUserProfile`'s old `token` parameter was already fully dead — the BFF
proxy independently reads the same `newToken`/`ONBOARDING_TOKEN_COOKIE` server-side for exactly this
pre-session case, regardless of what the client sends (see `app/api/v1/[...path]/route.ts`) — removed.
**Two real bugs found and fixed**: `RequestPayoutModal.tsx` is shown exactly when a user has no bank
account yet, collects bank_name/account_number/account_name, and its own success copy said "Error
creating account" and dispatched `updateHasBankAccount()` — every sign it was always meant to create a
bank account — but called `requestPayout` (backend only accepts `amount`/`bank_account_id`) instead of
`createBankAccount`, so it could never have worked; confirmed live pre- and post-fix, then found a
second: `GeneralController::getServicingBanks()` (backend) returned a bare `['banks' => ...]` array
instead of the standard envelope, so it silently returned `undefined` through the new typed transport
(the old `useRequest` hook had a literal `?? response.data.banks` fallback for this one endpoint) —
fixed in `lemonade-backend`, confirmed live both as a raw curl and through the BFF proxy. **One bug found
and left alone**, same class as admin's promotion-image gap: `settings/profile/page.tsx`'s avatar upload
checked `data.status` instead of `data.success` (the real envelope key), so a successful upload always
showed an error toast — this one-line check was fixed (it doesn't touch transport), but the upload call
itself stays on `axiosInstance`/`sharedApi.uploadFile`, not migrated to `browserApi`, since there's no
Cloudinary credential locally to live-verify a multipart transport change against. **transaction** is
migrated too (1 mutation — `verifyTransaction`, a one-shot Paystack-redirect confirmation triggered by a
`trxref` query param, not cacheable server state, same shape as admin's exports domain) — its `getBanks`
thunk was a straight duplicate of `features/shared`'s `useBanksQuery` (same endpoint) and was dropped
rather than migrated twice; both real consumers (the settings and events domains' separate
`BankAccountModal.tsx` components) now share the one shared query. Found and fixed a real backend bug
along the way, same class as the two above: `VerifyTransaction`'s success check only recognized
`Transaction::status` values `'completed'`/`'pending'`, but different payment paths write different
affirmative strings — `FinalizePayment` writes `'success'`, `PaystackService` writes `'successful'` — so
a transaction finalized through either Paystack path always reported as unsuccessful to the frontend
regardless of the real outcome; fixed in `lemonade-backend` to recognize all four strings, a
characterization test added, confirmed live pre- and post-fix against a real transaction row.
**connect** (chat/connections) is migrated too — the most architecturally involved domain so far:
4 queries (chat history, one open chat keyed by receiver, invites, connection info) and 5 mutations
(send-chat, invite-response, find-user, send-invite, update-visibility). The domain mixes ordinary
request/response data with a Pusher-pushed live-append behavior (new chat messages arrive over a private
channel, not just through polling) — the old Redux reducer appended every incoming message to whatever
chat happened to be open, which was only ever correct because the UI shows one conversation at a time; a
push for a _different_ conversation while chat A was open would have landed in chat A's list. The
TanStack version (`features/connect/queries.ts`'s `appendIncomingChatMessage`, called from
`hooks/usePusher.ts`) computes the actual other party from the message itself and writes into that
specific chat's query cache — correct regardless of what's open, and a no-op if that chat isn't
currently cached. Tracing the real-time path required reading through the backend to find that the
"chat" feature (`ChatController`/`ChatList`/`ChatMessage`) and a same-shaped, same-channel, seemingly
unrelated "connect messages" feature (`ConnectController`/`SendConnectMessage`/the `MessageSent`
broadcast event, which broadcasts a _different_ model, `UserMessage`) both exist in the backend — only
the former is what the frontend actually calls; confirmed via `SendChatMessage`, which triggers Pusher
directly (bypassing Laravel's event system) with `OutgoingChatMessageResource`, matching what the old
reducer expected. Not investigated further — a second parallel messaging system, dead or not from this
domain's perspective, is out of scope for a frontend transport migration. Reused the existing
`ChatInterface`/`MessageInterface` from `src/interfaces/ChatInterface.ts`, narrowing `MessageInterface.media`
from a stale `string | null` to the real `string[] | null` (safe — every consumer of that interface lives
inside this same domain, unlike dashboard's `TribeInterface`). Found and fixed the same envelope-key
`data.status`-vs-`data.success` bug in two more places (`OpenedChat.tsx`'s image upload,
`SettingsModal.tsx`'s visibility toggle) — same class as settings' fix, not touching the underlying
upload transport. **Not fully live-testable**: `sendChat`'s POST always 500s locally — `PusherService`
constructs a real `Pusher\Pusher` client and calls `->trigger()` unconditionally on every send,
regardless of `BROADCAST_DRIVER`, and local Pusher credentials are empty — same class of gap as file
upload's missing Cloudinary credential. Verified its response shape via source instead
(`OutgoingChatMessageResource`) and live-verified the other 8 endpoints end-to-end, including creating a
real accepted connection and a real pending invite through the API and exercising accept.

> **Update, checked and fixed 24 September 2026:** this gap is closed on the backend side —
> `lemonade-backend`'s OPS-5/ADR-005 replaced Pusher Cloud with self-hosted Laravel Reverb (wire-compatible,
> no client-SDK change needed) and every environment now has real broadcast credentials, where before
> `PUSHER_APP_ID`/`KEY`/`SECRET` were blank everywhere. `PusherService` is now `ReverbService`, live-verified
> against a running `reverb:start` (handshake + a real publish/subscribe round trip). Both apps'
> `pusherConfig.ts`/`env.client.ts`/CSP were updated to match (`NEXT_PUBLIC_PUSHER_KEY` →
> `NEXT_PUBLIC_REVERB_KEY`/`_HOST`/`_PORT`/`_SCHEME`), so `sendChat`'s POST should no longer 500 locally.
> **Separately found during that verification, closed 24 September 2026:** `SendChatMessage` published
> on the raw channel `chat.{receiverId}` (via `ReverbService`, which — unlike Laravel's `PrivateChannel`
> — never auto-prefixes `private-`), but this hook's `usePusher` subscribes to `private-chat.{receiverId}`
> — the actual wire name Laravel's private-channel convention produces for the `chat.{receiverId}`
> pattern already registered in the backend's `routes/channels.php`. Different channels on the wire, so
> a message published this way never reached this subscriber — predates the Reverb migration (identical
> mismatch existed on Pusher Cloud) but is the same fix as the `request.{userId}` one below: pass the
> `private-` prefix explicitly to `ReverbService`, since it won't add it itself. Live-verified end to
> end against the real running backend and Reverb — a real receiver-side private-channel subscription
> (real `/broadcasting/auth` signature, not mocked) now actually receives `message.sent`, with the real
> message content, when the sender posts to `POST /v1/user/messages`. `SendChatMessageTest` now asserts
> the exact channel/event instead of just that the mock was called.
>
> **A second, separate channel gap found and closed 24 September 2026:** `LayoutWrapper.tsx`
> (mounted in the root layout, so on every authenticated page) unconditionally calls
> `usePusher(\`request.${user?.id}\`, "request.service")` — a business-service-request notification
> subscription. Two real bugs, not one: (1) `routes/channels.php` never registered a `request.{id}`
> channel at all, so every page 403'd on `/api/broadcasting/auth`; (2) even with auth fixed,
> `RequestBusinessService` published on the raw, unprefixed channel `request.{ownerId}` via
> `ReverbService` (which — unlike Laravel's `PrivateChannel` — never adds `private-` automatically),
> while the frontend always subscribes with that prefix. Same mismatch class as `SendChatMessage`'s,
> above — `routes/channels.php` now registers `request.{userId}`, and `RequestBusinessService`
> published on `private-request.{ownerId}` to match. `RequestBusinessService` had zero test coverage
> before this — added `tests/Feature/Business/RequestBusinessServiceTest.php` plus two closure-level
> authorization tests in `BroadcastAuthTest.php`. Live-verified against a real running backend, not
> just the test suite: a direct `POST /broadcasting/auth` for `private-request.{ownerId}` now returns
> 200 with a real auth signature for the channel's owner, and 403 for a different real user.
>
> **Unified onto `Broadcast::channel()` properly, 24 September 2026.** Both fixes above were a
> `private-` string typed by hand into a raw SDK call — the same manual-prefix mistake was always one
> edit away from recurring. `SendChatMessage` and `RequestBusinessService` now dispatch real
> `ShouldBroadcastNow` events (`App\Events\ChatMessageSent`, `App\Events\BusinessServiceRequested`),
> matching the pattern `BuyTicket`/`MessageSent`/`TypingEvent` already used — a `PrivateChannel` adds
> `private-` itself, so the whole bug class is now structurally impossible here, not just fixed at the
> two call sites that happened to be found. `App\Services\Shared\ReverbService` (the raw-SDK wrapper)
> is deleted — both its consumers are gone, and grep confirms nothing else used it. Both actions'
> tests moved from mocking a service call to `Event::fake()` + `Event::assertDispatched()`, matching
> `SendTypingIndicatorTest`'s existing convention. Re-verified live end to end through the new path —
> same real subscribe/send/receive round trip as above, now via the event dispatcher instead of a
> direct SDK call.
>
> **Found while tracing this, removed 25 September 2026.** `App\Events\MessageSent` broadcast on this
> exact same channel/event pair (`chat.{receiverId}` / `message.sent`) for a second, entirely separate
> messaging domain — `ConnectController::sendMessage` → `SendConnectMessage` → `UserMessage` (Connect's
> "current location-based" flow, per that route file's own comment, as opposed to `ChatController`'s
> flow this section covers). Re-verified before removing: a repo-wide grep across both frontend apps'
> current source, and the older pre-monorepo frontend, found zero calls to `/user/connect/send-message`,
> `/user/connect/get-messages`, or `/user/connect/get-message-logs` — only `ConnectController::index`,
> `findUser`, and `updateVisibility` have live frontend consumers (`features/connect/api.ts`). Confirmed
> dead and removed: `SendConnectMessage`, `GetConnectMessages`, `GetConnectMessageLogs`,
> `SendConnectMessageData`, `SendConnectMessageRequest`, `ConnectMessageResource`,
> `ConnectMessageLogResource`, `MessageSent`, `UserMessage`, `UserMessageFactory`, their 3 route
> registrations, and their 3 tests (13 files deleted total). The `user_messages` migration/table was
> left in place — schema drops are a separate, more destructive decision from dead-code removal. This
> closes the latent channel-collision risk noted below: `ChatMessageSent` is now the only publisher on
> `chat.{receiverId}`/`message.sent`. `packages/api-types` regenerated to drop the now-gone
> `userConnectRoutes.MESSAGE_LOGS`/`MESSAGES`/`SEND_MESSAGE` constants and the `SendConnectMessageRequest`
> type; both apps typecheck/lint/build clean against the regenerated types.
**business** (the job-marketplace domain: business listings, job requests, job payments) is migrated
too — the largest single domain this session by consumer count (16 files). 4 queries
(businesses/listings/detail/jobs-data), 12 mutations. `getListing`/`GetBusinessListing` had zero real
consumers — dropped rather than migrated, same rule as every other dead-code find this session. The
slice's `job`/`addJob` global state (set from several independent places — a job lookup, a payment-
verification redirect, a completion action — read from others) isn't server data, so it moved to
`redux/tempSlice.ts` as `selectedJob` rather than into a query cache; `useGetJobMutation`'s callers
`dispatch(setSelectedJob(...))` where the old code dispatched `addJob`. Deduplicated one real duplicate
read along the way — `edit-business/page.tsx`'s own `useRequest('/user/business/:id')` was the exact
`getBusiness` endpoint, now shares `useBusinessQuery`. Left `business-categories`, `business-reviews`,
`listing/boosts`, and the business/listing `verify-payment`/`verify-business-boost` raw-axios calls on
the legacy path — none are wired to `business.slice.ts`, same scoping rule as settings' ~30 leftover
`ProfileController` routes.

This domain surfaced more real bugs than any other this session, of increasing depth:

1. **Fixed**: `BoostBusiness` (backend) returned the whole Paystack payment-init array under `payment`,
   but the frontend does `window.location.href = result.payment` expecting a URL string — `PayForJob`
   (the sibling action for job payments) already extracts `authorization_url` correctly; `BoostBusiness`
   didn't. Fixed to match. Confirmed via a direct-action test (see caveat below).
2. **Found, not fixed — needs a decision, and it's deeper than #1**: `BoostBusinessRequest` validates
   `package` as `numeric`, and `BoostBusinessData` types it `float`, but the frontend sends
   `Boost::id` — a UUID string. The real HTTP endpoint 422s on this before the action ever runs, so
   boosting a business cannot work at all today, independent of the `payment` field bug just fixed.
   Fixing it means changing a validated request contract (and possibly the DTO type), not a one-line
   change — left alone. (A characterization test for the `payment` fix was written, then deleted once
   this second bug made it impossible to pass without also fixing the contract — the action can't be
   reached with a real package id via its own typed DTO.)
3. **Fixed (2026-09-21)**: `UpdateBusiness` called `findBusiness($id)` with the default `approvedOnly:
   true`, so a business owner could only edit their own listing once an admin had approved it — a
   newly-created (`PENDING`) listing couldn't be edited at all, the most common time someone would want
   to. Every sibling action in the same file (approve, reject, suspend, reactivate, delete,
   get-application) already passed `approvedOnly: false`, matching the trait's own doc comment ("the
   owner's own views... pass false") — confirming this was a missed argument, not a deliberate
   restriction, not just a guess. `Gate::authorize('update', ...)` right after is what actually enforces
   ownership, so the flag was never doing security work here. Fixed with a one-argument change plus a
   regression test (`owner_can_update_a_pending_business_before_its_approved`) that fails with the
   old behavior and passes with the fix — confirmed both ways, not just added. 530 backend tests pass.
4. **Found, not fixed — needs a broader audit, not a guess**: comparing `ServiceRequestJobResource`
   (backend) against what `JobsCard.tsx`/`ServiceDetailsModal.tsx` actually read turned up several
   field-name mismatches (backend `is_owner` vs frontend `job.isOwner`; `additional_info` vs
   `job.additional_information`; `business.city`/`business.country` read as `job.city`/`job.country`
   directly). Too many, and too consistently one-directional, to be a single mechanical typo — reads
   like the resource changed after this part of the frontend was last touched. Left `Job`/job-list types
   as `unknown` rather than guessing which side is authoritative; existing job components already type
   `job: any`, so this preserves current (likely broken) behavior without the migration silently
   papering over it.

Live-verified list/detail/listings/jobs-data/filter and a real create+update round-trip (the update
round-trip needed a business created directly via tinker with `status: ACTIVE`, since the demo user
owned no approved business — see finding #3) through the real frontend BFF proxy.

**tribes** (tribes/threads/comments/polls — the community forum domain) is migrated too — 5 queries
(tribes-by-type, tribe detail + its threads, threads, pinned threads, tribe categories) and 13
mutations. The single biggest thing this domain's live-testing surfaced: **the backend identifies the
same tribe two different ways depending on the endpoint**, and nothing in the route list or either
app makes that visible. `GetTribe`/`ProcessTribeJoin`/`ListTribeThreads`/`GetPinnedTribeThreads`/
`AddTribeMember` all resolve their `{id}`/`{forum}` route param as a **slug** (`findTribeOrFail`/
`findTribeBySlugOrFail`), but `CreateTribeThread` (`Tribe::query()->find($tribeId)`) and
`SortTribeThreads` (`findTribeByIdOrFail`) resolve the _same-shaped_ `{forum}` param as the tribe's
**raw id** — confirmed live: `POST .../threads/create-thread` 400s "Tribe not found" against the slug
and 200s against the id. `ThreadController`'s routes (`post-like`, `post-comment`, `poll-action`) are
raw-id-only too. Since `useThreadsQuery`/`usePinnedThreadsQuery` are (correctly) keyed by the slug —
it's the identifier the page URL and `getTribe`/`getThreads` actually use — every mutation that needs
the raw id for its own request (`useCreateThreadMutation`, `useFilterThreadsMutation`,
`useSubmitVoteMutation`, `usePostCommentMutation`, `useLikeThreadMutation`) takes the slug at hook
creation time (for its cache-key writes) and the raw id separately, at call time (for the request) —
documented inline in `features/tribes/mutations.ts`. Getting this wrong doesn't 4xx (the request itself
still succeeds off the id) — it silently writes the mutation's cache update into a query key nothing
is reading, so the UI never reflects the change until an unrelated refetch. A second, smaller backend
oddity in the same family: `ThreadController::pinThread` puts the _thread object_ under the data key
`'message'` and uses the pinned/unpinned wording as the envelope's top-level `message` instead — which
`browserApi`'s `unwrap()` discards, keeping only `data`. So the response the frontend receives carries
the thread but no signal of which way the toggle went; `usePinThreadMutation` works around it by having
the caller pass in the thread's `pinned` state from _before_ the call and flipping it, rather than
trying to read the direction back from the response (confirmed live via a real pin/unpin round-trip).
**One real bug found and fixed in `lemonade-backend`, not just noted**: the frontend's tribe-join
payment verification called `axiosInstance.get('/tribes/payment/verify?reference=...')` — a route that
has never existed in the 290-route contract (flagged, unfixed, in three earlier Phase 5 passes, this
one included at first). Tracing `ProcessTribeJoin`'s `PaymentService::initialize` showed it writes the
exact same `Transaction` row (keyed by `trx_ref`) that every other payment path writes — the same one
`VerifyTransaction` (already migrated as the `transaction` domain's `useVerifyTransactionMutation`,
already used by `events` for its own payment-redirect confirmation) reads. So this was never a
route the backend was missing; it was a frontend call to the wrong endpoint. `tribe/[id]/page.tsx`'s
`trxref` handler now calls `useVerifyTransactionMutation` like `events` does — confirmed live end-to-end
(a real Paystack `initialize` call through `join-tribe`, then a real `verify-transaction` call against
the resulting `trx_ref`). Also found and fixed the recurring `data.status`-vs-`data.success` envelope-key
bug in `CreateTribeModal.tsx`'s and `CreateThreadModal.tsx`'s upload handlers (same class as settings'
and connect's fixes, transport untouched). Found and removed: three dead cross-domain imports
(`verifyTribePayment` imported but never called in both `event/page.tsx` and `event/[id]/page.tsx` —
`events` already gets its own payment verification from `useVerifyTransactionMutation`; `likeThread`
imported but never called in `event.slice.ts`), a dead `handleJoinTribe` function in
`TribeDetailsCard.tsx` (the tribe-details "Join tribe" button actually opens `JoinTribeModal`, which has
its own working copy), a dead lowercase `shareTribeModal` duplicate import and a stray debug
`console.log({tribe})` in `tribe/[id]/page.tsx`, a stray `@babel/types` import in `AddMemberModal.tsx`,
and a large dead inline formik create-tribe form in `tribe/page.tsx` (the real one lives in
`CreateTribeModal.tsx`; this one was never wired to any rendered `<form>`). `getComments`/`GetTribeThreadComments`
had zero real consumers — thread comments arrive embedded in `ThreadResource.all_comments` already —
dropped rather than migrated, same rule as every other dead-code find this session. `Thread.all_comments`
was typed `string[]`; retyped to a proper `ThreadComment` interface matching `ThreadCommentResource`
(safe — every consumer of `Thread` lives inside this domain). Live-verified every endpoint (list by
type, detail, threads, pinned, categories, create-tribe, create-thread, like, comment, pin/unpin, sort,
search, add-member, delete-thread, join-tribe + verify-transaction) through the real BFF proxy, not just
against the backend directly.

**events** (the largest domain by far: 897-line slice, 26 endpoints, 24 real consumers) is migrated too
— 15 queries, 15 mutations, plus a slimmed-down `event.slice.ts` that keeps only genuine client-only
wizard/cart state (the create-event → add-ticket → BankAccountModal draft, the buy-ticket →
assign-ticket ticket cart, per-event referral codes — all persisted, all carried across route
navigations, none of it server data). `getMyTickets`/`getMyTicket` weren't reached through the slice at
all — `SideMenu.tsx`'s "My tickets" panel called them directly via the legacy `useRequest` hook, a real
live consumer grep-for-the-slice's-thunks wouldn't find; migrated too since they're the same domain and
already surfaced (same lesson as tribes' `viewProfile`/`createThread` id-vs-slug split: name-based greps
miss real consumers that reach a domain's routes through a different door). `deleteEvent` has zero real
consumers — dropped, matching every other dead-code find this session. `check-ins/page.tsx` turned out
to be an orphaned duplicate of `guest-list/page.tsx` (same thunks, no search, never linked from
anywhere in the app, confirmed via a repo-wide grep for the string `check-ins`) — left in place and
migrated rather than deleted, since removing a whole route is a product call this migration shouldn't
make unasked, but worth a cleanup pass later.

**Six real bugs found live-testing and fixed as part of the migration** (the recurring
`payload.status`-vs-`payload.success` envelope-key bug, this domain's worst offender yet — each of
these made a real feature silently no-op even though the underlying backend call succeeded):
editing an event's own submit handler (`edit-event/page.tsx`) always fell into the error branch, so a
successful edit never redirected or showed success; the ticket-editor's submit (`add-ticket/page.tsx`)
had the same shape; publishing a draft event (`OrganizerEventCard.tsx`) moved the event server-side but
never closed the menu or showed the confirmation toast; paying for a promotion
(`promote-event/page.tsx`) never redirected to Paystack even on a real successful init; generating an
affiliate link (`agent-details/page.tsx`) never showed the link or closed the "generating" state;
checking in a guest (`GuestSideMenu.tsx`) checked the guest in server-side but the modal never
confirmed it happened. Fixed by switching each to the mutation's own `onSuccess`/`onError`, the same
structural fix this bug class has gotten in every other domain this pass.

**One real bug found and fixed in `lemonade-backend`, not caught by any earlier domain's live-testing**:
`GetUserEvent`'s owner-only breakdown (shown on the organizer's own event-detail page) 500'd for the
first time this session hit it against a real event with a real ticket —
`InteractsWithEvents::totalTickets()`/`singleTicketRev()`/`singleAffiliateTicketRev()` all sum a query
builder column (`Ticket::sum('ticket_stock')`, `AssignedTicket::sum('tickets.price')`) and are typed
`int|float` under `declare(strict_types=1)`, but MySQL's `SUM()` returns a DECIMAL aggregate that PDO
hands back as a numeric string (or `null` with zero matching rows) — either shape violates the return
type. Every earlier live-test of this domain happened to use events with no tickets or non-owner
viewers, so this path was never actually exercised until now. Fixed with an `(int)` cast on all three
(minor-unit integers throughout this codebase, matching the pattern), confirmed the 500 reproduces
pre-fix and is gone post-fix, added `tests/Feature/Event/GetUserEventOwnerViewTest.php`. Full backend
suite (512 tests), PHPStan, and Pint all still clean.

**One bug found live-testing and deliberately left alone, same class as business's boost-package
mismatch**: `PromoteEventRequest` validates `promo` as `numeric`, but `Promotion::id` is a UUID string
and the frontend sends exactly that (`selectedPromotion.id`) — confirmed live, a real promote-event
call 422s with "The promo field must be a number" before `PromoteEvent`'s action ever runs. This means
promoting an event has probably never worked through this UI. Fixing it means changing a validated
request contract, not a transport-migration fix — left alone, documented here and in a code comment.

**A genuine double-wrapped response shape, documented rather than "fixed"**: `GetAffiliateDashboard`
returns `[[ 'total_commission' => ..., 'tickets_sold' => ..., 'promotions' => ..., 'find_events' => ...
]]` — a numeric array wrapping one object, not the object directly. The pre-migration frontend already
depended on this exact shape (`reduce`-ing over what's really a one-element array); `AgentSectionView`
now reads `affiliate_data?.[0]?.total_commission` directly instead, same behavior, typed honestly
(`AffiliateDashboardResponse` is a 1-tuple, not an object) rather than guessing the double-wrap was
unintentional and changing a live response shape as a side effect of a transport migration.

Live-verified nearly every real endpoint end-to-end — event list/detail (both owner and non-owner
views), organizer list, promotions catalog, payment settings, affiliate list/detail/data, create-event,
update-event, publish-event (draft → pending), edit-tickets, guest-list, guest-details, guest-search,
check-in, buy-ticket (a real Paystack `initialize` for a paid ticket), generate-affiliate-link, and
search/filter — through both the backend directly and the real frontend BFF proxy, specifically to catch
the same id-vs-slug-shaped traps tribes surfaced. Test events, tickets, attendees, orders, payments, and
tokens all cleaned up after. **Not live-tested**: `promote-event`'s actual payment redirect (blocked by
the numeric/UUID validation bug above, same as the tickets_sold breakdown, description), consistent with
this session's rule of not working around a bug it isn't this migration's place to fix.

The **non-login/logout `authSlice` thunks** (11 of them: OTP verification/resend, forgot/reset password,
6 profile-field edits, change-password, change-profile-image, delete-account, notification settings,
subscription change/lookup) are migrated too, into `features/authentication/{api,queries,mutations}.ts`
alongside the existing login/logout/current-user hooks — **this closes out Phase 5 for every tracked
domain in both apps.** `authSlice.ts` is slimmed to pure client state (the logged-in user snapshot
mirrored from `useCurrentUserQuery`, a pending subscription-downgrade reason, which plan is mid-
selection) — no thunks, no server data.

The pre-login onboarding calls (OTP verify/resend, password reset) don't take a token param anymore —
they used to build a manual `Authorization` header from a token threaded in as an argument, which
`browserApi`'s interceptor would just strip (it unconditionally overwrites any caller-supplied
Authorization header). Removing that param isn't a corner cut: the BFF proxy already reads the
JS-readable `ONBOARDING_TOKEN_COOKIE` ("newToken") server-side as a fallback bearer token whenever
there's no main session cookie (the fix that shipped for `getUserProfile` in an earlier Phase 5 pass,
here applied consistently to the rest of the onboarding flow).

**Four real bugs found and fixed**, on top of the recurring `payload.status`-vs-`payload.success`
envelope bug (present in essentially every handler in this domain — forgot-password, reset-password,
resend/verify OTP, delete-account, update-app-settings, update-profile-field, change-password,
change-profile-image, generate-affiliate-link-shaped upgrade-plan flow — all silently no-op'd on real
success before this pass, same as every other domain's version of this bug):

1. **Token rotation on password reset, found live-testing, not by inspection.** `check-otp`
   (`VerifyForgotPasswordAction`) deletes the very token it was called with and issues a _new_ one
   scoped to a different ability (`password_reset`, not `password_reset_verification`) — confirmed live:
   calling `reset-password` with the original `newToken` cookie value 403s "Invalid Token" even though
   `check-otp` itself just succeeded with that same token. `verify-code/page.tsx` never carried the new
   token forward into the cookie. Fixed by overwriting `newToken` with the response's `token` in
   `verifyOtp`'s success handler before navigating to `/reset-password` — confirmed live end-to-end
   (forgot-password → check-otp → reset-password with a real OTP, using `MAIL_MAILER=log` locally per
   the established local-testing workaround).
2. `ChangeUserSubscriptionPlan`'s paid branch returned the whole Paystack init array under `payment`
   instead of the URL `UpgradePlanModal.tsx` navigates to — same bug shape as `BoostBusiness`, fixed the
   same way (extract `authorization_url`, surface `reference` alongside it). Confirmed live pre/post-fix;
   existing test only asserted the key was present, not its shape, so it slipped through — tightened.
3. `UpgradePlanModal`'s free-plan-switch branch treated "no `payment` field" as an error, even though a
   free-plan switch applies immediately server-side and genuinely has no payment step — fixed to show a
   real success toast instead of a false error.
4. `PricingCard.tsx` dispatching a per-click subscription-detail fetch that fed a modal rendered by the
   _parent_ page was structurally awkward under Redux (write to `state.auth.pricing`, read it back in a
   sibling) — the mutation now lives in `settings/plan/page.tsx` and is passed down as a callback, which
   is what surfaced (and let disprove) an initial false alarm: `SubscriptionResource` nests a real
   `pricing` array inside the single `subscription` object it returns, and the parent already unwraps
   `result.subscription.pricing` before handing it to `UpgradePlanModal` — not the single-object-vs-array
   crash it looked like from `api.ts` alone; corrected before it became a permanent wrong comment in the
   codebase.

**Two bugs found and deliberately left alone**, needing a product/security decision, not a transport fix:

1. Account deletion cannot work from this UI at all, for two independent reasons: `DeleteAccountRequest`
   requires a `confirmation` field (exact string "DELETE") that `ConfirmDeletePage`'s form never
   collects (it only sends `password`, which the backend doesn't even validate); and even with that
   fixed, the route requires a Sanctum token scoped to the `account_deletion` ability specifically —
   confirmed live, the user's normal session token gets "Invalid ability provided" — which only exists
   after a separate OTP-confirmation flow (`request-account-deletion` → `verify-account-deletion`) that
   has no UI anywhere in this app. This is a missing feature, not a one-line fix.
2. `ResendAccountOtp` (backend) hardcodes `OtpType::EMAIL_VERIFICATION` — the password-reset
   ("verify-code") flow's "Send code again" calls this same endpoint, likely resending the wrong kind of
   OTP for that flow. Not fixed — a backend action/routing decision, not a transport migration's call.

Live-verified nearly every endpoint end-to-end through both the backend directly and the real frontend
BFF proxy: change-username/bio (real field edits), change-password (correctly rejecting a wrong old
password), forgot-password → check-otp → reset-password with a real generated OTP and the token-rotation
fix, resend-otp and verify-otp for the email-verification flow (the exact `newToken`-cookie-only path,
no manual header), update-app-notification-settings (confirmed the frontend already sends the right
per-category `type` enum value — an initial assumption from reading the modal component in isolation,
without its parent, was wrong and corrected before being documented as a bug), change-plan for both a
real paid plan (Paystack authorization URL) and the free-plan-switch branch, and get-subscription-plan.
Test users' state (password, username, bio, email-verification flag, tokens, OTPs, notification
settings) restored after; `MAIL_MAILER` temporarily flipped `smtp` → `log` to test the OTP flows locally,
same as previous sessions' documented workaround, then reverted.

**This closes out Phase 5 for every tracked domain in both apps.** Everything that reads or writes
`/v1/*` server data now goes through TanStack Query + the BFF transport. redux-persist still holds more
than client preferences in a couple of deliberate places (events' own wizard/cart state, noted above) but
no feature exists in both the old and new pattern at once — Phase 5's core rule holds project-wide.

**The "Tier 2" dead-weight cleanup** (not one of this document's original bullets, but directly serves
this phase's "no feature in both patterns" rule): every non-auth domain's Redux thunks and
`features/x/api.ts` services threaded a `token`/`authToken` parameter left over from before the
httpOnly cutover, used to build a manual `Authorization` header the BFF transport now ignores and
replaces server-side. Removed across ~100 files in both apps, done and committed, with one deliberate
exception preserved: the pre-login onboarding flow's distinct `newToken`-based calls (see Phase 4
above) — those were initially miscategorized as dead weight, caught before landing, and left alone.

### Phase 6 — Server Components & performance **[SHOULD]** **[MOSTLY DONE — 26 of ~45 frontend pages (rest verified non-candidates); admin, dead-dep cleanup, lazy-loading, bundle budgets, Lighthouse CI, and server-side pagination (backend + admin frontend, §22 Conflict 1) all done]**

Now possible, because auth is server-readable and data fetching is query-shaped.

- User app: `(public)` route group — event, tribe, business, discover as Server Components with metadata
  and Open Graph
- Admin: server-render list shells, keep tables as client islands
- Server-side pagination as backend endpoints land it; move page/sort/filter state into `searchParams`
- Lazy-load heavy leaves; add bundle budgets and Lighthouse CI to the PR pipeline

**Status:** One real finding before any code: there is no `(public)` route group today, and there
never has been — `middleware.ts`'s `PROTECTED_PREFIXES` gates `/event`, `/tribe`, `/business`,
`/settings` and `/` (root) behind login entirely. Every one of frontend's 45 pages is a Client
Component today (confirmed by checking each `page.tsx`'s first line); admin has 6 of 31 already
server-rendered. So the first bullet's literal ask — public event/tribe/business pages with real
Open Graph metadata — is blocked on a genuine product/access-control decision (should an
unauthenticated visitor be able to view these at all? today they're redirected to `/login`), not an
implementation detail, and wasn't decided or acted on here.

What Server Components buy independent of that question — faster first paint for already-logged-in
users, no change to who can see what — was pursued instead. The pattern is proven on the exact
"event, tribe, business" trio the first bullet names for detail pages:
`app/(main)/event/[id]/details/page.tsx`, `app/(main)/tribe/[id]/page.tsx` and
`app/(main)/business/[id]/page.tsx` are all real async Server Components now. Two reusable pieces
came out of the first conversion and held up unchanged across all three: `lib/query-client.server.ts`
(one `QueryClient` per request via React's `cache()`, the standard prefetch-then-`<HydrationBoundary>`
pattern) and a `features/<domain>/api.server.ts` convention (a server-side twin of only the
endpoint(s) actually prefetched — one for events and business, three for tribes, run concurrently via
`Promise.all` since that page's data comes from three separate queries — calling the backend directly
via `lib/server-api.ts` instead of the BFF proxy round-trip a Client Component needs). Each existing
Client Component becomes `<Feature>Client.tsx` verbatim, taking the resolved id as a plain prop
instead of unwrapping `params` itself — the `useQuery` hooks inside are completely unchanged, same
staleTime/refetch/invalidation, they just start with data already in cache. Verified beyond
lint/typecheck/build for all three: hit the running production build with a
syntactically-valid-but-backend-rejected session cookie (to get past middleware without real
credentials) and confirmed a full 200 response with real page content and no server error each time —
`prefetchQuery`'s built-in error swallowing falls back to the client query rather than crashing the
page when the server-side prefetch itself fails auth.

Three more pages followed the same pattern, each testing a shape the first three didn't cover:
`event/[id]/guest-list` and `event/[id]/check-ins` both prefetch the same `getGuestList` endpoint
(added once to `features/events/api.server.ts`, reused by both) while leaving their _other_ query —
guest details / guest search — client-only on purpose, since both are `enabled` conditionally on user
interaction (a selected guest, a typed search term) that doesn't exist at request time; there's
nothing meaningful to prefetch for a query gated on state that hasn't happened yet.
`settings/wallet/page.tsx` is the first non-dynamic-route conversion — no `[id]` segment, so the
Server Component takes no params, just prefetches unconditionally (middleware already gates
`/settings` behind login, so there's no client-side `enabled: isLoggedIn` branch to reproduce
server-side). It's also CLAUDE.md's money bucket (`useWalletSettingsQuery`'s `staleTime` is 0) — worth
noting explicitly since it's the first prefetch touching money data: the prefetch only seeds a real
server-fetched snapshot for first paint, the client query is still immediately stale on mount and free
to revalidate normally, so nothing about the staleness policy or "never optimistic for money" changes.

Three more followed, each reusing an existing `api.server.ts` file rather than starting a new one, and
testing the last variation the first six hadn't: `tribe/page.tsx` and `business/page.tsx` are
non-dynamic, tabbed list pages backed by `usePersistentMenuState` (client-only state — no way to read
a returning visitor's persisted tab choice server-side), so each prefetches only its default tab's
query (tribe: `"discover"`, business: `"business"`, matching each page's own fallback) — if a visitor
actually has a different tab persisted, the prefetch is simply unused and that tab's query fetches
normally, never wrong, just occasionally not the tab that renders. `event/[id]/program-details/page.tsx`
is a third single-query detail page, no new wrinkles, confirming the pattern generalizes without
each page needing its own variation.

Four more followed, all reusing existing `api.server.ts` endpoints except one, and confirming the
pattern holds even where the earlier assumptions get stress-tested: `event/[id]/page.tsx` and
`event/[id]/agent-details/page.tsx` reuse the exact query keys `event/[id]/details` and
`program-details` already established (`eventKeys.detail`, `eventKeys.affiliateEventDetail`) — zero
`api.server.ts` changes needed. `event/[id]/page.tsx` also carries a `useEffect` (referral-code capture
into Redux + `sessionStorage`) that had nothing to do with the query itself; it moved into
`EventClient.tsx` unchanged, keyed off the same `id` prop instead of unwrapped `params`, confirming
the split cleanly separates "what needs prefetching" from "what's just client-side behavior colocated
in the same file." `event/[id]/buy-ticket/page.tsx` needed a genuinely new endpoint
(`getEventTicketData`, added to `features/events/api.server.ts`) — the first new addition to that file
since the original three.

`connect/requests/page.tsx` is the first conversion outside `event`/`tribe`/`business`/`settings`, and
the first to surface the `PROTECTED_PREFIXES` gap noted at the top of this section: `/connect` isn't in
that list, so an unauthenticated visitor can reach this route today, unlike every page converted so
far. Investigated rather than worked around: the client query is already `enabled: Boolean(user?.id)`
(Redux-sourced, not server-readable), and `prefetchQuery` already swallows a failed backend call the
same way it swallows a rejected fake-token call on a gated page — so an unauthenticated hit just
produces an unused, silently-discarded prefetch, and the client renders its normal
logged-out/loading state. Verified directly: hit the running production build both with the usual
fake-cookie technique and with **no cookie at all**, confirming both return a clean 200 with no server
error. First `features/connect/api.server.ts` added, one endpoint (`getInvites`).

Five more followed, extending the pattern into edit/create forms and the home dashboard rather than
just detail pages: `business/[id]/edit-business/page.tsx` and `event/[id]/edit-event/page.tsx` both
reuse existing endpoints (`businessServerApi.getBusiness`, `eventsServerApi.getEvent`) — each page's
own record-loading query prefetches server-side, while a separate `useRequest` call on
edit-business (a `/shared/utilities/*` catalog fetch, not a TanStack Query, already noted as
out-of-scope in that file) stays entirely client-side, same treatment as an interaction-gated query.
`event/[id]/add-ticket/page.tsx` and `event/[id]/promote-event/page.tsx` each needed one new
`events/api.server.ts` endpoint (`getEventTickets`, `getPromotions`) — `promote-event` is notable for
being the first prefetched query with no `id` argument at all despite living under a `[id]` route
(the promotions catalog is global; the id is only used later, for the payment redirect).

The home page (`app/(main)/page.tsx`, `DashboardPage`) is the sixth and most structurally different:
three independent queries (`useDashboardTribesQuery`, `useDashboardEventsQuery`,
`useDashboardBusinessesQuery`, each `enabled: isLoggedIn` client-side) all prefetched concurrently via
`Promise.all`, same concurrency pattern `tribe/[id]/page.tsx` established for its three queries back in
the first batch. First `features/dashboard/api.server.ts`. No dynamic params, and middleware already
gates `/` behind login (it's literally in `PROTECTED_PREFIXES`), so — same reasoning as
`settings/wallet/page.tsx` — there's no client-side `enabled` branch to reproduce server-side; the
prefetch runs unconditionally.

`app/(main)/connect/page.tsx` followed the same day, converted alongside `connect/requests` — it
prefetches two of its three queries (`getMessages` for the chat sidebar, `getConnection`), while its
third (`useChatQuery`, enabled only once a chat is actually opened client-side) stays client-only, same
interaction-gated-query rule as `event/[id]/guest-list`. Like `connect/requests`, `/connect` isn't in
`PROTECTED_PREFIXES` either — verified the same way, with and without a cookie.

Nineteen pages converted, all verified the same way (lint/typecheck/build plus a real running server
hit with a syntactically-valid-but-backend-rejected session cookie — and, for both `/connect` routes,
also with no cookie at all — confirming a full 200 with real content and no server error each time).

At the 19-page mark, every `(main)` page with a directly-callable TanStack Query hook was converted;
`event/page.tsx` turned out to be one of them after all — its `useQuery` calls live in child components
(`Events.tsx`/`Organizer.tsx`/`Agent.tsx`), which a page-level-only grep had missed. It converted the
same way as the other tabbed-list pages (prefetch the default "events" tab).

What remained split into three buckets. The user chose to continue by migrating `useRequest` pages onto
TanStack Query — treated as a Phase 5 continuation, not a Phase 6 task by itself, but each migrated page
became a Server Component candidate too, so both happened together:

1. **`business/[id]/boost-business/page.tsx`** — `getBoostPackages` (the `listing/boosts` catalog) added
   to `features/business/api.ts`/`api.server.ts`, `useBoostPackagesQuery` added (CLAUDE.md's reference-data
   bucket, 1h, same as `useBanksQuery`), page converted to a Server Component. The real response type
   (vs. `useRequest`'s untyped `any`) surfaced two genuine possibly-undefined bugs in
   `handleSelectPackage` — fixed with `??` fallbacks, not papered over.
2. **`business-categories`** — a `/shared/utilities/*` catalog endpoint with three real consumers
   (`edit-business`, `add-business`, `BusinessFilter.tsx`), explicitly flagged out-of-scope in Phase 5.
   Added the route constant, `getBusinessCategories` to `features/shared/api.ts`/`api.server.ts`, and
   `useBusinessCategoriesQuery`. All three consumers switched over; `add-business/page.tsx` converted to
   a Server Component (no dynamic params, nothing else to prefetch); `edit-business/page.tsx` (already
   converted) got the same prefetch added alongside its existing business-record one, via `Promise.all`.
3. **`(auth)/profile-setup/page.tsx`** — still deferred, and different in kind from the two above. It
   calls `useUserProfileQuery()` on purpose without a normal session: the comment in that file explains
   the BFF proxy (`app/api/v1/[...path]/route.ts`) falls back to a separate onboarding cookie
   (`ONBOARDING_TOKEN_COOKIE`, read via `bearerTokenOverride`) for this exact pre-session case —
   confirmed by reading that route handler. `lib/server-api.ts`'s `backendApi` (what every
   `api.server.ts` in this phase calls) has no equivalent onboarding-cookie fallback; only the BFF proxy
   does. Converting this page properly means extending shared server-side auth infrastructure, not
   reusing the established per-feature `api.server.ts` pattern — a bigger, riskier change than anything
   else done this phase, so it stays deferred rather than worked around.

One more followed the same day: `business/[id]/jobs/page.tsx`'s own `/user/listing/:id/job-data` call
was the last real per-business `useRequest` read in the business domain. Added
`getBusinessJobData`/`useBusinessJobDataQuery` (reusing the existing `JobsDataResponse` shape
`getJobsData` already defined — same response, just scoped to one listing), converted the page. Typed
data surfaced a real possibly-undefined gap in the revenue stat display — fixed with a `?? 0`, not
papered over, same class of fix as `boost-business`'s.

With this, **every real per-page `useRequest` read in the business and connect domains is now migrated
and converted.** (What's left in that domain per `features/business/api.ts`'s NOTE — `business-reviews`,
the `business`/`listing` `verify-payment` flows — aren't page-level reads with a Server Component
payoff; left alone.)

The user chose to take on the `settings/*` concentration too. Three of the ~30 leftover
`ProfileController` routes had a real page-level read worth prefetching: `settings/notification/page.tsx`
(`notification-settings`), `settings/plan/page.tsx` (the public plan catalog, `/user/subscription` — a
genuinely different endpoint than the current user's own subscription, confirmed by reading the backend:
a separate `SubscriptionController` at `/user/subscription`, distinct from `ProfileController`'s
`/user/profile/subscription`), and `settings/billing-history/page.tsx`. All three migrated and
converted.

Where these landed surfaced a real architecture decision, not just a mechanical port: the natural
home looked like `features/settings` (same domain as `useUserProfileQuery`/`useWalletSettingsQuery`),
but the existing mutations for two of these three reads (`updateNotificationSettings`, `changePlan`)
already live in `features/authentication`, left there from Phase 5. `eslint-plugin-boundaries` doesn't
allow one feature's mutation to invalidate another feature's query keys (`features/x/**` may only reach
`features/y/**` through its public surface, and there's no cross-feature invalidation path that
respects that). Rather than force a cross-feature import, all three queries went into
`features/authentication` instead, next to their mutations — keeping read and write in the same
feature, which also meant `useUpdateNotificationSettingsMutation` and `useChangePlanMutation` could
finally get real `invalidateQueries` calls. Neither mutation had any before this: the notification
settings page never actually refreshed after toggling a setting — a real pre-existing gap, fixed as
part of wiring the queries up correctly, not a side effect.

Typed responses (vs. `useRequest`'s `any`) surfaced one more real gap: `data.app_settings[type]` indexed
an object with a plain `string` variable — fixed with a `keyof AppSettings` cast and a null fallback,
same class of fix as `boost-business`'s and `business/[id]/jobs`'s.

Twenty-six pages converted, all verified the same way (lint/typecheck/build plus a real running server
hit with a syntactically-valid-but-backend-rejected session cookie, confirming a full 200 with real
content and no server error each time). Still not migrated: `event/create-event`, `event/add-ticket`,
`event/[id]/assign-ticket` (pure forms/mutations, no read query at all — not Server Component candidates
even once any of their mutations move), and the rest of `settings/*` — `settings/account/*`,
`settings/plan/cancel-subscription`, `settings/privacy`, `settings/profile`, `settings/terms-and-conditions`
— which are either pure forms/mutations (same as above) or genuinely untouched.

**Closed out frontend's page-by-page conversion properly**, after `event/page.tsx` proved a page-level-
only grep can miss a real candidate (its query lived in a child component). Re-checked every remaining
page's full component tree, not just the page file: `event/create-event`, `event/add-ticket`,
`event/[id]/assign-ticket`, `settings/page.tsx`, `settings/account/*`, `settings/plan/cancel-subscription`,
`settings/privacy`, `settings/profile`, `settings/terms-and-conditions`. All confirmed non-candidates for
one of three reasons: no data fetching anywhere in the tree (pure forms/mutations or static content);
reads only from Redux (`settings/profile`/`settings/account` read `user` from `state.auth`, populated by
`useCurrentUserQuery` in a shared layout wrapper, not fetched at the page level); or an interaction-
gated query in a modal (`event/add-ticket`'s `BankAccountModal` calls `useBanksQuery({ enabled: option })`,
only true once the modal opens — same "don't prefetch interaction-gated queries" rule as
`event/[id]/guest-list`). Frontend's page-by-page conversion is genuinely exhausted at 26 pages, not
just paused.

**Admin's list-shell/table-island split.** First checked whether the bullet's assumed shape actually
matched the codebase: it didn't. Of the 6 admin pages the earlier survey counted as "already
server-rendered," none were real — `businesses/page.tsx` is a literal `<div></div>` stub, and the other
5 (`events/[id]/affiliates`, `events/[id]/promotions`, three `transactions/[id]/*-details` pages) are
static UI with hardcoded fake data ("Adebayo Akintoye," "AF112332"), not wired to any query — unbuilt
features that happened to lack `"use client"`, not Phase 6 work. The 25 real client pages weren't a
clean "static shell + dumb table" shape either — search-with-debounce, tab state, status filters, and
CSV export are woven through the same component as the table, and even the shared `MainLayout` chrome
is a Client Component (`useCurrentAdminQuery`, `useEffect`, dispatches auth state).

Proved the pattern on one page first (`users/page.tsx`) before committing to the rest. Turned out
untangling filters from the table wasn't necessary — moving the `"use client"` boundary down one level
(page.tsx becomes an async Server Component prefetching the default tab; the rest of the file becomes
`UsersClient.tsx` unchanged) was the whole job, same shape as `apps/frontend`'s tabbed list pages. Added
`apps/admin/src/lib/query-client.server.ts` (identical to frontend's) and one `api.server.ts` per
feature. `apps/admin/src/lib/server-api.ts` (the direct-to-backend transport) already existed from
earlier, unused groundwork.

That held for the rest of admin too: **every real client page converted** —
`dashboard`, `profile`, `announcements` + detail, `reporting` + detail, `team` + detail, `events` +
detail + `add-promotions`, `transactions` + its three convertible detail pages (`event-details`,
`subscription-details`, `wallet-details` — `boosting-details`, `promotion-details`, `service-details`
were already-stub pages, untouched), `wallet-management` + detail, `users/[id]`, and
`users/affiliate/[id]`. Two of admin's own `enabled: isLoggedIn` client queries turned out to read data
also used elsewhere with a matching backend endpoint already known (`transactions/[id]/wallet-details`
and `wallet-management/[id]` share `useWalletDetailQuery` — one `api.server.ts` entry, `walletKeys`,
covers both). `users/[id]/page.tsx` needed two prefetches (`getUserDetail` unconditional,
`getAccountInfo`'s default "activities-log" tab) via `Promise.all`, matching `tribe/[id]/page.tsx`'s
concurrent-query pattern in frontend.

Left alone, confirmed genuinely not a Server Component candidate: the `(auth)` pages (pre-login, not
gated, nothing to prefetch). `tribes/page.tsx`/`tribes/[id]/page.tsx` were also client-only mock pages
at the time of this pass, but were wired to real data in a later one (§21, 2026-09-24) — see that
entry rather than this historical note.

All verified the same way as frontend's conversions: lint/typecheck/build plus a real running
`next start` hit with a syntactically-valid-but-backend-rejected `lemonade_admin_token` cookie,
confirming a full 200 with no server error, for every converted route.

**Dead-dependency cleanup.** A fresh audit before touching bundle size turned up confirmed-dead packages
still sitting in `package.json` from §14's perf table: `zustand` (admin, zero importers anywhere),
`firebase-admin` (frontend — `firebase`, the client SDK, is genuinely used for FCM push notifications
and stays), `react-date-picker` (zero importers in either app — `react-datepicker` is the one actually
used), and `scroll-into-view-if-needed`/`smooth-scroll-into-view-if-needed` (zero importers in either
app). All confirmed via grep before removal, same methodology as every other dead-code find this
session. `pnpm install` dropped 109 packages. Typecheck/lint/build clean in both apps; First Load JS
was essentially unchanged, since none of these were ever in the shipped bundle — the real win is
smaller `node_modules`, faster installs, and less transitive-dependency attack surface (relevant to the
CI `audit` job's own note about most advisories living in exactly this kind of dead weight).

**Lazy-loading heavy leaf UI.** Targeted the biggest modals by line count in both apps (`wc -l` across
`components/**/Modal*.tsx` and `modals/**`), all genuine leaf UI — gated behind `isOpen`/a click, never
needed for first paint. Converted each to `next/dynamic(() => import(...), { ssr: false })` at its
import site: 17 modals across 14 files in frontend (`UpdateModal` 575 lines down to
`NotificationSettingsModal` 140), 8 across 6 files in admin (`CreatePromotionModal` down to
`WalletThresholdModal`). Verified with a real `next build`: First Load JS dropped meaningfully on the
pages that carried the heaviest modals — frontend's `tribe/[id]` 473 KB → 369 KB, admin's `/events`
218 KB → 182 KB, `/team` 204 KB → 179 KB, `/wallet-management` 207 KB → 183 KB — all comfortably inside
the §15 budgets (350 KB frontend authenticated, 500 KB admin). One page's own-chunk size *grew* in the
build output (`event/[id]/buy-ticket`, 7.6 KB → 43 KB) — investigated rather than dismissed: its actual
First Load JS (the number the budget cares about) moved by about 1 KB, confirming webpack just
reshuffled what counts as "shared" vs "page-specific" once other pages' modals left the synchronous
graph, not a real regression. Found and removed one genuinely dead duplicate import along the way
(`admin/users/[id]/UserDetailsClient.tsx` had both `SuspendModal` and a lowercase `suspendModal`
importing the same module — only the capitalized one was ever used).

**Bundle budgets, enforced in CI.** `tooling/bundle-budget/` parses `next build`'s own route table
(First Load JS per route — a real number Next already computes, not re-derived worse from raw chunk
files) and fails a new `bundle-budget` CI job on regression vs. the PR's base branch, never on an
absolute number for a route that already existed — the §15 principle ("the ratchet only turns one
way") implemented literally: an existing route already over budget is left alone unless a PR makes it
worse, while a brand-new route with no baseline is judged against the app's absolute ceiling (200/350
KB frontend public/authenticated, 500 KB admin) since there's nothing to regress against. Verified
against real build output, including a deliberately-injected regression to confirm the check actually
fails when it should. 12 unit tests cover the parser and the comparison logic.

**Lighthouse CI**, added as a `lighthouse` CI job, but narrower than §15's literal ask and honestly
scoped rather than faked: that section's LCP/CLS targets were written for public event/tribe/business
pages, which — as this phase's own opening finding established — don't exist as public pages today and
won't until the deferred product decision lands. So `tooling/lighthouse-ci/` checks the pages that
actually are reachable without a session: `middleware.ts`'s own pre-login `PUBLIC_PATHS` (login, signup,
forgot-password for frontend; login and forgot-password for admin, at its own desktop preset per
CLAUDE.md's "admin is desktop" framing). Every assertion is `warn`, not `error` — same reasoning as the
`audit` job's own "report, don't block on debt nobody's measured yet": a real local run against these
exact pages found frontend's LCP sitting at ~3.6s against the 2.5s target (admin's two pages already
pass clean) — a genuine, previously-unmeasured finding, and blocking on it immediately would fail every
PR on pre-existing performance, not on anything that PR introduced. When the public-pages decision
lands, extending `collect.url` in `lighthouserc.frontend.json` is the only change needed.

**Server-side pagination** — done, both sides. See §22 Conflict 1 for the full writeup: backend added
opt-in `?page=` pagination to the seven largest unbounded admin lists, and admin's query hooks
(users, reporting, all six transaction tabs, wallet-management) were wired to it.

> **Update, checked and fixed 24 September 2026: admin's tribes feature.** This section's own list/
> detail data-fetching was already wired in a later pass than the one that wrote it (2026-09-20,
> `RequirePermission`/`useTribeListQuery`), making the "static mock content" note above stale — but
> four real actions the backend already supported (`AddAdminTribeThread`, `DeleteAdminTribeThread`,
> `RemoveAdminTribeMember`, and `CreateAdminTribe`, the last of which had a dead, fully-commented-out
> Formik form with no submit handler at all despite a stale comment claiming it worked) had no UI. Built:
> a real Create Tribe form (`react-hook-form` + Zod — the first use of either in this app; both were
> CLAUDE.md's stated convention but neither existed here yet, so this pass introduces them rather than
> matching the Formik/Yup every other admin form still uses) with a working image upload, an inline
> "post as admin" thread composer, and confirm modals for deleting a thread and removing a member,
> following the existing `RestrictTribeModal`/`DeleteTribeModal` pattern exactly. Backend gained
> `CreateAdminTribeRequest`/`AddAdminTribeThreadRequest` FormRequests + DTOs (both actions previously
> read raw `$request->all()` with zero validation) and an eager-loaded `ListAdminTribes` (was a real
> N+1 — 2 extra queries per tribe row, now flat regardless of row count), plus a new admin-guarded
> `/admin/utilities/upload` route — the existing `/shared/utilities/upload` is `auth:user`-only and
> 401s an admin token; `GeneralController::uploadFile` itself is actor-agnostic, so this reuses the
> same controller method under the admin guard rather than duplicating it.
>
> **Found and fixed along the way, not part of the original ask:** every `@lemonade/ui` `Dialog` in
> both apps was rendering at its unstyled in-flow position — `position: fixed` with no `top`/`left`/
> `transform` at all — instead of centered, because neither app's `tailwind.config.ts` `content` glob
> scanned `packages/ui/src/**`. Arbitrary-value classes unique to a shared component (`top-[50%]`,
> `translate-x-[-50%]`) never get Tailwind-JIT-generated unless the exact string also happens to appear
> in the consuming app's own scanned source — most of Dialog's other classes are common enough utility
> names to coincidentally already exist elsewhere in each app, which is exactly why this went unnoticed
> since the modal-migration pass (Phase 7) landed. Confirmed via `getComputedStyle` on a real, already-
> "working" modal (`RestrictTribeModal`) before touching anything, not assumed from my own new code.
> Fixed in both apps' `tailwind.config.ts`. A real image-upload round trip couldn't be live-verified
> further than the admin-guard/validation boundary — Cloudinary itself has no credentials in this
> environment (`storage/logs/laravel.json.log`: "Invalid configuration, please set up your
> environment"), the same class of gap as Connect's `sendChat` noted earlier in this document; the new
> `tooling/e2e/tests/admin/tribes.spec.ts` mocks only that external call and runs everything else —
> create, add thread, delete thread — against the real backend.

### Phase 7 — Design system **[SHOULD]** **[DONE — primitives lifted, MUI/antd removed, Tailwind tokens shared, pixel-class lint ratchet added, modal→Dialog migration complete (59 files, both apps); all 3 contrast findings resolved, 25 September 2026]**

Deferred deliberately: visible, but not structural. Safe to run in parallel with P5 if capacity allows.

- Settle on one shadcn style; lift primitives into `@lemonade/ui`
- One Tailwind preset with real tokens; arbitrary pixel values become lint warnings
- Remove MUI, antd and Evergreen; add the import ban
- Accessibility pass: focus management, dialog semantics, table headers, contrast

**Status:** MUI and antd removed entirely, confirmed via grep before touching anything (the same
methodology as every dead-dependency find this session, including deep subpath imports like
`@mui/material/Alert` a bare-package grep would miss). `@mui/material` had **zero real usage in either
app** — pure dead weight, likely left over from an early scaffold. `antd` had exactly three real call
sites total: `apps/frontend/src/redux/Provider.tsx` (`AntdRegistry` + `ConfigProvider`, wrapping the
*entire app*, not a specific page — theming setup for antd's `Modal` component specifically),
`apps/frontend/src/components/navigation/TopNav.tsx` (`Button`, `Empty`, `Modal` — the notification
bell's dropdown, rendered on every authenticated page via `MainLayout`), and
`apps/admin/src/app/(main)/users/UsersClient.tsx` (a `Select` for the status filter). Migrated all
three onto the shadcn/Radix primitives already in `components/ui/` (`Dialog`, `Button`, `Select` — no
new primitive needed): `TopNav`'s two antd `Modal`s became `Dialog`/`DialogContent`/`DialogHeader`/
`DialogTitle` (kept `DialogTitle` for Radix's own a11y requirement rather than hiding it, since this
phase's own last bullet is an accessibility pass — no shortcut here); `Empty` became a plain "No new
notifications" text block (no shadcn equivalent needed, it's just an empty-state message); `Button
type="link"` became `variant="link"`; admin's antd `Select` became `Select`/`SelectTrigger`/
`SelectValue`/`SelectContent`/`SelectItem`, the exact same composition already used elsewhere in this
app (`tribe/page.tsx`'s status filter, migrated during Phase 6). Along the way, found and fixed a real
gap the typed switch from `any` surfaced: `apps/admin/src/components/global/AlertMessage.tsx` used
`@mui/material/Alert` (a deep subpath import the first grep pass missed) for the app's global toast —
`apps/frontend`'s own equivalent `AlertMessage.tsx` already used `react-hot-toast` (already a shared
dependency in both apps) instead, so admin's was rewritten to match it exactly rather than inventing a
third pattern — the two apps now render the identical `toastifySlice`-driven toast the same way.

Removed `antd`, `@ant-design/nextjs-registry`, `@mui/material`, `@emotion/react`, `@emotion/styled` from
both `package.json`s (confirmed zero remaining importers of any of these, including subpaths, before
removing) — 93 packages dropped from `node_modules`. The `no-restricted-imports` ban on `@mui/*`/
`antd`/`evergreen-ui` already existed (added ahead of this work, anticipating it) and stays at `warn`,
not `error`: it's one shared rule entry that also bans `axios`, and ESLint's severity is per-rule, not
per-pattern — flipping it to `error` now would additionally hard-block on the 24 files still importing
axios directly, a separate, still-outstanding migration this phase didn't touch. Left a comment in
`apps/frontend/eslint.config.mjs` explaining exactly that, so a future reader doesn't mistake the "warn"
level for MUI/antd/Evergreen cleanup being incomplete.

**The real payoff wasn't the package count — it was bundle size**, because `Providers` (via
`AntdRegistry`/`ConfigProvider`) wrapped every single page in the app, not just the ones that used antd
directly. Verified with a real `next build` before/after: frontend's `/settings/wallet` First Load JS
went from 304 KB to 236 KB, `/tribe/[id]` from 369 KB to 289 KB, `/settings` from 286 KB to 228 KB.
Admin's `/users` — the one page with a real antd component — dropped from 272 KB to 210 KB, with the
page's own chunk alone shrinking from 99 KB to 6.1 KB (antd's `Select` was apparently ~93 KB on its
own). Every frontend and admin route landed comfortably inside the §15 budgets (200/350 KB frontend,
500 KB admin) after this change; several routes that were already over budget before this session (from
before Phase 6/7's work started) are now well under it as a side effect, though that was never the
target — the ratchet in `tooling/bundle-budget/` only checks for regression, not for taking credit on
debt a PR happened to pay down. Verified beyond typecheck/lint/build: a real `next start` hit on every
page that rendered one of the migrated components (`/`, `/tribe/[id]`, `/event`, `/settings`,
`/settings/wallet` for frontend; `/`, `/users`, `/login` for admin, since `AlertMessage` renders in the
root layout) — all clean 200s, no server error.

**Primitives lifted into `@lemonade/ui`.** Diffed every `components/ui/*.tsx` file both apps had in
common — 7 files (`button`, `button.test`, `card`, `input`, `label`, `select`, `textarea`; admin's
entire `components/ui/` was exactly these 7, so the directory is now gone). `label.tsx` was
byte-identical. The rest split into two kinds of difference: real shadcn style divergence (admin was on
"new-york", frontend on "default" — the package's own `index.ts` TODO had flagged this as unresolved)
and two genuine correctness gaps that happened to track the same fault line. Resolved style by taking
admin's new-york conventions as the default (icon-aware button sizing, `lucide-react` over
`@radix-ui/react-icons` since lucide is already the dominant icon library in both apps everywhere outside
these files, mobile-safe `text-base md:text-sm` input/textarea sizing that avoids iOS's zoom-on-focus).
Kept two things from frontend's version instead, because they're fixes, not style: `CardTitle`/
`CardDescription` render as `<h3>`/`<p>` (shadcn's own canonical semantic markup — admin's used bare
`<div>`s), and `Input` carries the password-visibility toggle (gated on `type="password"`, so any
consumer gets it by passing that type — not an app-shaped flag, so it doesn't trip CLAUDE.md's
"no app-shaped branching" rule). Also fixed a real bug surfaced while diffing: frontend's `select.tsx`
had `data-[disabled]:pointer-tribes-none` where every other copy (admin's, shadcn's own upstream) reads
`pointer-events-none` — looks like a stray find-replace artifact from unrelated tribes-domain work
elsewhere in the codebase; the disabled-state styling silently never applied. Carried `cn()` into
`packages/ui/src/lib/utils.ts` (same `clsx`+`tailwind-merge` implementation both apps already had
locally) rather than routing through `@lemonade/domain`, since class-merging is a UI concern, not a
domain one — both apps' own `lib/utils.ts` are untouched, this is additive.

Rewrote every import site across both apps (54 button, 39 label, 34 input, 13 card, 12 select, 3
textarea call sites) from `@/components/ui/<name>` to `@lemonade/ui`, merged the resulting
multiple-imports-from-one-module lines back into one per file, deleted the 7 app-local files from both
apps, and pruned each app's `package.json` down to what's still used directly: `@radix-ui/react-select`,
`@radix-ui/react-label` and `@radix-ui/react-slot` are gone from both (fully absorbed into
`@lemonade/ui`); `class-variance-authority` and `@radix-ui/react-icons` stay in frontend only (still used
directly by `badge.tsx`/`multi-select.tsx` and two event components, respectively — neither is promoted,
both have exactly one real consumer today); admin's `@radix-ui/react-icons` turned out to already be a
dead dependency with zero usage anywhere, caught and removed in the same pass. `packages/ui` gained its
own `vitest.config.ts`/`vitest.setup.ts` (jsdom + Testing Library, mirroring the apps') since it now
holds a real component test, not just pure functions. Verified: `pnpm install` (lockfile clean),
typecheck/lint/test/build all green on `@lemonade/ui` and both apps (lint: 0 errors in both, all
warnings pre-existing debt tracked earlier in this phase and Phase 3); both apps' dev servers boot and
serve 200s on every route touched. Admin's Turbopack dev server (`next dev --turbopack`) hit an unrelated
"Next.js package not found" internal error on this machine — reproduced on `main` before this change too,
so not a regression; `next build` (webpack) and plain `next dev` both work, which is what CI and
production actually use.

**One Tailwind preset with real tokens — the safe half done, the rest documented instead of guessed.**
Diffed both apps' `tailwind.config.ts` line by line. Found a clean split: shadcn's own CSS-variable-driven
token set (`background`/`foreground`/`card`/`popover`/`primary`/`secondary`/`muted`/`accent`/
`destructive`/`border`/`input`/`ring`/`chart`), `borderRadius`, `fontFamily`, the generic
`gradient-radial`/`gradient-conic` `backgroundImage`s, and five `boxShadow` utilities
(`custom-top`/`custom-bottom`/`div-shadow-1`/`div-shadow-2`/`event-custom`) were byte-identical between
the two files — real duplication, safe to share. Moved exactly those into `packages/config/tailwind.preset.js`,
had both apps' configs pull it in via `presets: [require("@lemonade/config/tailwind-preset")]`, and
verified the change is a no-op: built both apps before and after, diffed the generated CSS output
file-for-file, byte-identical in both apps. Nothing rendered differently; this only removed duplication.

Left everything else exactly where it was, because merging it isn't safe without a way to visually verify
the result (no browser tool in this environment, and both apps ship to real users): the two apps'
`fontWeight` scales use the **same key names for different weights** (`thin` is `300` in frontend's scale,
`100` in admin's) — merging them would silently reweight text somewhere neither typecheck nor a CSS diff
would catch. The `tablet` breakpoint differs by 1px (767 vs 768) between the two configs, undocumented
anywhere as intentional — flagging it as a likely bug, not fixing it, since picking either value changes
real layout behavior at that exact width. Frontend's shared color key is `light_grey` (underscore, used
as `bg-light_grey` at real call sites); admin's is `light-grey` (hyphen) — same value, different key,
so sharing it under either spelling would break the other app's existing class names. Also found, while
diffing: admin's `card-shadow` in `boxShadow` is a real pre-existing bug — its value is a full
`"box-shadow: 0px 0px 1px 1.5px #EDEDED4D"` declaration string, not a shadow *value*, so the utility
Tailwind generates from it never actually applies anywhere it's used. Left it as-is and commented in
place rather than fixing it silently, same reasoning as the rest of this paragraph.

"Arbitrary pixel values become lint warnings" — not started. This phase's own preset file already
measured **7,041 hardcoded pixel classes** across both apps before any of this session's work began; a
lint rule that fires on all of them at once isn't a small addition, it's asking every future PR to wade
through thousands of pre-existing warnings to find its own. Needs its own scoped pass (or an ESLint
overrides list seeded from today's count, the same "warn on new, not on existing" shape as this session's
`no-explicit-any`/MUI bans) rather than a blanket switch-on.

**Accessibility pass — started, scoped to what's verifiable without a browser.** CLAUDE.md names
`axe-core` in component tests as the intended tool for this row of the testing table; wired it up for
real via `jest-axe` in `packages/ui` (the package every primitive now ships from) rather than adding it
per-app, since a violation caught here is caught everywhere the primitive is used. Three new tests in
`packages/ui/src/a11y.test.tsx` assert zero axe violations on the actual composed shapes pages build with
today: a labeled form (`Label`+`Input`+`Textarea`, including a password field), a `Card` with headings and
buttons, and a labeled `Select`.

The `Select` test caught a real, generalizable gap: `SelectTrigger` renders a `<button role="combobox">`,
not a native form control, so a `Label htmlFor`/`id` pair — which works for a real `<input>` — does **not**
auto-associate with it. Every Select in both apps was relying on `SelectValue`'s placeholder text alone
for its accessible name, which disappears the moment a value is selected (a screen reader then hears just
"Active" or "Lagos", with no indication of what field that is). Fixed by adding an explicit `aria-label`
(the field's real label text) to every real `SelectTrigger` in both apps — 8 call sites total, one
`aria-label` attribute each, zero visual or layout change: `apps/admin/.../users/UsersClient.tsx` (status
filter), `apps/frontend/.../tribe/[id]/TribeClient.tsx` (sort), `apps/frontend/.../CreateTribeModal.tsx`
and `apps/admin/.../CreateTribeModal.tsx` (category), `apps/frontend/.../BusinessFilter.tsx` (business
category), `apps/frontend/.../BankAccountModal.tsx` (bank name), `apps/frontend/.../profile-step.tsx`
(industry), `apps/frontend/.../FilterEventModal.tsx` (location). Also found, while auditing every real
`<Dialog>`/`<SelectTrigger>` usage: `apps/frontend/src/components/ui/command.tsx`'s `CommandDialog` had
no `DialogTitle` at all (Radix requires one) — not currently imported anywhere in either app, but fixed
rather than deleted (2026-09-21) since it's a real primitive worth keeping ready for whenever a command
palette gets built. Screen-reader-only, matching `TermsOfUseModal.tsx`'s existing `sr-only` DialogTitle
convention, with a `label` prop for a future consumer to override the default "Command menu" text.

**Modal → Dialog migration — done, all 59 real modal files across both apps.** The gap flagged above is
closed: every hand-built overlay `<div>` (the `fixed inset-0 ... bg-opacity-* ${isOpen ? "flex" :
"hidden"}` pattern, or an `if (!isOpen) return null` variant of it) now renders through
`@lemonade/ui`'s `Dialog`, giving every one of these modals Radix's focus trap, Escape-to-close, overlay-
click-to-close, and `aria-modal` semantics for free — none of that was hand-rolled before. `Dialog` itself
was lifted into `@lemonade/ui` from frontend's local `components/ui/dialog.tsx` (admin had no Dialog
primitive at all, despite already listing `@radix-ui/react-dialog` as an unused dependency) — same
"diff and reconcile, then delete the app-local copy" pattern as every other primitive this phase lifted.
Added `DialogContentBare` alongside the standard `DialogContent`: identical positioning/overlay/animation/
focus-trap machinery, minus the built-in close button, specifically for wrapping a legacy panel that
already renders its own close icon — using `DialogContent` here would have produced two overlapping close
buttons on every single one of these 59 files.

The conversion is mechanical and uniform: the outer overlay div becomes `<Dialog open={isOpen}
onOpenChange={...}>`, a `<DialogTitle className="sr-only">` is added (Radix requires one; every one of
these modals already had a visible heading to source the text from, so this is invisible — screen-reader
accessibility, not a visual change) as the *first child of* `DialogContentBare` (getting this nesting
wrong — putting `DialogTitle` as a sibling of `DialogContentBare` instead of inside it — was a mistake
this pass caught and fixed itself: since `DialogTitle` wasn't gated by the Portal's own open/closed
mounting, every closed dialog's sr-only title was rendering into the DOM unconditionally, and the open
dialog's real `aria-labelledby` wiring never pointed at it; caught via a real Playwright accessibility-tree
snapshot showing three simultaneous "dialog" headings on a page with zero dialogs open, not by inspection),
and the original panel div — width, background, padding, its own close icon, all business logic — is kept
completely unchanged as `DialogContentBare`'s child. `DialogContentBare` itself is neutralized to
`w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none` so it contributes no visible box of its
own; the untouched original panel supplies 100% of the visual styling, same as before.

Done as 4 parallel forks (one per subdirectory grouping, ~16 files each) given a precise written recipe,
followed by a manual verification pass over the combined result: re-typechecked/linted/built both apps,
diffed every file against the recipe to confirm no unrelated changes leaked in, and fixed the DialogTitle-
nesting bug described above across all 43 affected files with a small script once found (the other 16, one
fork's own batch, had already nested it correctly). One file — `events/Modals/GuestDetailsModal.tsx` — was
correctly flagged and skipped by its fork rather than force-converted: it's a right-edge sliding drawer
(`translate-x-0`/`translate-x-full`), not a centered dialog, with an always-mounted content div and a
separate conditional backdrop sibling — a real structural difference, not just a style variant. Converted
by hand afterward using the same right-anchored `DialogContentBare` override three of admin's
wallet-management history panels (also drawers, not centered dialogs) already needed.

Live-verified with real Playwright runs, not just typecheck/build — `tooling/e2e/tests/{admin,frontend}/modal-migration.spec.ts`: a lazy-loaded (`next/dynamic`, `ssr:false`) admin modal opens from its real
trigger and Escape actually closes it (Radix's own behavior now, not hand-rolled); the admin withdrawal-
threshold modal (the right-anchored-panel-adjacent standard case) does the same; and frontend's
`CreateTribeModal` — which uses non-standard prop names (`modalFlag`/`activateModal`, not `isOpen`/
`toggle`) — proves the conversion handled that deviation correctly too, not just the common case. Full
existing e2e suite re-run after: 34 passing, 2 flaky-but-recovered (frontend detail-navigation's own
pre-existing, already-documented single-retry flakiness, unrelated to this change).

**One pre-existing bug found while writing the admin e2e test, fixed later (2026-09-21)**: `apps/admin`'s
`/users/[id]` page renders an `<Image>` with an empty-string `src` somewhere reachable from its default
tab, which Next dev's error overlay surfaces as a full-screen blocking panel over the whole page —
confirmed via a real console-message listener (77 occurrences on that one page load), confirmed unrelated
to this migration (it fires before any tab is even clicked), and confirmed *not* present on `/wallet-
management`, `/events/[id]`, or `/events/add-promotions` (checked each directly rather than assumed).
Root cause, found later: `components/users/TribeModal.tsx` (unrelated fixture UI) stays mounted
off-screen at all times via a CSS transform, not unmounted, and passed an SVG icon component as
`next/image`'s `src` — `Image` needs a URL/`StaticImageData`, not a component. `views/users/
BusinessView.tsx` had the identical bug. Both now render the icon directly as a component instead.

**Contrast audit — done for the design system's own tokens, not every call site.** A palette-wide script
checking every `text`/`bg` pairing actually used together across ~4,000 className strings would need to
know which classes land on the same element — real AST work, not attempted here. What's tractable without
a browser: WCAG's contrast formula is pure math over a color's HSL values, and both apps' shadcn primitives
render through a small, fixed set of CSS-variable token pairs (`primary`/`primary-foreground`,
`card`/`card-foreground`, `border`/`background`, and so on — defined once in `globals.css`, identical in
both apps). Built `tooling/contrast-audit/` to check exactly those: `parse-tokens.mjs` reads the HSL
values out of `globals.css`, `contrast.mjs` implements the real WCAG 2.1 relative-luminance formula (no
headless browser needed — same math a browser uses), `audit.mjs` checks each pair against the right
threshold (4.5:1 for text, 3:1 for non-text UI components like borders) for both light and dark mode. 8
unit tests, including a regression test for a real bug the first run caught: `globals.css` has an earlier,
unrelated `:root { --foreground-rgb: 0, 0, 0; }` block (legacy, comma-separated, not HSL) before the real
shadcn token block, and the first version of the parser matched that one by mistake, silently returning an
empty token set instead of erroring.

Running it for real found genuine, previously-unmeasured failures, all stock shadcn defaults never
customized for this project: light mode's `destructive-foreground` on `destructive` was 3.60:1 (needs
4.5:1 — the "delete" button variant's own text failed contrast against its own background),
`muted-foreground` on `muted` was 4.35:1 (failed by a hair), and `border`/`input` on `background` were
1.26:1 light / 1.31:1 dark (both need 3:1 — WCAG 1.4.11 exempts purely decorative borders, so this one
was flagged as the closer call of the three). Wired into `.github/workflows/ci.yml` as a new
`contrast-audit` job, report-only like the Lighthouse job. All three were left as findings for a design
decision rather than silently "fixed" by picking new colors without the user's input.

> **Update, resolved 25 September 2026.** The user asked for all three findings to be closed, choosing
> "minimum change to clear the threshold, same hue" over hand-picking exact replacement colors.
> `--muted-foreground` (44.1%, was 45.1%) and `--destructive` (48.9%, was 60.2%) were already fixed in
> an earlier pass and now measure 4.51:1 each — this status paragraph just hadn't been updated to say
> so. `--border`/`--input` were the one still-open finding: light mode moved from 89.8% lightness to
> 58%, dark mode from 14.9% to 37% (binary-searched against the real formula in
> `tooling/contrast-audit/contrast.mjs`, both apps' `globals.css`) — now 3.04:1 light / 3.07:1 dark,
> both just past the 3:1 floor. This is a visibly stronger border than the shadcn default, not a subtle
> tweak like the text-color fixes — every card, input, and divider in both apps is now more visible.
> `tooling/contrast-audit/audit.mjs` reports all 11 pairs passing in both modes; both apps' `next build`
> verified clean.

**Arbitrary pixel values are now a lint warning, with the same declining-budget ratchet already used for
`no-explicit-any`.** `eslint-plugin-tailwindcss`'s own `no-arbitrary-value` rule turned out to be the
wrong tool — it flags every arbitrary value (colors, percentages, `calc()`), not just the `[Npx]` pattern
this phase's own bullet and §18's table actually track, and it needs a resolved Tailwind config at lint
time (extra fragility for no real gain here). Wrote a small custom rule instead —
`packages/config/eslint-rules/no-hardcoded-pixel-class.js` — that just regex-matches `-[Npx]` in string
literals and template-literal chunks, registered as `local/no-hardcoded-pixel-class`. Same severity split
as every other measured-debt rule this session: `"error"` in the shared `packages/config/eslint.config.mjs`
(so a new package starts clean), downgraded to `"warn"` in each app's own `eslint.config.mjs` with the
measured count in the comment.

Actually running it surfaced a real number, not the stale one: **2,591 in frontend, 1,487 in admin** —
lower than the 7,041 the roadmap measured before this session, almost certainly because Phase 6/7's own
work (Server Component conversions, the MUI/antd removal, the primitives lift) already rewrote a lot of
the files that count was measured against. Seeded `packages/config/pixel-class-budget.json` with today's
real counts, not the old figure. Enforcement is `packages/config/scripts/check-pixel-budget.mjs` — a
generalized version of the existing `check-any-budget.mjs` (both now share
`packages/config/scripts/check-rule-budget.core.mjs` rather than duplicating the same ~60 lines of
"run eslint --format json, count one ruleId, compare to a budget" twice), wired into both apps'
`package.json` as `lint:pixel-budget` and into `.github/workflows/ci.yml` right next to the any-type
budget step. While in there, the any-type budget script surfaced its own real improvement from earlier
in this session (the dead `console.log`/`any`-typed Pusher listener cleanup under Phase 8) — lowered
`no-any-budget.json` from 209/105 to 208/104 to lock it in, per the script's own instruction.

### Phase 8 — Observability & hardening **[SHOULD]** **[MOSTLY DONE — logging/Web Vitals/CSP, docs finalization, and a started (not full-ten-journey) Playwright suite all done; Sentry deliberately deferred, see below]**

Closes the loop with the backend, which already reports to Sentry.

- Sentry in both apps, sharing the backend's correlation id so a frontend error joins its backend request
- Web Vitals reporting; structured logging with redaction; remove the last `console` calls
- CSP with nonces via middleware — report-only first, then enforced
- Playwright e2e for the ten journeys in the merge queue
- `docs/` finalized: ARCHITECTURE, ADRs, CONTRACT, per-app READMEs, root `CLAUDE.md`

**Status.** Sentry is deliberately deferred, not blocked — the user's own direction (ADR-006 in
`lemonade-backend`'s architecture guide): file logging is the default error-reporting channel for now,
with Sentry and Slack built as ready-to-enable options, not a requirement to chase a DSN for
immediately. `lemonade-backend`'s `ErrorReportingService` already ships a `SentryNotifier` that no-ops
cleanly until a real DSN is configured — the same shape this phase's frontend bullet would need, so
there's a real pattern to follow whenever this gets prioritized. Adding `@sentry/nextjs` here against a
placeholder DSN would silently do nothing, worse than not adding it, since it'd look wired up in a diff
without being wired up in practice — so it stays undone until that's a real priority, not "blocked."
The Playwright e2e bullet was blocked for a different reason
(`LARAVEL_API_URL=http://127.0.0.1:9900` wasn't reachable — confirmed via a direct request, not assumed)
until the user started a real backend at `127.0.0.1:9800` and gave real seed credentials for both a user
and an admin account — see below for what shipped once that was available.

**Playwright e2e — started, not the full ten journeys.** `tooling/e2e/` runs against the live backend the
user provided. Not the full journey list from this section's own table above — several assume things this
pass didn't have: a payment gateway sandbox (journey 4), a second seeded account (journey 10 needs two
parties messaging each other), a way to read a real OTP/verification email (journey 1). What's genuinely
covered: real login for both a user and an admin account (`tests/*/auth.setup.ts`, `storageState` reused
across the rest of the suite so login only happens once); session persistence across a hard reload
(journey 2's non-token-expiry half); every top-level authenticated route in both apps visited once,
asserting no client-side throw (`tests/*/smoke.spec.ts`); and real dynamic-data list-to-detail flows —
admin's users, events, team and transactions tables, frontend's tribe and business lists — each clicked
through from a real list to a real detail page, not just a static route. 26 tests total, run serially
(`workers: 1`) against real `next dev` servers, since any concurrency measurably caused non-deterministic
timeouts as the suite grew — a real environment characteristic, not a bug being papered over. A few list
pages don't have coverage yet for an honest reason, not an oversight: this seed data has zero rows in
admin's reporting/announcements/wallet-management tables and frontend's events list, so there's nothing
real to click into yet, and admin's `/tribes` is still the static mock content Phase 6 already found. Full
scope, and exactly why each of the ten journeys is or isn't covered, are in `tooling/e2e/README.md`, not
duplicated here. One finding flagged there as non-fatal and not chased down — an empty-string image `src`
on frontend's `/event` cards — was fixed on follow-up and, in verifying that fix with a real browser,
turned out to be masking a second, worse bug in the same code path: a real (non-empty) `event_image` value
from seed data pointing at a host `next.config.mjs` doesn't allow-list, which crashes the whole page, not
just the image. See `tooling/e2e/README.md`'s "Real bugs this suite has already found" for both.

> **Update, checked and fixed 24 September 2026: the same bug on `/tribe` and `/business`.** The
> `/event` fix above didn't cover every card component with this pattern — `TribeCardList.tsx`,
> `AllBusinessCard.tsx`, and `FeaturedBusiness.tsx` (the featured-businesses carousel, rendered above
> the main list) all still passed a possibly-`null` `image` straight to `next/image`'s `src` with no
> fallback. On real seed data (most tribes/businesses have `image: null`), this wasn't cosmetic: it
> caused React's own "empty string was passed to src" warning to fire continuously — a genuine
> infinite re-render loop, not a one-time warning — and both `/tribe` and `/business` hung on the
> route's loading spinner forever, never rendering real content. Found while chasing down an e2e
> failure; confirmed pre-existing (reproduces on the pre-session baseline commit, unrelated to any
> work done today) via a git worktree at that commit. Fixed the same way as `/event`: fall back to an
> existing placeholder asset (`/images/tribe_1.png`, `/images/business_empty.png`) instead of the raw
> possibly-null value. **A real gap this surfaced in `smoke.spec.ts`:** that spec passed for both
> routes throughout the entire time this bug existed — `response.ok()` stays true across the
> mid-render hang, and the crash never reaches an *uncaught* runtime error (no "Unhandled Runtime
> Error" text, no `pageerror` event) because nothing here actually throws; it's an infinite render
> loop, not an exception. `smoke.spec.ts`'s three assertions are structurally blind to this whole bug
> class. Not hardened further in this pass — flagging the gap rather than silently expanding scope.

**This is the first tool in the whole session that executes real client-side JavaScript in a real
browser** — every other check (curl-based route verification, `next build`, typecheck) either doesn't run
JS at all or only proves the bundle compiles, not that it runs. That gap was real: the suite's first
run found two genuine bugs neither typecheck nor lint nor a curl-based check had ever caught, both fixed
in the same pass:

- `apps/frontend/src/lib/firebase.ts` — `getMessaging(app)` throws synchronously when
  `NEXT_PUBLIC_FIREBASE_PROJECT_ID` is unset, and since `FcmProvider` wraps the entire root layout, an
  unconfigured Firebase crashed **every page in the app** — despite `.env.example`'s own comment claiming
  the feature "degrades rather than crashing when these are unset." Guarded on `firebaseConfig.projectId`
  being present and wrapped the init in try/catch; `messaging` is now honestly typed as possibly
  `undefined`, which surfaced three more call sites assuming it was always defined.
- `apps/frontend/src/app/(main)/settings/page.tsx:100` — `user?.socials.length > 0` only guards `user`
  being null, not `user.socials` itself. Threw for any user whose `socials` field is null/undefined from
  the backend — the normal case for an account that hasn't set up social links, including the e2e test
  account itself.

Not wired into `.github/workflows/ci.yml`'s normal `pull_request`/`push` triggers yet — but as of
28 September 2026, `.github/workflows/e2e.yml` is a real, complete, `workflow_dispatch`-only job (MySQL +
Mailpit service containers, a real `lemonade-backend` checkout, migrate + deterministic seed, `php artisan
serve`, then the usual Playwright run), not a stub. Two real secrets still block flipping it to a real
merge gate: `LEMONADE_BACKEND_TOKEN` (a read-only PAT — that repo is private) and real Paystack test-mode
keys. Everything else the suite needs is a plain env var in the workflow, not a secret — it's
`lemonade-backend`'s own deterministic seed data (`config/seeding.php`,
`database/seeders/E2eFixturesSeeder.php`), not anything sensitive. See `tooling/e2e/README.md`'s "Wiring
into CI" section for the full detail.

> **Update, 28 September 2026: journeys 1 and 4 added (partial), a real bug found and fixed along the
> way.** Both were blocked on real infrastructure this repo didn't have until now — a way to read a real
> signup OTP email, and real Paystack test-mode credentials — both since provided by the user.
>
> **Journey 1** (`tests/frontend/signup.spec.ts`): sign up → verify email with a real OTP → land on
> `/profile-setup`. Needed a real mail catcher to read the OTP at all — there's no API to ask Resend
> "what did you just send," and the signup flow never returns anything a test could read the code from
> directly. Installed Mailpit locally (`brew install mailpit`) and pointed `lemonade-backend`'s local
> `.env` `MAIL_MAILER` at it (`smtp` / `127.0.0.1:1025`) — independent of the production Resend choice
> (ADR-007), since there's no way to read a real inbox through Resend from a test either way. The test
> polls Mailpit's REST API for the message, regexes the 4-digit code out of
> `resources/views/emails/otp.blade.php`'s fixed "Your Lemonade code: NNNN" format, and fills it into the
> OTP input. As of 28 September 2026 (see below) it also completes all four `/profile-setup` steps and
> lands back on `/`, not just the OTP verification.
>
> **Journey 4** (`tests/frontend/ticket-purchase.spec.ts`, partial): buy a ticket → real order created →
> real Paystack test-mode transaction initialized → browser actually redirected to a live
> `checkout.paystack.com` session. Verified live before writing the test: called the real
> `assign-tickets` endpoint directly with a minted token against a real paid seed ticket, got back a real
> `authorization_url`, then opened it with Playwright to see what was actually there — it's a Cloudflare
> bot-challenge page ("Just a moment..."), not a form. That's active anti-automation protection on a
> third party's payment page, not a flakiness problem to retry past — driving the checkout form itself
> would mean building tooling specifically to defeat that protection, which this suite won't do
> regardless of effort. "confirmation → ticket appears" therefore isn't automated; it needs either a
> human completing a real test-card payment or a legitimate server-to-server route (a test-mode webhook
> simulator, if Paystack ever offers one), neither of which exists in this pass. Every run leaves a real
> "pending" Order/Attendee/AssignedTicket row behind, same as any real user who abandons checkout before
> paying — harmless, since those never reach paid/non-pending status and never surface in the UI.
>
> **A real, previously-undiscovered bug found and fixed while building journey 4, not deferred:**
> `apps/frontend/src/app/(auth)/login/page.tsx` and `signup/page.tsx` both called `useGoogleLogin()`
> unconditionally. `@react-oauth/google`'s hook throws synchronously inside its own effect ("Missing
> required parameter client_id") when `GoogleOAuthProvider`'s `clientId` is empty — which it is in this
> local dev environment (`NEXT_PUBLIC_GOOGLE_CLIENT_ID` unset) — crashing the *entire* login/signup page
> into its error boundary, not just disabling the Google button. First surfaced as the ticket-purchase
> test failing on an unrelated selector; root-caused by capturing `pageerror`/console output directly,
> the same technique used for the Firebase crash this doc already documents in this same section. Fixed
> by extracting the hook into its own component, `apps/frontend/src/components/auth/GoogleAuthButton.tsx`
> — both pages now only mount it (so the hook only ever runs) when `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is
> actually set, same shape as `lib/firebase.ts`'s existing guard on a missing Firebase config. Confirmed
> the fix live: the same navigation that used to crash into "Something went wrong" now renders the real
> page, and both new journeys pass clean afterward. `pnpm --filter lemonade-app typecheck/lint/build` all
> green.
>
> Also set `hello@lemonade-admin-azure.vercel.app` as `MAIL_FROM_ADDRESS` in `lemonade-backend`'s `.env`
> per the user's direction — flagged, not silently assumed working: live-tested through Resend and it
> fails with "domain is not verified," and likely can't be verified through Resend's normal flow at all,
> since `*.vercel.app` is a Vercel-managed subdomain — Resend's DNS verification needs TXT/DKIM/SPF
> records on a domain the user controls end to end, which a shared Vercel subdomain isn't. Doesn't block
> anything in this update (Mailpit is what the e2e suite actually reads), but real production email is
> still not flowing through Resend until a domain the user actually owns is verified there.

> **Update, 28 September 2026: journey 1 completed end to end, two more real bugs found and fixed.**
> `signup.spec.ts` now fills and submits all four `/profile-setup` steps
> (`components/form-steps/{profile,address,skills,social}-step.tsx`) and asserts the wizard lands back on
> `/` — a real, previously-nonexistent proof that a brand-new account can actually reach a usable session,
> not just that the OTP round trip works.
>
> **Bug 1, found on the very first attempt: every step silently failed even on a successful API call.**
> All four steps' submit handlers checked `if (data.status)` before advancing — this backend's envelope
> has no `status` key at all (it's `{success, message, data}`), so that condition was always falsy and
> `next_step()` was structurally unreachable, regardless of what the backend actually returned. Confirmed
> live before touching anything: captured the real network response for `profile-set-up`
> (`{"success":true,"message":"OK","data":[]}`, a real 200) while the UI stayed on step 1 and showed
> "Something went wrong." Same bug class this doc already records for `resolveReport`,
> `OpenedChat.tsx`, and `SettingsModal.tsx` — envelope-key drift, not a new failure mode. Fixed all 5
> occurrences (4 steps' `next_step()` gates plus `profile-step.tsx`'s own avatar-upload branch, same
> file, same bug) to check `data.success`.
>
> **Bug 2, found immediately after: the wizard's actual final step 500'd for every real user.** Once step
> 1-3 correctly advanced, submitting step 4 (`social-step.tsx`, "Done") hit a real 500. `storage/logs/
> laravel.log`: `SQLSTATE[HY000]: General error: 1364 Field 'id' doesn't have a default value` inserting
> into `app_notification_settings`. Root cause in `lemonade-backend`'s `SetupSocialLinks::execute()`:
> every other row this method creates uses its Eloquent model (`UserSubscription::create()`,
> `Wallet::create()`, etc.), but the notification-settings row used `DB::table('app_notification_
> settings')->insert([...])` — a raw query builder call that bypasses `AppNotificationSetting`'s
> `HasUuids` trait entirely, so `id` (a `uuid` primary key with no DB-level default — confirmed in the
> migration) was simply never supplied. A pre-existing, already-present backfill console command,
> `GenerateUserNotificationSettings`, does this correctly via the Eloquent model — the fix mirrors it
> exactly (`AppNotificationSetting::query()->create([...])`, plain PHP arrays instead of pre-`json_encode`'d
> strings, since the model's own casts already serialize them). **This means no real user has ever been
> able to complete signup through this wizard** — bug 1 blocked step 1 from ever advancing, and bug 2 was
> waiting right behind it on the step every user would eventually reach once bug 1 was fixed. Zero test
> coverage existed on any of the four backend profile-setup actions before this; added
> `tests/Feature/Identity/SetupSocialLinksTest.php` (2 tests) — confirmed it actually catches the
> regression by reverting the fix locally and re-running (500 without it, 200 with it) before committing.
> `composer test:ci` 571 tests, Pint/PHPStan clean.
>
> Also live-verified the domain-ownership concern flagged above was correct, not just theoretical: tried
> `hello@lemonade.com` next (a real, long-established, unrelated company's domain) — same "domain is not
> verified" failure from Resend, as expected for a domain the user doesn't control the DNS for either.

Did the rest, all verifiable without either:

- **`console` calls** — already effectively zero live ones (`no-console` at `"error"` in
  `packages/config/eslint.config.mjs` was already catching them). Found and removed 3 dead
  commented-out `console.log` lines in `apps/frontend/src/hooks/{useRefreshToken,usePusher}.ts` — two of
  them were `pusher.connection.bind(...)` calls whose entire handler body was just the commented-out log,
  so the whole no-op listener came out, not just the comment.
- **Structured logging with redaction** — `apps/{frontend,admin}/src/lib/logger.ts` (app-local, same
  duplication tolerance as `lib/utils.ts`'s `cn()`): `logger.info/warn/error(message, context?)` emits one
  JSON line (`level`, `message`, `timestamp`, redacted `context`) via `console.warn`/`console.error` only
  — `info` still routes through `console.warn` under the hood since CLAUDE.md's `no-console` rule doesn't
  allow a plain `console.log`/`console.info`, but the JSON payload's own `level` field is what a log
  aggregator actually reads, not which console method emitted the line. Redacts
  `password`/`token`/`access_token`/`refresh_token`/`authorization`/`secret`/`otp`/`pin`/`card_number`/
  `cvv`/`ssn` at any depth, including inside arrays. 5 unit tests per app (10 total), covering redaction at
  the top level, nested, and inside arrays.
- **Web Vitals reporting** — `WebVitalsReporter.tsx` (mounted once in each app's root layout) calls
  `useReportWebVitals` from `next/web-vitals` and beacons each metric to a new `POST /api/web-vitals`
  Route Handler (`sendBeacon`, falling back to `fetch(..., { keepalive: true })`), which logs it via the
  new structured logger. Verified against real running dev servers in both apps: posted a real
  `{name, value, id, label}` payload, confirmed a 204 and the resulting `{"level":"info","message":"web
  vital",...}` line in the server's own output.
- **CSP with nonces via middleware, report-only** — both apps' `middleware.ts` now generate a per-request
  nonce (`crypto.randomUUID()`), thread it onto both the request headers (`x-nonce`, for a future Server
  Component to read) and a `Content-Security-Policy-Report-Only` response header, and report violations to
  a new `POST /api/csp-report` Route Handler that logs them via the structured logger. Report-only by
  design — nothing here can break a page, which is exactly why this was safe to write without a browser to
  verify rendering against: verified instead by curling both apps' real dev servers and confirming the
  header, the nonce, and a real violation payload landing in the log. Each app's policy is scoped to its
  actual integrations, not a generic template: frontend's covers Firebase Cloud Messaging (including its
  service worker), Google Identity Services (`@react-oauth/google`), Pusher, and the two allow-listed image
  hosts; admin's is the same minus Firebase and Google OAuth, which it doesn't use. Both still need
  `style-src 'unsafe-inline'` — neither app's inline `style` attribute usage has been audited or migrated,
  and tightening that blind would just break real pages. Nothing is enforced; the plan's own "report-only
  first, then enforced" order means the *next* step is watching real `/api/csp-report` data for a while
  before ever switching the header name to `Content-Security-Policy`.

**`docs/` finalization — done except the one piece that's off-limits.** `CLAUDE.md` itself is mid-edit by
the user outside this session (see git status at session start), so left untouched rather than racing an
edit already in flight. Everything else in that bullet was genuinely stale, not just missing:

- **Root `README.md`** described the repo as it was before Phase 0 — "Tooling scaffold only... apps/admin
  and apps/frontend are placeholders," migrated in later via `git subtree`. None of that has been true for
  a long time; rewrote it to describe what's actually here (structure, real commands, current phase
  status by reference to `docs/ARCHITECTURE.md` rather than duplicating it).
- **`docs/CONTRACT.md`** said "Not written yet... once tooling/generate-api-types exists" — that tool has
  existed since Phase 2 and has its own thorough README. Wrote the actual contract doc: where the
  generated types come from, what's still hand-written (response shapes — the manifest only sees
  request-side `FormRequest` rules) and not yet migrated (the ~15 features still on the hand-maintained
  `routes.ts`), and — the part this doc is actually for — what a `contract-drift` CI failure means and
  what to do about an `unknown`-typed field, rather than just linking to the generator's own README.
- **Per-app READMEs** didn't exist at all. Added `apps/frontend/README.md` and `apps/admin/README.md` —
  real structure, real `.env.example`-derived setup steps, and each app's own genuinely different gotchas
  (admin's Turbopack dev-server quirk noted earlier this session; frontend's `"use client"` placement
  rule stated with the actual reasoning, not just cross-referenced).
- **A new ADR** (`docs/adr/0002-shared-ui-style.md`) records the one decision from this session durable
  and hard-to-reverse enough to be worth one: which shadcn style `@lemonade/ui` standardized on, why (two
  of new-york's differences are objectively better independent of which app "started" with them), and
  what shipped as a side effect (admin's `Input` gained a password-visibility toggle it never had).

---

## 22. Risks, Trade-offs & Alternatives

### Conflicts with existing system requirements

Three conflicts with existing backend behaviour, named rather than designed around. All three need
backend work.

#### Conflict 1 — server-side pagination does not exist for most endpoints **[MUST]** — **resolved for all seven admin list endpoints**

- **Conflict** — This document specifies server-driven pagination with page state in the URL. The
  backend calls `paginate()` in only 10 places across ~280 actions; most list endpoints return unbounded
  collections, which is exactly why the frontends slice arrays in the browser.
- **Why it matters** — It is not a frontend problem to solve. No amount of client work stops a payload
  from growing with the platform.
- **Migration path** — Backend adds an **opt-in** paginated envelope, activated by `?page=`, keeping the
  current unpaginated response when the parameter is absent — so no consumer breaks. Prioritize the
  endpoints behind admin's largest tables: users, transactions, reporting, moderation. Frontend hooks
  are written against the paginated shape from the start and fall back to client slicing until each
  endpoint lands, so adoption is a one-line change per feature.
- **If deferred** — Admin tables degrade first and worst. This should be a backend ticket opened at the
  start of Phase 0, not discovered during Phase 6.
- **Status (2026-09-18)** — Done on the `lemonade-backend` side, committed on `ft_architecture_upgrade`
  (not yet pushed — a local branch in this workspace) as `feat(admin): add opt-in pagination to the
  largest unbounded admin lists`. Exactly the opt-in shape this conflict specifies: `?page=`/`?per_page=`
  absent → identical response to today, byte-for-byte (verified against the live backend, not assumed);
  present → the items array becomes just that page plus a `meta: {current_page, last_page, per_page,
  total}` key, same shape `ListModeratedContent`/`ListAllTransactions` already used. Covers the actual
  endpoints behind admin's real tables: `ListUsers` (708 rows today), `ListReports`, the six per-type
  transaction lists (boost/promotion/service/subscription/wallet-withdrawal/event — all six shared one
  new `App\Support\OptionallyPaginates` trait), and `GetWalletAdminDashboard` (the real endpoint behind
  `/wallet-management`, found by checking the actual route table rather than assuming `ListWalletWithdrawals`
  was it). Several summary stats (`total_transactions`, `subscribers`, `total_wallets`, ticket/revenue
  sums) were being computed by loading every row into a PHP collection just to `count()`/`sum()` it —
  switched to real DB aggregation queries as part of the same pass, since it's the identical "don't fetch
  everything" problem one layer up. 538 backend tests passing (522 pre-existing + 16 new), PHPStan and
  Pint clean, verified against the live backend with real curl requests (not just the test suite) showing
  identical totals whether paginated or not.

  **Frontend adoption — done for the four real endpoints, skipped for three that don't exist yet.**
  Wired `apps/admin`'s query hooks (users, reporting, the plan-subscriptions/wallet-withdrawals/events
  transaction tabs, and the wallet-management dashboard) to the backend's opt-in `?page=`, replacing
  client-side slicing over the full unbounded fetch. `page` lives in `searchParams` (per CLAUDE.md's "URL
  state for anything shareable"), not `useState`, for every list that didn't already have real
  client-side search to preserve. `PaginationComp` — a fully-built pager component that already existed
  in every one of these tables, wired to *local* page math — needed no changes at all, just a real
  `meta.last_page`/`onPageChange` instead of `Math.ceil(data.length / perPage)`.

  Two lists (`/users`, `/wallet-management`) have real, working client-side search/filter UI wired to
  local or URL state. Pure server pagination would silently narrow search down to whatever the current
  page happened to contain — so both now branch: no active filter → real server pagination; a filter
  active → fall back to the exact unpaginated fetch + client-side filter they always did (send no `page`
  param, get the old full-array shape back, per the same opt-in contract). `/transactions`' CSV export
  hit the identical problem one call removed — it used to read `trxData.history`, which is now just the
  current page — so it fetches its own unpaginated copy on click instead of reusing the paginated query
  state.

  **Boosting/services/promotions, fixed as a follow-up.** These three transaction tabs were commented out
  of the tab bar and their view components rendered static fixture data, not `trx_data` — genuinely
  unbuilt, not just unpaginated. `getTransactionData`'s "boosting"/"services"/"promotions" cases also
  routed to the `plan-subscriptions` endpoint instead of the backend's own dedicated
  `/admin/transaction/{boosts,services,promotions}` routes (`BOOSTS`/`SERVICES`/`PROMOTIONS` were defined
  in `adminTransactionRoutes` but never used) — confirmed live that all three backend endpoints are real
  and populated (73/84/798 transactions respectively) before doing any frontend work. Fixed the routing,
  uncommented the three tabs, and rewrote `boostingViews.tsx`/`serviceViews.tsx`/`promotionViews.tsx` to
  the same `trx_data`/`page`/`onPageChange`/`meta.last_page` pattern as the four already-migrated views,
  reading the real `PaymentTransactionResource` shape (`reference`, `user.name`, `amount`, `provider`,
  `paid_at`, `status`) instead of the old fixture's invented fields (business name, boost type, duration)
  that don't exist on the backend at all. `tableData.ts`'s three mock header/data exports were deleted and
  replaced with one shared `paymentTransactionHeaders`, since all three tabs list the same resource shape.
  `/transactions`' CSV export now covers these three tabs too (`manualTransactionsExport` gained a matching
  branch instead of falling through to its generic `Object.keys` fallback, which would have dumped
  `[object Object]` for the nested `user` field).

  Rows in these three tabs are deliberately **not** clickable to a detail page: `TransactionController.php`
  has no `boost($id)`/`promotion($id)`/`service($id)` detail method and no matching route, only the list
  endpoints. The `boosting-details`/`promotion-details`/`service-details` route directories already existed
  (inspected directly) but are themselves fully static mock pages — hardcoded "Global tech" /
  "Adebayo Akintoye" fixture content with commented-out pagination handlers, not wired to any id — so
  linking a real row into one would just trade an empty tab for a misleading one. Left alone; building
  real per-transaction detail is new backend + frontend work, out of this pass's scope.

  Verified against the live backend with real Playwright tests, not just typecheck/build:
  `tooling/e2e/tests/admin/pagination.spec.ts` clicks page 2 on `/users` and confirms the row set actually
  changes and the URL updates; confirms searching `/users` still finds a user regardless of what page
  they'd be on; clicks page 2 on `/transactions`' default tab; confirms switching tabs resets to page 1 and
  paginates the new tab independently; and confirms each of the boosting/services/promotions tabs renders
  real backend rows, not the old fixture's fixed "Global tech"/"Unlocking business potentials" text. 33 e2e
  tests passing in total.

#### Conflict 2 — the admin permission model is a single string column **[SHOULD]** — **resolved**

- **Conflict** — The admin app has a team-members feature, implying differentiated access. The backend's
  `admins` table carries one `role` column defaulting to `'admin'`, with no roles or permissions enum
  and no admin-side policies (the eight policies cover user-facing domains).
- **Why it matters** — The frontend must not invent permissions the backend cannot enforce. A UI that
  hides the payout screen from a junior operator while the API still authorizes them is security
  theatre — and worse, it reads as a control that exists.
- **Migration path** — Short term, render from what the server sends and treat every authenticated admin
  as fully privileged, because that is what is true. If differentiated access is a real requirement, the
  backend adds a roles/permissions model and exposes the effective permission set on the session
  endpoint; the frontend then renders from that list and never from a hardcoded map.
- **Status (2026-09-19) — done, backend only; nothing changes on the frontend side.** `lemonade-backend`
  (branch `ft_architecture_upgrade`, local, not pushed) adopted spatie/laravel-permission, replacing the
  `admin-write` Gate's old `$admin->role === 'admin'` string comparison with a real
  `$admin->hasPermissionTo('admin-write')` check backed by actual role/permission tables. `admins.role`
  (the plain string column) is gone; every existing admin's role was migrated automatically as part of
  the same migration sequence that adds it, read off the raw column before it's dropped. The two roles
  that already existed in the old ad-hoc `roles` lookup table (`admin`, `customer-support`) carry over
  under the same names, and only `admin` got the new `admin-write` permission — matching exactly what
  the old string check ever granted, no new granularity invented beyond that (this app has never had a
  UI or product decision for what a `customer-support` admin should specifically be allowed to do; adding
  more permissions than the one that already existed would be inventing product scope, not migrating).
  All 8 `can:admin-write`-gated route groups (wallet, subscriptions, moderation, businesses, tribes,
  events, users, team-members) are untouched — same middleware name, same routes, only what backs the
  Gate changed. `GET /admin/team-members/roles` and every `role` field in `AdminResource`/
  `AdminTeamResource` keep their exact existing shape (`role: string`), so **the admin frontend needed
  zero changes** — confirmed by grepping for the admin app's "Add Admin" form, which turned out to be a
  free-text input, not a dropdown reading that endpoint, so there was no consumer to update either way.
  Live-verified against the real running backend, not just the test suite: created a real
  `customer-support` admin via the actual `POST /admin/team-members` endpoint, confirmed it gets a real
  403 on an `admin-write`-gated action and a real 200 on a plain read, then deleted the test admin. 525
  backend tests pass (522 pre-existing + 3 new), PHPStan and Pint clean.

  **A real, unrelated pre-existing test-infrastructure bug found and fixed along the way**: three
  `DatabaseTruncation`-based full-text-search tests (`tests/{Unit,Feature}/Discovery/SearchServiceTest.php`,
  `tests/Feature/Discovery/RoutedSearchActionsTest.php`) truncate every table in the test database,
  including reference tables — this was silently already true before this change (any test depending on
  seeded `categories`/`industries`/`tags` rows running after one of these would have hit the same class
  of bug), but the new `roles`/`permissions` tables made it visible immediately, since `Admin::factory()`
  now depends on a real `roles` row existing. Diagnosed with a per-test row-count probe (not assumed) after
  ruling out caching — real data loss via a real `TRUNCATE`, not a stale cache serving empty results.
  Fixed by excluding spatie's tables from truncation, the same way Laravel's own `DatabaseTruncation` trait
  already excludes the `migrations` table by default.

- **Status (2026-09-20) — backend split into per-section permissions; frontend gating in progress.**
  The single `admin-write` permission covered all 8 route groups as one flag, which meant it could never
  express "this role can manage wallet settings but not suspend users." A follow-up migration
  (`2026_09_20_120000_split_admin_write_into_per_section_permissions`) replaces it with 8 permissions —
  one per route group (`wallet.write`, `subscriptions.write`, `moderation.write`, `businesses.write`,
  `tribes.write`, `events.write`, `users.write`, `team-members.write`) — and every route's
  `can:admin-write` middleware now reads `can:<section>.write` instead. The `admin` role got all 8,
  preserving its exact prior access; no new access granted or revoked, only the granularity of what's
  expressible. `AuthServiceProvider`'s explicit `Gate::define('admin-write', ...)` was removed entirely —
  turns out it was already dead code, since spatie/laravel-permission registers its own `Gate::before()`
  at boot that resolves any `can:<permission-name>` check against a real permission row automatically, and
  that hook runs first. `AdminResource` now exposes a `permissions: string[]` field (every permission the
  admin holds via any role) alongside the existing `role` field, so the frontend can gate off real
  capability instead of a hardcoded role-name map. 526 backend tests pass, PHPStan and Pint clean.

- **Status (2026-09-20) — frontend gating landed; a real pre-existing authorization gap found and
  closed along the way.** Auditing every admin route for `can:<section>.write` coverage (needed before
  the frontend could trust it) turned up 13 mutation routes with no permission middleware at all —
  business approve/reject/suspend/reactivate, event suspend/activate/approve/reject/update-commission,
  tribe add-thread/remove-member, user change-plan/cancel-plan, team change-password, and moderation
  forum-status. Any authenticated admin, any role, could call these regardless of permissions — a
  pre-existing gap, not something this migration introduced (confirmed via `git log` on the affected
  route files). Closed it: all 13 now carry the same `can:<section>.write` middleware as their siblings,
  with a regression test (`AdminWriteGapClosureTest`) proving a `customer-support` admin is denied on a
  representative sample. This mattered directly for the frontend work below — gating a button behind a
  permission the backend doesn't enforce is exactly the "security theatre" this repo's principles rule
  out, so the frontend gating below would have been partly cosmetic without this fix.

  On the frontend (`apps/admin`): `CurrentAdmin` now carries `role`/`permissions`, and
  `ADMIN_SECTION_PERMISSIONS` maps each of the 8 route groups to its permission name. The sidebar/bottom
  nav filter out any section the admin lacks — reads and writes both, since the backend only models one
  permission per section (no separate read grant to preserve), and direct navigation to a gated URL
  gets a real HTTP 404, not just hidden content. That 404 comes from `middleware.ts`, not from each
  page's own `notFound()` call: Next.js App Router's `notFound()`, thrown from an async Server Component
  that reads cookies (which every one of these pages must, to know who's asking), renders the correct
  not-found content but can't correct the response's status code once it starts streaming — confirmed
  with an isolated minimal reproduction (a bare `cookies()` + `notFound()` page), not assumed. Middleware
  checks the admin's permissions before any page renders and rewrites the gated request to a path with no
  matching route, so Next's ordinary "route not found" handling produces a real 404 — the same one an
  actually-nonexistent URL gets. It forwards the permissions it already fetched via an
  `x-admin-permissions` request header so the page's own `requireAdminPermission()` (kept as defense in
  depth) doesn't fetch the same profile a second time, and the client's `useCurrentAdminQuery` a third —
  found by hitting the backend's 60/min-per-admin `throttle:api` limit while testing this, before that
  optimization existed.

  Three sections had no real write UI to gate at all, so building it was part of this pass: businesses
  (list, detail, approve/reject/suspend/reactivate/delete — was a literal empty `<div></div>` stub),
  subscriptions (plan list, create/edit, activate/deactivate/delete — brand new section, backend routes
  existed but had zero frontend consumer), and tribes (list and detail were 100% hardcoded fixture data,
  not wired to the backend at all — now real, plus restrict/reactivate/delete actions on the detail page).

  Verified against the real running backend: `pnpm --filter lemonade-admin typecheck/lint/build` all
  clean, and a Playwright suite (`permission-gating.spec.ts`) against a real second admin seeded with the
  `customer-support` role and zero permissions — confirms the sidebar hides every gated section for that
  admin while a full-permission admin sees all of them, and confirms a real 404 status for direct
  navigation to every gated route. (Two tests around the heaviest route, `/users` — a 708-row list — flake
  under the full suite's back-to-back load against the single-threaded `php artisan serve` dev server and
  the same `throttle:api` limit; both pass cleanly in isolation. Test-environment artifact, not a product
  bug — same category as this repo's pre-existing `GetTotalSubscriptionRevenueTest` flake.)

#### Conflict 3 — the BFF changes where the backend sees requests from **[SHOULD]** — **resolved**

- **Conflict** — Today requests reach Laravel from browsers. Under the BFF, they arrive from the Next
  server — changing origin, IP, and user-agent as the backend observes them. The backend applies rate
  limiting (`throttle:auth`), sets `CorrelationId`, and has VPN-detection error handling
  (`vpn-service-unavailable`).
- **Why it matters** — Per-IP throttling would see one IP for all users and could rate-limit the whole
  platform on a busy login minute. Any IP-based geo or VPN logic would evaluate the server's location,
  not the user's.
- **Migration path** — Before flipping the BFF flag in production: confirm the backend's `TrustProxies`
  configuration honours `X-Forwarded-For`; have the BFF forward the client IP, user-agent and
  correlation id; verify throttle keys resolve to the end user, not the proxy. Test this in staging
  under load — it is the single most likely BFF surprise, and it fails in a way that looks like an
  outage.
- **Status (2026-09-18) — fixed.** The backend side was already fine: `TrustProxies` trusts
  `X-Forwarded-For`/`-Host`/`-Port`/`-Proto` from any proxy (`$proxies = '*'`), so it resolves the real
  client IP correctly once it receives the header — nothing to change there. `app/api/v1/[...path]/route.ts`
  in both apps now forwards the inbound request's own `X-Forwarded-For` and `User-Agent` headers to the
  backend alongside the existing `X-Correlation-Id`, so `throttle:auth`/`throttle:otp` (both keyed on
  `$request->ip()`) resolve to the actual end user instead of the Next server's own IP. Forwarded as-is,
  never fabricated — a request with no upstream proxy in front of Next (e.g. this repo's own local dev)
  simply carries no `X-Forwarded-For`, same as before; this only starts mattering once something (a load
  balancer, Vercel's edge network, etc.) sits in front of the Next server in a real deployment and sets
  that header on the way in.

  Live-verified the actual header forwarding, not just read the code: pointed the admin app's
  `LARAVEL_API_URL` at a throwaway local echo server in place of the real backend, hit the BFF proxy
  through a real running `next dev` with `curl -H "X-Forwarded-For: 203.0.113.42" -H "User-Agent:
  verification-agent/1.0"`, and confirmed both headers arrived at the echo server unchanged alongside the
  proxy's own `X-Correlation-Id`. Restored the real backend config afterward and re-ran the full admin
  Playwright pagination suite (8 tests) against it to confirm no regression.

### Risk register

| Risk                                                       | Likelihood | Impact | Mitigation                                                                                                                                                               |
| ---------------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Refactor stalls half-migrated; both patterns live forever  | High       | High   | Migrate per domain with a definition of done that includes _deleting_ the old slice. Track remaining thunks as a burn-down; a domain is not done while both paths exist. |
| Contract drift recurs after the current break is fixed     | Medium     | High   | Generated types + contract-drift CI check. This is the specific failure that caused today's outage.                                                                      |
| Shared package becomes the everything-package              | Medium     | Medium | Five packages with the four rules in §7, enforced by `eslint-plugin-boundaries`. Review rejects app-shaped parameters.                                                   |
| React 19 blocked by an unmaintained dependency             | Medium     | Medium | Audit before upgrading; the two known blockers are already dead code. Replace rather than pin.                                                                           |
| BFF proxy breaks rate limiting or geo logic                | Medium     | High   | Conflict 3 above. Staging load test before the production flag flip.                                                                                                     |
| Team unfamiliar with Server Components / TanStack Query    | Medium     | Medium | Phase 5 starts with low-risk domains so the pattern is learned on reference data, not on wallets. Document the first migrated domain as the worked example.              |
| Removing the global cache visibly increases request volume | High       | Low    | Expected and correct. Per-query `staleTime` recovers most of it; the backend gains observability into real traffic it currently cannot see.                              |
| Feature work competes with migration for the same files    | High       | Medium | Sequence by domain and agree the order with product. A domain being migrated is frozen for feature work for that sprint only.                                            |

### Alternatives considered and rejected

| Alternative                                          | Why rejected                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Rewrite both apps from scratch**                   | 50k LOC encoding years of product behaviour, much of it undocumented outside the code. The backend team explicitly withdrew a greenfield rewrite for the same reason (architecture guide §0) and the same logic applies here. Incremental migration keeps the product shippable throughout.                                                                                                        |
| **RTK Query instead of TanStack Query**              | Defensible — it would reuse existing Redux knowledge and is a smaller conceptual jump. Rejected because it keeps server state inside the store the plan is trying to shrink, and has weaker Server Component and streaming-hydration support, which §6 depends on. If the team strongly prefers staying in Redux, this is the one substitution in this document that would not undermine the rest. |
| **Keep Formik, add types**                           | Cheaper short term. Rejected because Formik is in maintenance, the re-render cost is already visible on the large wizards, and Yup schemas cannot serve as the type source — leaving the `any` problem partly unsolved.                                                                                                                                                                            |
| **Keep tokens in JS, skip the BFF**                  | Saves the largest single piece of work. Rejected because it leaves a live-token XSS exposure on a platform handling wallets and payouts, and it forecloses Server Components — which means forfeiting most of §15 as well.                                                                                                                                                                         |
| **Merge admin into the user app**                    | Different auth guards, different audiences, different deployment posture. Would ship admin code to public browsers.                                                                                                                                                                                                                                                                                |
| **Do nothing structural; just fix the API contract** | A legitimate option if the priority is purely to restore service. It restores the apps in days. It leaves every finding in §3 in place, and each subsequent feature makes the eventual migration more expensive. Reasonable as a stopping point after Phase 0 _only_ if the security items in §16 are still completed.                                                                             |

---

## 23. Definition of Done

> Every criterion below is measurable against a baseline captured on 10 September 2026. A phase is done
> when its numbers move, not when its pull requests merge.
>
> **Current column added 14 September 2026** — re-measured with the same method as the baseline
> where practical (`grep`, file counts). Rows without a fresh count are marked "not re-measured this
> revision" rather than guessed; don't read a blank as zero.

### Measurable targets

| Metric                            | Baseline |                                                                                                                                                                      Current |                Target | Phase  | How verified                                 |
| --------------------------------- | -------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | --------------------: | ------ | -------------------------------------------- |
| Endpoints reachable against `/v1` |        0 |                                                                                                                              All except 3 (flagged, need a product decision) |                   All | P0     | Smoke pass over the ten journeys             |
| `: any` annotations               |      574 |                                                                                                                                                                          499 |                  < 50 | P3–P5  | `grep`, tracked per PR                       |
| `createAsyncThunk`                |      151 |                                                                                                                                       136 (4 domains' slices deleted so far) |                     0 | P5     | Burn-down; slices deleted, not just bypassed |
| Manual `Authorization` headers    |       87 |                                                                                                                  15 (was 17; 2 Pusher-config files fixed 14 Sept, see below) |                     0 | P4     | Lint rule, then `grep`                       |
| Tokens reachable from JavaScript  | 3 stores | 1 remaining by design (the pre-login onboarding-flow `newToken` cookie, JS-readable, functionally necessary — see §21 Phase 4); the other 2 (Redux, localStorage) are closed |                     0 | P4     | DevTools inspection + lint rule              |
| Client-side pagination sites      |        7 |                                                          All 7 wired to real server pagination (users, reporting, all six transaction tabs, wallet-management) |                     0 | P6     | Requires Conflict 1 resolved — **done**      |
| Effects with wrong deps           |       32 |                                                                                                                                                not re-measured this revision |                     0 | P1     | `exhaustive-deps` as error                   |
| `console.log` in shipped code     |       62 |                                                                                                                                                                           57 |                     0 | P1     | `no-console` as error                        |
| Duplicated / diverged files       |       41 |                                                                                                                                                not re-measured this revision |                     0 | P2     | Cross-app path diff in CI                    |
| Unimported runtime deps           |       50 |                                                                                                                                                not re-measured this revision |                     0 | P0, P7 | `knip` in CI                                 |
| UI component systems              |        4 |                                                                                                                                                not re-measured this revision |                     1 | P7     | Import ban lint rule                         |
| Test files                        |        0 |                                                                                                                                          1 (`packages/api-client`, 15 tests) | ≥ 90% on `packages/*` | P1–P8  | Vitest coverage gate                         |
| Apps with CI                      |        0 |                                                                                                                                                                            0 |                     2 | P1     | Required checks on `main`                    |
| Apps with lint config             |        0 |                                                                                                                                                                            0 |                     2 | P1     | CI fails on warnings                         |
| Apps with route protection        | 1 (weak) |                                                                           2, live-verified manually (httpOnly cookie + `middleware.ts` in both apps) — not yet e2e-automated |         2 (validated) | P4     | e2e: unauthenticated deep link redirects     |
| Public routes server-rendered     |        0 |                                                                                                                                                                            0 |     All in `(public)` | P6     | View source shows content pre-hydration      |
| Hardcoded pixel classes           |    7,041 |                                                    4,078 (2,591 frontend + 1,487 admin) — measured fresh via the new `local/no-hardcoded-pixel-class` rule, not the stale count |     Declining, no new | P7     | Lint warning; ratchet on the count — **done** |

**Update, checked and fixed 14 September 2026:** the Pusher channel-auth risk flagged above (2 of the 17
remaining `Authorization`-header files) was real on both sides. Frontend read a `token` cookie that
hasn't existed since the httpOnly cutover; admin pointed at two custom endpoints
(`/pusher/auth/{user,channel}`) that never existed as backend routes at all. Underneath that, the
backend's own `/broadcasting/auth` route was registered under Laravel's default `web` middleware group
(session-cookie auth) instead of the `auth:user` Sanctum guard this API actually uses — so even a
correctly-sent Bearer token was never checked; `auth()->user()` was always null. A separate bug in
`MessageSent::broadcastOn()` double-prefixed the channel name, so even fully-fixed auth would have
listened on a channel nothing was ever broadcast to. All three fixed: `lemonade-backend` commit
`b4ecd0d`, this repo's commit `092e4f9`. Live-verified end to end (real signing, no real Pusher account
needed — channel-auth is a local HMAC computation): a user's own channel now authenticates correctly,
someone else's 403s, no session 401s. Admin's side is fixed for consistency but still has zero live
consumers and no backend-registered admin channel — don't take its presence as evidence the feature is
built, only that the plumbing that would carry it is no longer broken.

### Acceptance criteria by phase

| Phase  | Done when                                                                                                                                                                                                                                                                                                                                              |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **P0** | Both apps run against the live backend and all ten journeys complete manually. A new developer can clone, install, copy `.env.example`, run, and log in — with no tribal knowledge. Dead dependencies removed. Admin dev and build use the same asset pipeline.                                                                                        |
| **P1** | CI runs lint, typecheck and build on every PR and blocks merge. Zero lint warnings. Env validation fails the build on a missing variable. Characterization tests exist for the first domain to be migrated.                                                                                                                                            |
| **P2** | One repo builds both apps with Turborepo affected-graph CI. `@lemonade/config`, `@lemonade/domain` and generated `@lemonade/api-types` are consumed by both. Boundary lint rules pass. Contract-drift check is green and demonstrably fails when the backend changes. Old repos archived.                                                              |
| **P3** | Both apps on the same Next major and React 19. No hydration warnings in development. No dependency pinned to React 18. Full smoke pass green.                                                                                                                                                                                                          |
| **P4** | No token is reachable from browser JavaScript. Zero manual `Authorization` headers. Refresh triggers on 401, sends the token in the body, coalesces concurrent requests, and fails cleanly once. Both apps gate routes in middleware. The global GET cache and `useRequest` are deleted. Rate limiting verified correct behind the proxy (Conflict 3). |
| **P5** | Zero `createAsyncThunk`. Every domain's slice is deleted, not merely unused. redux-persist holds no server data. Every form uses RHF + Zod with server 422s mapped onto fields. `checkError.ts`, `Skeletons.tsx` and `tableData.ts` are gone.                                                                                                          |
| **P6** | Public user-app routes render meaningful HTML before hydration and carry correct metadata. Table state lives in `searchParams`. Bundle budgets enforced in CI and met. LCP under 2.5s on a throttled mobile profile for public pages.                                                                                                                  |
| **P7** | One component system, one token set, one shadcn style. MUI, antd and Evergreen removed and import-banned. No serious or critical axe violations on forms, dialogs, tables and navigation.                                                                                                                                                              |
| **P8** | Frontend errors reach Sentry with a correlation id that joins the backend's log for the same request. CSP enforced. Ten Playwright journeys green in the merge queue. `docs/` complete, including a root `CLAUDE.md` an agent can follow.                                                                                                              |

### Standing rules — true at the end of every phase

- Both applications are deployable at every commit on `main`. No long-lived refactor branches.
- No feature exists in both the old and new pattern at the end of a phase.
- The backend remains the sole authority on business rules, money and authorization.
- Every architectural decision that departs from this document is recorded as an ADR — including the
  reason it departed.

---

## On using this document

Sections **9, 10 and 13** are the operative ones for an implementing developer or agent: folder
structure, coding patterns, and the auth flow. Section **3** is the list of things that are actually
broken today. Section **23** is how to tell whether any of it worked.

Where this document and the running backend disagree, **the backend is correct and this document is out
of date** — fix it here and note the change.
