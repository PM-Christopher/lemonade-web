"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Per-component-instance QueryClient (not a module-level singleton) — the
// standard Next.js App Router pattern, so server-rendered requests never
// share a cache across users. Defaults are deliberately generic; each
// domain's queries set their own staleTime per docs/ARCHITECTURE.md §11's
// staleness table (money/availability: 0, discovery: 5m, reference: 1h, ...).
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: 1,
            refetchOnWindowFocus: true,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default QueryProvider;
