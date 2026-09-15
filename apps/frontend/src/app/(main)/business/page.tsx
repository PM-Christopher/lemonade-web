// Server Component — prefetches the "business" tab's list on the server
// (usePersistentMenuState's own fallback default — see
// BusinessListClient.tsx). The "listings" tab's query stays client-only,
// same reasoning as tribe/page.tsx: if a returning visitor has "listings"
// persisted client-side, this prefetch is simply unused and the client
// query fetches normally. See event/[id]/details/page.tsx and
// docs/ARCHITECTURE.md Phase 6 for the general pattern.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { businessKeys } from "@/features/business/queries";
import { businessServerApi } from "@/features/business/api.server";
import BusinessListClient from "./BusinessListClient";

export default async function BusinessPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: businessKeys.businesses(),
    queryFn: businessServerApi.getBusinesses,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BusinessListClient />
    </HydrationBoundary>
  );
}
