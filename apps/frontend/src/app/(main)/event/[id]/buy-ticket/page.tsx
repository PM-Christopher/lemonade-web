// Server Component — prefetches this event's ticket data on the server.
// New endpoint added to events/api.server.ts (getEventTicketData) since no
// prior converted page needed it. See event/[id]/details/page.tsx and
// docs/ARCHITECTURE.md Phase 6 for the general pattern.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { eventKeys } from "@/features/events/queries";
import { eventsServerApi } from "@/features/events/api.server";
import BuyTicketClient from "./BuyTicketClient";

export default async function BuyTicketPage(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: eventKeys.ticketData(params.id),
    queryFn: () => eventsServerApi.getEventTicketData(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BuyTicketClient id={params.id} />
    </HydrationBoundary>
  );
}
