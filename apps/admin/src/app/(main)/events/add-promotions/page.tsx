import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { promotionKeys } from "@/features/events/queries";
import { promotionsServerApi } from "@/features/events/api.server";
import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_SECTION_PERMISSIONS } from "@/features/authentication/permissions";
import AddPromotionsClient from "./AddPromotionsClient";

export default async function AddPromotionsPage() {
  await requireAdminPermission(ADMIN_SECTION_PERMISSIONS.events);

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: promotionKeys.lists(),
    queryFn: promotionsServerApi.getPromotions,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AddPromotionsClient />
    </HydrationBoundary>
  );
}
