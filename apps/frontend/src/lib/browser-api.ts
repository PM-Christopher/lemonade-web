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

export const browserApi: ApiClient = createApiClient({
  baseURL: "/api/v1",
  onUnauthorized: () => {
    if (typeof window !== "undefined") window.location.href = "/login";
  },
});
