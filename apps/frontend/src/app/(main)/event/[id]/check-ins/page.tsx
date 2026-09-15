// Server Component — prefetches the guest list on the server, same
// endpoint and reasoning as the guest-list page's Server Component
// (guest details stays client-only, enabled only once a guest is
// selected). See event/[id]/details/page.tsx and
// docs/ARCHITECTURE.md Phase 6.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { eventKeys } from "@/features/events/queries";
import { eventsServerApi } from "@/features/events/api.server";
import CheckInsClient from "./CheckInsClient";

export default async function CheckInsPage(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: eventKeys.guestList(params.id),
    queryFn: () => eventsServerApi.getGuestList(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CheckInsClient id={params.id} />
    </HydrationBoundary>
  );
}
