import "server-only";

// Server-side only — reads the httpOnly session cookie and calls
// lemonade-backend directly. Use from Server Components, Route Handlers and
// Server Actions. Never import this into a Client Component; the bundler
// will refuse to build if you do (that's what `server-only` is for).
//
// NOTE: apps/frontend is still on Next 14.2.7, where `cookies()` is
// SYNCHRONOUS. apps/admin is already on Next 15, where it's async — see
// apps/admin/src/lib/server-api.ts. Don't copy this file verbatim between
// the two apps; Phase 3 (version alignment) is what removes this asymmetry.
import { cookies } from "next/headers";
import { createApiClient, type ApiClient } from "@lemonade/api-client";
import { userAuthRoutes } from "@lemonade/api-types";
import { USER_TOKEN_COOKIE, USER_REFRESH_COOKIE } from "@/lib/cookie-names";

export { USER_TOKEN_COOKIE, USER_REFRESH_COOKIE };

const LARAVEL_API_URL = process.env.LARAVEL_API_URL;

if (!LARAVEL_API_URL) {
  throw new Error("LARAVEL_API_URL is not set — see .env.example");
}

// Fallback only — real callers always have a concrete `expires_in` from the
// backend's login/refresh response (see persistUserSession/onRefreshed
// below). Matches sanctum.ac_expiration's current default (60 min).
const DEFAULT_ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 60;
const REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // sanctum.rf_expiration's current default (30 days)

function getToken(): string | undefined {
  return cookies().get(USER_TOKEN_COOKIE)?.value;
}

function getRefreshToken(): string | undefined {
  return cookies().get(USER_REFRESH_COOKIE)?.value;
}

// Cookie writes only succeed inside a Route Handler or Server Action. If a
// refresh is triggered by a plain Server Component read (a GET during
// render), Next throws on the write — that's fine, we swallow it here: the
// refreshed token still lets *this* request succeed, the write-back just
// doesn't stick, so the next request refreshes again. Better than crashing
// the render.
function persistAccessToken(token: string, maxAgeSeconds: number): void {
  try {
    cookies().set(USER_TOKEN_COOKIE, token, {
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

function persistRefreshToken(token: string): void {
  try {
    cookies().set(USER_REFRESH_COOKIE, token, {
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

export function clearUserSession(): void {
  try {
    cookies().delete(USER_TOKEN_COOKIE);
    cookies().delete(USER_REFRESH_COOKIE);
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
    onRefreshed: (accessToken, refreshToken, expiresIn) => {
      persistAccessToken(accessToken, expiresIn ?? DEFAULT_ACCESS_TOKEN_MAX_AGE_SECONDS);
      if (refreshToken) persistRefreshToken(refreshToken);
    },
  },
  onUnauthorized: clearUserSession,
});

export function persistUserSession(
  accessToken: string,
  refreshToken?: string,
  expiresIn?: number,
): void {
  persistAccessToken(accessToken, expiresIn ?? DEFAULT_ACCESS_TOKEN_MAX_AGE_SECONDS);
  if (refreshToken) persistRefreshToken(refreshToken);
}
