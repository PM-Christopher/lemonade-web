// Server Component — prefetches this event on the server (direct to the
// backend via lib/server-api.ts, not the BFF proxy round-trip a Client
// Component would need) and hands the cache to EventDetailsClient via
// <HydrationBoundary>, so first paint doesn't wait on a client-side
// request. EventDetailsClient still uses useEventQuery() normally —
// staleTime/refetch/invalidation behavior is unchanged, it just starts
// with the data already in cache instead of loading from empty.
//
// This is the first page converted under docs/ARCHITECTURE.md Phase 6 —
// see that phase's status for why this one and what the pattern is for
// converting more (feature-by-feature, same as Phase 5's query migration).
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { eventKeys } from "@/features/events/queries";
import { eventsServerApi } from "@/features/events/api.server";
import EventDetailsClient from "./EventDetailsClient";

export default async function EventDetailsPage(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: eventKeys.detail(params.id),
    queryFn: () => eventsServerApi.getEvent(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EventDetailsClient id={params.id} />
    </HydrationBoundary>
  );
}
