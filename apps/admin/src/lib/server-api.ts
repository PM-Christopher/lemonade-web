import "server-only";

// Server-side only — reads the httpOnly session cookie and calls
// lemonade-backend directly. Use from Server Components, Route Handlers and
// Server Actions. Never import this into a Client Component.
//
// apps/admin is on Next 15, where `cookies()` is ASYNC. apps/frontend is
// still on Next 14, where it's sync — see apps/frontend/src/lib/server-api.ts.
// Don't copy this file verbatim between the two apps.
import { cookies } from "next/headers";
import { createApiClient, type ApiClient } from "@lemonade/api-client";
import { adminAuthRoutes } from "@lemonade/api-types";
import { ADMIN_TOKEN_COOKIE, ADMIN_REFRESH_COOKIE } from "@/lib/cookie-names";

export { ADMIN_TOKEN_COOKIE, ADMIN_REFRESH_COOKIE };

const LARAVEL_API_URL = process.env.LARAVEL_API_URL;

if (!LARAVEL_API_URL) {
  throw new Error("LARAVEL_API_URL is not set — see .env.example");
}

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

export async function clearAdminSession(): Promise<void> {
  try {
    const store = await cookies();
    store.delete(ADMIN_TOKEN_COOKIE);
    store.delete(ADMIN_REFRESH_COOKIE);
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
