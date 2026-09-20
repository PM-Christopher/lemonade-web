import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { businessKeys } from "@/features/businesses/queries";
import { businessesServerApi } from "@/features/businesses/api.server";
import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_SECTION_PERMISSIONS } from "@/features/authentication/permissions";
import BusinessesClient from "./BusinessesClient";

export default async function BusinessesPage() {
  await requireAdminPermission(ADMIN_SECTION_PERMISSIONS.businesses);

  const queryClient = getQueryClient();

  // Prefetches the default "pending" review queue — BusinessesClient's own
  // default status filter — same "prefetch only the default view" pattern
  // as app/(main)/events/page.tsx.
  await queryClient.prefetchQuery({
    queryKey: businessKeys.list("pending"),
    queryFn: () => businessesServerApi.getBusinesses(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BusinessesClient />
    </HydrationBoundary>
  );
}
