import axios from "axios";

/* ---------------- Base Axios Instance ---------------- */
// Points at this app's own BFF proxy (same-origin, /api/v1/*), not Laravel
// directly — the httpOnly session cookie rides along automatically on any
// same-origin request, so no token is ever read or attached here. See
// src/app/api/v1/[...path]/route.ts and src/lib/server-api.ts. Any
// Authorization header a caller still builds by hand (leftover from
// before this cutover) is simply ignored by the proxy, which always
// injects the real one server-side.
//
// This used to also wrap a 5-minute axios-cache-interceptor on every GET —
// removed. It served stale wallet/ticket/availability data with no
// invalidation after a mutation; per-query staleness now belongs to
// TanStack Query as each domain migrates (see docs/ARCHITECTURE.md §11).
export const axiosInstance = axios.create({
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
});

function clearLegacyCookies() {
  // Best-effort cleanup of cookies from the pre-BFF auth flow
  // ("token"/"refresh_token", both js-readable) — harmless if absent.
  ["token", "refresh_token"].forEach((name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });
}

/* ---------------- Global Error Handling ---------------- */
// Refresh-on-401 is handled server-side, inside the BFF proxy's own
// backendApi instance (see src/lib/server-api.ts's `refresh` config). By
// the time the browser sees a 401 here, that refresh already happened and
// failed — the session is genuinely over, not just stale.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearLegacyCookies();
      if (typeof window !== "undefined") window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
