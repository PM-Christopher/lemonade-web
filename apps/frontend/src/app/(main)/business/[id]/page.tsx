// Server Component — prefetches this business on the server, then hands
// the cache to BusinessDetailsClient via <HydrationBoundary>. Same pattern
// as event/[id]/details/page.tsx — see that file and
// docs/ARCHITECTURE.md Phase 6 for the full explanation.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { businessKeys } from "@/features/business/queries";
import { businessServerApi } from "@/features/business/api.server";
import BusinessDetailsClient from "./BusinessDetailsClient";

export default async function BusinessDetailsPage(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: businessKeys.detail(params.id),
    queryFn: () => businessServerApi.getBusiness(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BusinessDetailsClient id={params.id} />
    </HydrationBoundary>
  );
}
