import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { eventKeys } from "@/features/events/queries";
import { eventsServerApi } from "@/features/events/api.server";
import AffiliateProgramDetailsClient from "./AffiliateProgramDetailsClient";

// Route is nested under events/ but the [id] is an Affiliate id, not an
// Event id — this page is a single affiliate's cross-event profile, reached
// from the top-level Events > Affiliates tab (views/events/AffiliateView.tsx).
// Kept at this path since a live router.push already depends on it.
export default async function EventAffiliatePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: eventKeys.affiliateDetail(id),
    queryFn: () => eventsServerApi.getEventAffiliateDetail(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AffiliateProgramDetailsClient id={id} />
    </HydrationBoundary>
  );
}
