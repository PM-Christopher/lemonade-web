// middleware.ts (project root)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { USER_TOKEN_COOKIE, SIGNED_IN_COOKIE } from "@/lib/cookie-names";

// UX redirect only — Laravel Policies remain the only real authorization
// authority. Now checks the httpOnly lemonade_user_token cookie set by
// app/api/auth/login/route.ts, now that login is cut over to it — see
// src/lib/server-api.ts. The old JS-readable "token" cookie is no longer
// set by anything; a session created before this cutover won't carry the
// new cookie and will be redirected to log in again once.

// Content-Security-Policy-Report-Only — report-only, so nothing here can
// break a page; violations land at /api/csp-report (see that route and
// docs/ARCHITECTURE.md Phase 8). Covers this app's real external
// integrations: Firebase Cloud Messaging (push notifications + its service
// worker), Google Identity Services (login/signup's "Sign in with
// Google"), Reverb (Connect's realtime channel), and the two image hosts
// already allow-listed in next.config.mjs. `style-src` still needs
// 'unsafe-inline' — much of this app's UI sets the `style` attribute
// directly rather than a class, and auditing/migrating that is its own
// pass, not something to silently break by tightening the policy here.
// Nothing is enforced yet; tightening this from real report-only data is
// the next step before ever flipping to `Content-Security-Policy`.
//
// ADR-005: self-hosted Reverb, not Pusher Cloud — the browser opens the
// websocket directly to Reverb's own host:port (not proxied through this
// app's origin), so 'self' doesn't cover it; the ws(s) target is built from
// the same NEXT_PUBLIC_REVERB_* vars src/config/pusherConfig.ts uses.
function buildCsp(nonce: string) {
  const reverbHost = process.env.NEXT_PUBLIC_REVERB_HOST || "localhost";
  const reverbPort = process.env.NEXT_PUBLIC_REVERB_PORT || "8080";
  const reverbWsScheme = process.env.NEXT_PUBLIC_REVERB_SCHEME === "https" ? "wss" : "ws";

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://accounts.google.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https://dev-lemonade-bucket.lon1.digitaloceanspaces.com https://res.cloudinary.com https://lh3.googleusercontent.com",
    "font-src 'self' data:",
    `connect-src 'self' https://fcm.googleapis.com https://firebaseinstallations.googleapis.com ${reverbWsScheme}://${reverbHost}:${reverbPort}`,
    "frame-src https://accounts.google.com",
    "worker-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "report-uri /api/csp-report",
  ].join("; ");
}

const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/verify-code",
  "/profile-setup",
];

const PROTECTED_PREFIXES = ["/event", "/tribe", "/business", "/", "/settings"];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.includes(pathname);
}
function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
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
  if (!isProtected(pathname)) return next();

  // Either cookie's presence is enough — both are the same non-authoritative
  // UX signal. SIGNED_IN_COOKIE is preferred going forward (backend-driven
  // sliding window, non-sensitive value), but USER_TOKEN_COOKIE stays as a
  // fallback so a session that predates this cookie isn't redirected once
  // just because it hasn't made an authenticated call yet to pick it up.
  const signedIn =
    Boolean(req.cookies.get(SIGNED_IN_COOKIE)?.value) || Boolean(req.cookies.get(USER_TOKEN_COOKIE)?.value);
  if (signedIn) return next();

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
