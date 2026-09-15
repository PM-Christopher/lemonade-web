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

> **Backend observation, out of scope.** `app/Exceptions/Handler.php` defines `isApiRoute()` as
> `str_starts_with($request->path(), 'api/')`, with a comment asserting routes are served under
> `api/`. Since `apiPrefix` is `''`, that predicate is false for all 288 real routes; JSON rendering
> currently survives on `expectsJson()` because `ForceJsonResponse` sets the `Accept` header. It
> works, but for a different reason than the code claims. Worth a backend ticket — flagged here
> because the frontends depend on the error envelope it produces.

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

### Error boundaries per route segment

Neither app has a single `error.tsx` today; a render failure blanks the page. Every route group gets
`error.tsx` (recoverable, with retry), `not-found.tsx` and `loading.tsx`, plus a root
`global-error.tsx`. The blast radius of a failure should be one segment, not the application.

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

### Phase 2 — Monorepo consolidation **[MUST]** **[MOSTLY DONE]**

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
(`adminAuthRoutes` exists in both). Migrating the ~15 features that import from `routes.ts` today
over to the generated output is real, separate, mechanical follow-up work, not folded into standing
the pipeline up. See `tooling/generate-api-types/README.md` for the full picture.

Not done: archiving the old `lemonade/{admin,frontend}` repos —
`github.com/PM-Christopher/lemonade-admin` and `github.com/PM-Christopher/lemonade-frontend`, found by
checking the local checkouts' own `git remote -v`. A destructive action on repos outside this one, so
left for direct action rather than automated from here; no tooling access to do it automatically
either way (no `gh` CLI in this environment). They still exist, untouched, now stale relative to this
monorepo (see the canonical-location note at the top of this document).

### Phase 3 — Version alignment **[MUST]** **[Blockers cleared — bump not started]**

Once, in one dependency graph, before the refactors that would otherwise be written twice.

- Audit every UI dependency for React 19 support; replace unmaintained ones
- Frontend app to the same Next major as admin; run the async-request-API codemod
- React 19 in both apps; work through hydration warnings rather than suppressing them
- `images.domains` → `remotePatterns`, restricted to Cloudinary and DO Spaces
- Tighten `tsconfig`; `no-explicit-any` as a warning with a declining budget

**Status:** The Next 14/15 asymmetry this phase would remove is real and current, and has already
required care in Phase 4/5 work: `apps/frontend` is Next 14.2.7 (`cookies()` and Route Handler
`params` are synchronous), `apps/admin` is Next 15.1.11 (both are async/a Promise). The two apps'
`server-api.ts` and `app/api/v1/[...path]/route.ts` are deliberately not identical because of this —
don't "fix" one to match the other without checking which Next major it's actually on.

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

Not started: the Next 15 unification + async-request-API codemod, the React 19 bump itself, and
tightening `tsconfig`/`no-explicit-any`'s budget (the `no-explicit-any: "warn"` override landed in
Phase 1 already anticipates this — see that phase's status — but the "declining budget" enforcement
mechanism itself isn't built). The actual version bumps are real, cross-cutting risk to both
production-ish apps with no end-to-end test coverage to catch behavioral regressions — deliberately
not started without checking in first, same as the rest of this phase's higher-risk items.

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
`Skeletons.tsx`/`tableData.ts` retirement hasn't started. **All of `apps/admin`'s tracked Phase 5
domains are now on TanStack Query** — no `features/*/*.slice.ts` files remain under `apps/admin`.
(`redux/general.slice.ts` still exists but was never one of the tracked domains and turned out to be
fully dead — no importers anywhere, not even wired into `store.ts` — found while checking for
stragglers; left alone since deleting unrelated dead code wasn't asked for, worth a cleanup pass later.)
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
3. **Found, not fixed — needs a decision**: `UpdateBusiness` calls `findBusiness($id)` with the default
   `approvedOnly: true`, so a business owner can only edit their own listing once an admin has approved
   it — meaning newly-created (`PENDING`) listings can't be edited at all, which is presumably the most
   common time someone would want to. The trait's own doc comment says "the owner's own views... pass
   false," suggesting this is a missed argument, not deliberate — but that's a guess, not confirmed.
   Confirmed live: update 400s ("Business not found") against a real owned `PENDING` listing, succeeds
   against the same listing flipped to `ACTIVE`.
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

### Phase 6 — Server Components & performance **[SHOULD]** **[NOT STARTED]**

Now possible, because auth is server-readable and data fetching is query-shaped.

- User app: `(public)` route group — event, tribe, business, discover as Server Components with metadata
  and Open Graph
- Admin: server-render list shells, keep tables as client islands
- Server-side pagination as backend endpoints land it; move page/sort/filter state into `searchParams`
- Lazy-load heavy leaves; add bundle budgets and Lighthouse CI to the PR pipeline

### Phase 7 — Design system **[SHOULD]** **[NOT STARTED]**

Deferred deliberately: visible, but not structural. Safe to run in parallel with P5 if capacity allows.

- Settle on one shadcn style; lift primitives into `@lemonade/ui`
- One Tailwind preset with real tokens; arbitrary pixel values become lint warnings
- Remove MUI, antd and Evergreen; add the import ban
- Accessibility pass: focus management, dialog semantics, table headers, contrast

### Phase 8 — Observability & hardening **[SHOULD]** **[NOT STARTED]**

Closes the loop with the backend, which already reports to Sentry.

- Sentry in both apps, sharing the backend's correlation id so a frontend error joins its backend request
- Web Vitals reporting; structured logging with redaction; remove the last `console` calls
- CSP with nonces via middleware — report-only first, then enforced
- Playwright e2e for the ten journeys in the merge queue
- `docs/` finalized: ARCHITECTURE, ADRs, CONTRACT, per-app READMEs, root `CLAUDE.md`

---

## 22. Risks, Trade-offs & Alternatives

### Conflicts with existing system requirements

Three conflicts with existing backend behaviour, named rather than designed around. All three need
backend work.

#### Conflict 1 — server-side pagination does not exist for most endpoints **[MUST]**

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

#### Conflict 2 — the admin permission model is a single string column **[SHOULD]**

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

#### Conflict 3 — the BFF changes where the backend sees requests from **[SHOULD]**

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
- **Status — this conflict is now live; one side is ready, the other isn't.** The BFF shipped in Phase 4
  (§21) without the flag this section assumes. The backend side is actually fine: `TrustProxies` already
  trusts `X-Forwarded-For`/`-Host`/`-Port`/`-Proto` from any proxy (`$proxies = '*'`), so it would
  resolve the real client IP correctly if it received the header. It doesn't: `app/api/v1/[...path]/route.ts`
  in both apps forwards only `X-Correlation-Id` and, for multipart bodies, `Content-Type` — no
  `X-Forwarded-For` or user-agent. This hasn't caused a known problem yet (local/dev traffic only so
  far), but per-IP throttling (`throttle:auth`, `throttle:otp`) is currently keyed on the Next server's
  own IP for every real request, exactly the failure mode this section warns about. The fix is entirely
  on the frontend side — add the header to the proxy's outbound request — and is small; worth doing
  before this reaches real user traffic, not discovered later.

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
| Client-side pagination sites      |        7 |                                                                                                                                                not re-measured this revision |                     0 | P6     | Requires Conflict 1 resolved                 |
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
| Hardcoded pixel classes           |    7,041 |                                                                                                                                                not re-measured this revision |     Declining, no new | P7     | Lint warning; ratchet on the count           |

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
