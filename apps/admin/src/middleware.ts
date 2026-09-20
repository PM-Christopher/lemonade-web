import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_TOKEN_COOKIE } from "@/lib/cookie-names";
import { ADMIN_SECTION_PERMISSIONS } from "@/features/authentication/permissions";
import { adminAccountRoutes } from "@lemonade/api-types/generated";

// UX redirect only for the login gate below — Laravel Policies remain the
// only real authorization authority (see docs/ARCHITECTURE.md,
// "Authentication & Authorization"). This didn't exist at all before Phase
// 4; admin route protection used to depend entirely on an API call failing
// and an axios interceptor redirecting after the page had already shelled
// out and rendered.
//
// The per-section permission check below this one is NOT just UX, though —
// it's here specifically so a restricted admin gets a real HTTP 404 for a
// gated section, not just the right content with a 200 status. Next.js App
// Router's `notFound()`, called from an async Server Component that reads
// cookies (as every one of these pages must, to know who's asking), renders
// the correct not-found content but can't correct the status code once the
// response has started streaming — confirmed with an isolated minimal
// reproduction, not assumed (see docs/ARCHITECTURE.md §22 Conflict 2). Doing
// the check here, before any page rendering starts, and using `rewrite()` to
// a path with no matching route lets Next's own ordinary "route not found"
// handling produce a real 404 — the same one an actually-nonexistent URL
// gets. The cost: an extra backend round-trip per navigation to a gated
// section. `requireAdminPermission` in each page.tsx stays in place too,
// as defense in depth — this repo's authorization layers are UX
// convenience on top of the real thing, and the real thing is still the
// backend's `can:<section>.write` middleware regardless of what happens here.

// Content-Security-Policy-Report-Only — report-only, so nothing here can
// break a page; violations land at /api/csp-report (see that route and
// docs/ARCHITECTURE.md Phase 8). Simpler than frontend's policy: this app
// has no Firebase or Google OAuth, just Pusher (realtime) and the two
// image hosts already allow-listed in next.config.mjs. `style-src` still
// needs 'unsafe-inline' for the same reason as frontend's — see that
// app's src/middleware.ts. Nothing is enforced yet.
function buildCsp(nonce: string) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https://dev-lemonade-bucket.lon1.digitaloceanspaces.com https://res.cloudinary.com",
    "font-src 'self' data:",
    "connect-src 'self' wss://*.pusher.com https://*.pusher.com https://*.pusherapp.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "report-uri /api/csp-report",
  ].join("; ");
}

const PUBLIC_PATHS = ["/login", "/forgot-password", "/reset-password"];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

// Path prefix -> required permission. Kept here rather than imported from
// utils/pageLinks.ts so middleware.ts (Edge runtime) never risks pulling in
// anything client-only through a shared module — pageLinks.ts is fine today,
// but nothing enforces it staying that way. Mirror any change to that file's
// `permission` field here too.
const GATED_PATH_PERMISSIONS: ReadonlyArray<{ prefix: string; permission: string }> = [
  { prefix: "/wallet-management", permission: ADMIN_SECTION_PERMISSIONS.wallet },
  { prefix: "/users", permission: ADMIN_SECTION_PERMISSIONS.users },
  { prefix: "/businesses", permission: ADMIN_SECTION_PERMISSIONS.businesses },
  { prefix: "/tribes", permission: ADMIN_SECTION_PERMISSIONS.tribes },
  { prefix: "/events", permission: ADMIN_SECTION_PERMISSIONS.events },
  { prefix: "/subscriptions", permission: ADMIN_SECTION_PERMISSIONS.subscriptions },
  { prefix: "/reporting", permission: ADMIN_SECTION_PERMISSIONS.moderation },
  { prefix: "/team", permission: ADMIN_SECTION_PERMISSIONS.teamMembers },
];

function requiredPermissionFor(pathname: string): string | null {
  const match = GATED_PATH_PERMISSIONS.find(
    (g) => pathname === g.prefix || pathname.startsWith(`${g.prefix}/`),
  );
  return match?.permission ?? null;
}

// A direct fetch, not the axios-based backendApi (lib/server-api.ts) — Edge
// can't run that (see lib/cookie-names.ts's comment). No-store: a stale
// cached "yes" here would be a real permission bypass, not just staleness.
//
// Fetched once per gated navigation and forwarded to the page via the
// x-admin-permissions header (see below) — without that, this route's own
// requireAdminPermission() would fetch the exact same profile a second
// time, and the client's useCurrentAdminQuery a third, tripling the load
// against the backend's 60/min-per-admin `throttle:api` limit for every
// single navigation. Found by hitting that limit running this suite.
async function getAdminPermissions(token: string): Promise<string[] | null> {
  try {
    const response = await fetch(`${process.env.LARAVEL_API_URL}/v1${adminAccountRoutes.PROFILE}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const body = await response.json();
    const permissions: unknown = body?.data?.admin?.permissions;
    return Array.isArray(permissions) ? permissions : null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);

  function next() {
    const res = NextResponse.next({ request: { headers: requestHeaders } });
    res.headers.set("Content-Security-Policy-Report-Only", buildCsp(nonce));
    return res;
  }

  if (isPublic(pathname)) return next();

  // Login is now cut over to the httpOnly cookie (see
  // src/lib/server-api.ts) — a session created before this cutover won't
  // carry it and will be redirected to log in again once.
  const token = req.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", `${pathname}${search || ""}`);

    const res = NextResponse.redirect(loginUrl);
    res.headers.set("Content-Security-Policy-Report-Only", buildCsp(nonce));
    return res;
  }

  const requiredPermission = requiredPermissionFor(pathname);
  if (requiredPermission) {
    const permissions = await getAdminPermissions(token);
    if (!permissions?.includes(requiredPermission)) {
      // Rewritten to a path with no matching route, so Next's own ordinary
      // "route not found" handling renders it — a real 404 status, not just
      // the right content (see the long comment above this file's PUBLIC_PATHS).
      // The browser's address bar keeps showing the original URL.
      const notFoundUrl = req.nextUrl.clone();
      notFoundUrl.pathname = "/__section_not_permitted__";
      const res = NextResponse.rewrite(notFoundUrl, { status: 404 });
      res.headers.set("Content-Security-Policy-Report-Only", buildCsp(nonce));
      return res;
    }
    // Already fetched for the check above — forward it so
    // requireAdminPermission() (page.tsx) reads this instead of fetching
    // the same profile again.
    requestHeaders.set("x-admin-permissions", permissions.join(","));
  }

  return next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
