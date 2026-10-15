"use client";

// Browser transport to this app's same-origin BFF (`/api/v1`), not Laravel directly.
import { routes } from "@/lib/routes";
import { createApiClient, type ApiClient } from "@lemonade/api-client";
import { rememberCorrelationId } from "@/lib/correlation";
import { rememberApiMessage } from "@/lib/api-message";

export const browserApi: ApiClient = createApiClient({
  baseURL: "/api/v1",
  onCorrelationId: rememberCorrelationId,
  onSuccessMessage: rememberApiMessage,
  onUnauthorized: () => {
    // Hard reload clears in-memory session state after a failed refresh.
    if (typeof window !== "undefined") window.location.href = routes.LOGIN;
  },
});
