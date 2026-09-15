// Server Component — prefetches the guest list on the server. The other
// two queries in GuestListClient (guest details, guest search) stay
// client-only: both are `enabled` conditionally on user interaction
// (a selected guest, a typed search term) that doesn't exist at request
// time, so there's nothing meaningful to prefetch for them. Same pattern
// as event/[id]/details/page.tsx — see that file and
// docs/ARCHITECTURE.md Phase 6.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { eventKeys } from "@/features/events/queries";
import { eventsServerApi } from "@/features/events/api.server";
import GuestListClient from "./GuestListClient";

export default async function GuestListPage(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: eventKeys.guestList(params.id),
    queryFn: () => eventsServerApi.getGuestList(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GuestListClient id={params.id} />
    </HydrationBoundary>
  );
}
