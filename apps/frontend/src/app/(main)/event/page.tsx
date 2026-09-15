// Server Component — prefetches the default "events" tab's discovery list
// on the server (usePersistentMenuState's own fallback default — see
// EventListClient.tsx's getActive("event") ?? "events"). The "organizer"
// and "agent" tabs' queries stay client-only, same reasoning as
// tribe/page.tsx and business/page.tsx: if a returning visitor has a
// different tab persisted, this prefetch is simply unused and that tab's
// query fetches normally. See event/[id]/details/page.tsx and
// docs/ARCHITECTURE.md Phase 6 for the general pattern.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { eventKeys } from "@/features/events/queries";
import { eventsServerApi } from "@/features/events/api.server";
import EventListClient from "./EventListClient";

export default async function EventPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: eventKeys.list(),
    queryFn: eventsServerApi.getEvents,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EventListClient />
    </HydrationBoundary>
  );
}
