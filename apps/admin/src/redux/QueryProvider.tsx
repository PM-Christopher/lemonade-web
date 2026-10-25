"use client";
import { useState } from "react";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiError } from "@lemonade/api-client";
import { store } from "./store";
import { updateToastifyReducer } from "./toastifySlice";

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
        // A failed load says so, so an empty list is never mistaken for "nothing there".
        queryCache: new QueryCache({
          onError: (error) => {
            if (error instanceof ApiError && error.kind === "auth") return;
            store.dispatch(
              updateToastifyReducer({
                show: true,
                message: "Couldn't load the latest data. What you see may be out of date.",
                type: "error",
              }),
            );
          },
        }),
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
