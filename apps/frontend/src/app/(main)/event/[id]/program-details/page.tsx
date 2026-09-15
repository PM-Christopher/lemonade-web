// Server Component — prefetches this affiliate event's detail on the
// server. Same pattern as event/[id]/details/page.tsx — see that file
// and docs/ARCHITECTURE.md Phase 6.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { eventKeys } from "@/features/events/queries";
import { eventsServerApi } from "@/features/events/api.server";
import ProgramDetailsClient from "./ProgramDetailsClient";

export default async function ProgramDetailsPage(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: eventKeys.affiliateEventDetail(params.id),
    queryFn: () => eventsServerApi.getAffiliateEvent(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProgramDetailsClient id={params.id} />
    </HydrationBoundary>
  );
}
