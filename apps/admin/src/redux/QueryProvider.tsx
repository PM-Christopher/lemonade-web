"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Per-component-instance QueryClient (not a module-level singleton) — the
// standard Next.js App Router pattern, so server-rendered requests never
// share a cache across users. Defaults are deliberately generic; each
// domain's queries set their own staleTime per docs/ARCHITECTURE.md §11's
// staleness table. Admin's own bias is shorter staleness — operators need
// current state — so this default is a bit tighter than the frontend's.
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: true,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default QueryProvider;
