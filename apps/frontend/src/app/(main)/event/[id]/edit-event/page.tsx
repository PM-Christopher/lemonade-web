// Server Component — prefetches this event on the server. Reuses
// eventsServerApi.getEvent (same query key as event/[id]/details/page.tsx),
// no api.server.ts changes needed. See that file and
// docs/ARCHITECTURE.md Phase 6 for the general pattern.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { eventKeys } from "@/features/events/queries";
import { eventsServerApi } from "@/features/events/api.server";
import EditEventClient from "./EditEventClient";

export default async function EditEventPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const eventId = Number(params.id);
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: () => eventsServerApi.getEvent(eventId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditEventClient id={params.id} />
    </HydrationBoundary>
  );
}
