// Server Component — prefetches the "discover" tab's tribe list on the
// server (usePersistentMenuState's own fallback default when nothing's
// persisted yet — see TribeListClient.tsx). If a returning visitor has a
// different tab persisted client-side (their own state, unreadable
// server-side), this prefetch is simply unused and the client query
// fetches normally, same as with no prefetch — never wrong, just
// occasionally not the tab that ends up rendered. See
// event/[id]/details/page.tsx and docs/ARCHITECTURE.md Phase 6 for the
// general pattern.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { tribeKeys } from "@/features/tribes/queries";
import { tribesServerApi } from "@/features/tribes/api.server";
import TribeListClient from "./TribeListClient";

export default async function TribePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: tribeKeys.list("discover"),
    queryFn: () => tribesServerApi.getTribes("discover"),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TribeListClient />
    </HydrationBoundary>
  );
}
