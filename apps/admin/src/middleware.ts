import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_TOKEN_COOKIE } from "@/lib/cookie-names";

// UX redirect only — Laravel Policies remain the only real authorization
// authority (see docs/ARCHITECTURE.md, "Authentication & Authorization").
// This didn't exist at all before Phase 4; admin route protection used to
// depend entirely on an API call failing and an axios interceptor
// redirecting after the page had already shelled out and rendered.

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

export function middleware(req: NextRequest) {
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
  if (token) return next();

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", `${pathname}${search || ""}`);

  const res = NextResponse.redirect(loginUrl);
  res.headers.set("Content-Security-Policy-Report-Only", buildCsp(nonce));
  return res;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
