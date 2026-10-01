"use client";

// Client Component transport. Calls this app's own same-origin BFF proxy at
// /api/v1/* — see apps/admin/src/lib/server-api.ts for why, and
// apps/frontend/src/lib/browser-api.ts for the frontend's equivalent.
import { createApiClient, type ApiClient } from "@lemonade/api-client";

export const browserApi: ApiClient = createApiClient({
  baseURL: "/api/v1",
  onUnauthorized: () => {
    // Hard reload, not router.push: this config callback runs outside any
    // component/hook context, and a session that just failed refresh needs
    // every in-memory store wiped.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    if (typeof window !== "undefined") window.location.href = "/login";
  },
});
