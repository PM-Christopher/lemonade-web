import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { subscriptionKeys } from "@/features/subscriptions/queries";
import { subscriptionsServerApi } from "@/features/subscriptions/api.server";
import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_SECTION_PERMISSIONS } from "@/features/authentication/permissions";
import SubscriptionsClient from "./SubscriptionsClient";

export default async function SubscriptionsPage() {
  await requireAdminPermission(ADMIN_SECTION_PERMISSIONS.subscriptions);

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: subscriptionKeys.lists(),
    queryFn: subscriptionsServerApi.getPlans,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SubscriptionsClient />
    </HydrationBoundary>
  );
}
