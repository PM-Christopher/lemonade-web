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
import { createApiClient, type ApiClient } from "@lemonade/api-client";
import { userAuthRoutes } from "@lemonade/api-types/generated";
import { USER_TOKEN_COOKIE, USER_REFRESH_COOKIE } from "@/lib/cookie-names";
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

export async function clearUserSession(): Promise<void> {
  try {
    const store = await cookies();
    store.delete(USER_TOKEN_COOKIE);
    store.delete(USER_REFRESH_COOKIE);
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
