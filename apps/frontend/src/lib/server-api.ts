import "server-only";

// Server-side only — reads the httpOnly session cookie and calls
// lemonade-backend directly. Use from Server Components, Route Handlers and
// Server Actions. Never import this into a Client Component; the bundler
// will refuse to build if you do (that's what `server-only` is for).
//
// Both apps are on Next 15 now (Phase 3), so `cookies()` is ASYNC in both —
// this file and apps/admin/src/lib/server-api.ts are deliberately kept in
// the same shape.
import { cookies } from "next/headers";
import { createApiClient, getSetCookieValue, type ApiClient } from "@lemonade/api-client";
import { userAuthRoutes } from "@lemonade/api-types/generated";
import { USER_TOKEN_COOKIE, USER_REFRESH_COOKIE, SIGNED_IN_COOKIE } from "@/lib/cookie-names";
import { serverEnv } from "@/lib/env.server";

export { USER_TOKEN_COOKIE, USER_REFRESH_COOKIE };

const LARAVEL_API_URL = serverEnv.LARAVEL_API_URL;

// Fallback only — real callers always have a concrete `expires_in` from the
// backend's login/refresh response (see persistUserSession/onRefreshed
// below). Matches sanctum.ac_expiration's current default (60 min).
const DEFAULT_ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 60;
const REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // sanctum.rf_expiration's current default (30 days)

async function getToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(USER_TOKEN_COOKIE)?.value;
}

async function getRefreshToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(USER_REFRESH_COOKIE)?.value;
}

// Cookie writes only succeed inside a Route Handler or Server Action. If a
// refresh is triggered by a plain Server Component read (a GET during
// render), Next throws on the write — that's fine, we swallow it here: the
// refreshed token still lets *this* request succeed, the write-back just
// doesn't stick, so the next request refreshes again. Better than crashing
// the render.
async function persistAccessToken(token: string, maxAgeSeconds: number): Promise<void> {
  try {
    const store = await cookies();
    store.set(USER_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: maxAgeSeconds,
    });
  } catch {
    // Not in a writable context — see comment above.
  }
}

async function persistRefreshToken(token: string): Promise<void> {
  try {
    const store = await cookies();
    store.set(USER_REFRESH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
    });
  } catch {
    // Not in a writable context.
  }
}

// Same options as the real access-token cookie above — this one just
// carries no secret, so its only job is presence/absence. See
// cookie-names.ts's SIGNED_IN_COOKIE comment for the full picture.
async function persistSignedInCookie(maxAgeSeconds: number): Promise<void> {
  try {
    const store = await cookies();
    store.set(SIGNED_IN_COOKIE, "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: maxAgeSeconds,
    });
  } catch {
    // Not in a writable context.
  }
}

async function clearSignedInCookie(): Promise<void> {
  try {
    const store = await cookies();
    store.delete(SIGNED_IN_COOKIE);
  } catch {
    // Not in a writable context.
  }
}

/**
 * Relays the backend's own Set-Cookie decision for SIGNED_IN_COOKIE onto
 * this app's outgoing response — called by the BFF proxy and the login
 * route right after a `requestWithHeaders` call, so the cookie's sliding
 * window is driven by the backend's real per-request authentication state
 * (see lemonade-backend's SyncSignedInCookie/SignedInCookieSignal), not
 * reimplemented here. The header is read, never parsed for attributes —
 * this app decides its own maxAge/secure/sameSite/path independently,
 * matching this file's other cookies. A header that never mentions this
 * cookie at all is left alone (backend not upgraded yet, or an
 * unauthenticated public endpoint); an empty value means the backend
 * explicitly cleared it.
 */
export async function syncSignedInCookieFromHeaders(
  headers: Record<string, string | string[] | undefined>,
): Promise<void> {
  const value = getSetCookieValue(headers, SIGNED_IN_COOKIE);
  if (value === undefined) return;
  if (value === "") {
    await clearSignedInCookie();
  } else {
    await persistSignedInCookie(DEFAULT_ACCESS_TOKEN_MAX_AGE_SECONDS);
  }
}

export async function clearUserSession(): Promise<void> {
  try {
    const store = await cookies();
    store.delete(USER_TOKEN_COOKIE);
    store.delete(USER_REFRESH_COOKIE);
    store.delete(SIGNED_IN_COOKIE);
  } catch {
    // Not in a writable context.
  }
}

export const backendApi: ApiClient = createApiClient({
  baseURL: `${LARAVEL_API_URL}/v1`,
  getToken,
  refresh: {
    refreshPath: userAuthRoutes.REFRESH,
    getRefreshToken,
    onRefreshed: async (accessToken, refreshToken, expiresIn) => {
      await persistAccessToken(accessToken, expiresIn ?? DEFAULT_ACCESS_TOKEN_MAX_AGE_SECONDS);
      if (refreshToken) await persistRefreshToken(refreshToken);
      // This refresh can happen deep inside the interceptor, servicing an
      // unrelated Server Component's call — there's no response object here
      // to relay the backend's own Set-Cookie header onto (see
      // syncSignedInCookieFromHeaders). A successful refresh is exactly the
      // condition lemonade-backend's TokenRotationService itself uses to
      // mark the visitor signed in, so setting it directly here is
      // correct, not a guess.
      await persistSignedInCookie(expiresIn ?? DEFAULT_ACCESS_TOKEN_MAX_AGE_SECONDS);
    },
  },
  onUnauthorized: clearUserSession,
});

export async function persistUserSession(
  accessToken: string,
  refreshToken?: string,
  expiresIn?: number,
): Promise<void> {
  await persistAccessToken(accessToken, expiresIn ?? DEFAULT_ACCESS_TOKEN_MAX_AGE_SECONDS);
  if (refreshToken) await persistRefreshToken(refreshToken);
}
