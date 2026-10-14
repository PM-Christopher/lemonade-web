"use client";

// Browser transport to this app's same-origin BFF (`/api/v1`), not Laravel directly.
import { routes } from "@/lib/routes";
import { createApiClient, type ApiClient } from "@lemonade/api-client";
import { AUTH_PATHS } from "@/lib/auth-paths";
import { rememberCorrelationId } from "@/lib/correlation";

export const browserApi: ApiClient = createApiClient({
  baseURL: "/api/v1",
  onCorrelationId: rememberCorrelationId,
  onUnauthorized: () => {
    if (typeof window === "undefined") return;
    // Stay put on auth pages so a 401 there cannot reload /login forever.
    if (AUTH_PATHS.has(window.location.pathname)) return;
    // Hard reload clears in-memory session state after a failed refresh.
    window.location.href = routes.LOGIN;
  },
});
