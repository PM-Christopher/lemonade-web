import "server-only";

// Server-side only — reads the httpOnly session cookie and calls
// lemonade-backend directly. Use from Server Components, Route Handlers and
// Server Actions. Never import this into a Client Component.
//
// Both apps are on Next 15 now (Phase 3), so `cookies()` is ASYNC in both —
// this file and apps/frontend/src/lib/server-api.ts are deliberately kept in
// the same shape. (Stale note removed: this used to say frontend was still
// on Next 14/sync cookies — it wasn't true anymore and had drifted.)
import { cookies } from "next/headers";
import { createApiClient, getSetCookieValue, type ApiClient } from "@lemonade/api-client";
import { adminAuthRoutes } from "@lemonade/api-types/generated";
import { ADMIN_TOKEN_COOKIE, ADMIN_REFRESH_COOKIE, SIGNED_IN_COOKIE } from "@/lib/cookie-names";
import { serverEnv } from "@/lib/env.server";

export { ADMIN_TOKEN_COOKIE, ADMIN_REFRESH_COOKIE };

const LARAVEL_API_URL = serverEnv.LARAVEL_API_URL;

// Fallback only — real callers always have a concrete `expires_in` from the
// backend's login/refresh response. Matches sanctum.ac_expiration's current
// default (60 min).
const DEFAULT_ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 60;
const REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // sanctum.rf_expiration's current default (30 days)

async function getToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(ADMIN_TOKEN_COOKIE)?.value;
}

async function getRefreshToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(ADMIN_REFRESH_COOKIE)?.value;
}

async function persistAccessToken(token: string, maxAgeSeconds: number): Promise<void> {
  try {
    const store = await cookies();
    store.set(ADMIN_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: maxAgeSeconds,
    });
  } catch {
    // Cookie writes only succeed inside a Route Handler / Server Action —
    // see the longer comment in apps/frontend/src/lib/server-api.ts.
  }
}

async function persistRefreshToken(token: string): Promise<void> {
  try {
    const store = await cookies();
    store.set(ADMIN_REFRESH_COOKIE, token, {
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

export async function clearAdminSession(): Promise<void> {
  try {
    const store = await cookies();
    store.delete(ADMIN_TOKEN_COOKIE);
    store.delete(ADMIN_REFRESH_COOKIE);
    store.delete(SIGNED_IN_COOKIE);
  } catch {
    // Not in a writable context.
  }
}

export const backendApi: ApiClient = createApiClient({
  baseURL: `${LARAVEL_API_URL}/v1`,
  getToken,
  refresh: {
    refreshPath: adminAuthRoutes.REFRESH,
    getRefreshToken,
    onRefreshed: async (accessToken, refreshToken, expiresIn) => {
      await persistAccessToken(accessToken, expiresIn ?? DEFAULT_ACCESS_TOKEN_MAX_AGE_SECONDS);
      if (refreshToken) await persistRefreshToken(refreshToken);
      // See apps/frontend's identical comment on this call — this refresh
      // can happen deep inside the interceptor with no response object
      // here to relay the backend's Set-Cookie header onto.
      await persistSignedInCookie(expiresIn ?? DEFAULT_ACCESS_TOKEN_MAX_AGE_SECONDS);
    },
  },
  onUnauthorized: clearAdminSession,
});

export async function persistAdminSession(
  accessToken: string,
  refreshToken?: string,
  expiresIn?: number,
): Promise<void> {
  await persistAccessToken(accessToken, expiresIn ?? DEFAULT_ACCESS_TOKEN_MAX_AGE_SECONDS);
  if (refreshToken) await persistRefreshToken(refreshToken);
}
