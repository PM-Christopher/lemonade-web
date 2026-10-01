// Server Component — prefetches this event on the server. Same query key
// (eventKeys.detail) as event/[id]/details/page.tsx, so this reuses
// eventsServerApi.getEvent with no api.server.ts changes. See that file
// and docs/ARCHITECTURE.md Phase 6 for the general pattern.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { eventKeys } from "@/features/events/queries";
import { eventsServerApi } from "@/features/events/api.server";
import EventClient from "./EventClient";

export default async function EventPage(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: eventKeys.detail(params.id),
    queryFn: () => eventsServerApi.getEvent(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EventClient id={params.id} />
    </HydrationBoundary>
  );
}
