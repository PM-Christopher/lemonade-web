// Server Component — prefetches the promotions catalog on the server (not
// per-event data; usePromotionsQuery() takes no id). New endpoint added to
// events/api.server.ts (getPromotions). See event/[id]/details/page.tsx
// and docs/ARCHITECTURE.md Phase 6 for the general pattern.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { eventKeys } from "@/features/events/queries";
import { eventsServerApi } from "@/features/events/api.server";
import PromoteEventClient from "./PromoteEventClient";

export default async function PromoteEventPage(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: eventKeys.promotions(),
    queryFn: eventsServerApi.getPromotions,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PromoteEventClient id={params.id} />
    </HydrationBoundary>
  );
}
