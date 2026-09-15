// Server Component — prefetches the current user's billing history on the
// server. Migrated off the legacy useRequest hook onto
// useBillingHistoryQuery (features/authentication) in the same pass — see
// docs/ARCHITECTURE.md Phase 6 and event/[id]/details/page.tsx for the
// general SSR-prefetch pattern.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { authKeys } from "@/features/authentication/queries";
import { authServerApi } from "@/features/authentication/api.server";
import BillingHistoryClient from "./BillingHistoryClient";

export default async function BillingHistoryPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: authKeys.billingHistory(),
    queryFn: authServerApi.getBillingHistory,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BillingHistoryClient />
    </HydrationBoundary>
  );
}
