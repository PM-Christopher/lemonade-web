"use client";

// Client Component transport. Calls this app's own same-origin BFF proxy at
// /api/v1/* — see apps/admin/src/lib/server-api.ts for why, and
// apps/frontend/src/lib/browser-api.ts for the frontend's equivalent.
import { createApiClient, type ApiClient } from "@lemonade/api-client";

export const browserApi: ApiClient = createApiClient({
    baseURL: "/api/v1",
    onUnauthorized: () => {
        if (typeof window !== "undefined") window.location.href = "/login";
    },
});
