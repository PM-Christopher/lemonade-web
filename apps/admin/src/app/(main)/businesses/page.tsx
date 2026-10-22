import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { businessKeys } from "@/features/businesses/queries";
import { businessesServerApi } from "@/features/businesses/api.server";
import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_PERMISSIONS } from "@/features/authentication/permissions";
import BusinessesClient from "./BusinessesClient";

export default async function BusinessesPage() {
  await requireAdminPermission(ADMIN_PERMISSIONS.businessesView);

  const queryClient = getQueryClient();

  // Prefetches the default view (every listing), matching BusinessesClient's default filter.
  await queryClient.prefetchQuery({
    queryKey: businessKeys.list({ status: "all" }),
    queryFn: () => businessesServerApi.getBusinesses({ status: "all" }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BusinessesClient />
    </HydrationBoundary>
  );
}
