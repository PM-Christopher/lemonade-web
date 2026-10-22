import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { disputeKeys } from "@/features/disputes/queries";
import { disputesServerApi } from "@/features/disputes/api.server";
import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_PERMISSIONS } from "@/features/authentication/permissions";
import DisputesClient from "./DisputesClient";

export default async function DisputesPage() {
  await requireAdminPermission(ADMIN_PERMISSIONS.disputesView);

  const queryClient = getQueryClient();

  // Prefetches the open queue, the client's default filter.
  await queryClient.prefetchQuery({
    queryKey: disputeKeys.list("pending"),
    queryFn: () => disputesServerApi.getDisputes(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DisputesClient />
    </HydrationBoundary>
  );
}
