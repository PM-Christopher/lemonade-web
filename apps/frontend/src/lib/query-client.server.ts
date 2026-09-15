import "server-only";
import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

// One QueryClient per request (React's cache() memoizes within a single
// render pass, never across requests/users) — the standard pattern for
// prefetching a query in a Server Component and handing the cache to a
// Client Component tree via <HydrationBoundary>. See
// docs/ARCHITECTURE.md Phase 6.
export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60_000,
        },
      },
    }),
);
