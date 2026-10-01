// Server Component — prefetches this affiliate event's detail on the
// server. Same query key (eventKeys.affiliateEventDetail) as
// program-details/page.tsx, so this reuses eventsServerApi.getAffiliateEvent
// with no api.server.ts changes. See event/[id]/details/page.tsx and
// docs/ARCHITECTURE.md Phase 6 for the general pattern.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { eventKeys } from "@/features/events/queries";
import { eventsServerApi } from "@/features/events/api.server";
import AgentDetailsClient from "./AgentDetailsClient";

export default async function AgentDetailsPage(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: eventKeys.affiliateEventDetail(params.id),
    queryFn: () => eventsServerApi.getAffiliateEvent(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AgentDetailsClient id={params.id} />
    </HydrationBoundary>
  );
}
