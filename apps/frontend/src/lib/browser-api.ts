"use client";

// Client Component transport. This never calls lemonade-backend directly —
// it calls this app's own same-origin BFF proxy at /api/v1/*, which reads
// the httpOnly cookie server-side and attaches the real Bearer token. The
// browser never holds, reads, or sends a token itself; the httpOnly cookie
// rides along automatically because the request is same-origin.
//
// This does not replace src/lib/axiosInstane.ts yet — that file (and every
// feature slice that imports it) migrates domain-by-domain in Phase 5. This
// is the target every migrated feature's queries/mutations should call.
import { createApiClient, type ApiClient } from "@lemonade/api-client";

// Same list as middleware.ts PUBLIC_PATHS. A 401 on one of these (a stale
// persisted session posting a device token from the login page) must not
// navigate to /login again, or the page reloads forever.
const AUTH_PATHS = new Set([
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/verify-code",
  "/profile-setup",
]);

export const browserApi: ApiClient = createApiClient({
  baseURL: "/api/v1",
  onUnauthorized: () => {
    if (typeof window === "undefined") return;
    if (AUTH_PATHS.has(window.location.pathname)) return;
    // Hard reload, not router.push: this config callback runs outside any
    // component/hook context, and a session that just failed refresh needs
    // every in-memory store (Redux, TanStack Query cache) wiped.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/login";
  },
});
