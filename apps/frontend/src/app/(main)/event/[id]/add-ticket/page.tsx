// Server Component — prefetches this event's own ticket types on the
// server. New endpoint added to events/api.server.ts (getEventTickets).
// See event/[id]/details/page.tsx and docs/ARCHITECTURE.md Phase 6 for the
// general pattern.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { eventKeys } from "@/features/events/queries";
import { eventsServerApi } from "@/features/events/api.server";
import AddTicketClient from "./AddTicketClient";

export default async function AddTicketPage(props: {
  params: Promise<{ id: number }>;
}) {
  const params = await props.params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: eventKeys.tickets(params.id),
    queryFn: () => eventsServerApi.getEventTickets(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AddTicketClient id={params.id} />
    </HydrationBoundary>
  );
}
