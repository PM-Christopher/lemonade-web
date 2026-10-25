"use client";

// Browser transport to this app's same-origin BFF (`/api/v1`), not Laravel directly.
import { AUTH_PAGES, loginPathWithNext } from "@/lib/post-auth-redirect";
import { createApiClient, type ApiClient } from "@lemonade/api-client";
import { rememberCorrelationId } from "@/lib/correlation";
import { rememberApiMessage } from "@/lib/api-message";

export const browserApi: ApiClient = createApiClient({
  baseURL: "/api/v1",
  onCorrelationId: rememberCorrelationId,
  onSuccessMessage: rememberApiMessage,
  onUnauthorized: () => {
    // Hard reload clears in-memory session state after a failed refresh.
    if (typeof window === "undefined") return;
    // Stay put on the login pages so a 401 there cannot reload them forever.
    if (AUTH_PAGES.some((page) => window.location.pathname === page)) return;
    window.location.href = loginPathWithNext(
      `${window.location.pathname}${window.location.search}`,
    );
  },
});
