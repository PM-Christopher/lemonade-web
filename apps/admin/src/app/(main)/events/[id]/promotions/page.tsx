import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { eventPromotionKeys } from "@/features/events/queries";
import { eventPromotionsServerApi } from "@/features/events/api.server";
import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_SECTION_PERMISSIONS } from "@/features/authentication/permissions";
import EventPromotionDetailsClient from "./EventPromotionDetailsClient";

export default async function EventPromotionDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPermission(ADMIN_SECTION_PERMISSIONS.events);

  const { id } = await props.params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: eventPromotionKeys.detail(id),
    queryFn: () => eventPromotionsServerApi.getDetail(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EventPromotionDetailsClient id={id} />
    </HydrationBoundary>
  );
}
