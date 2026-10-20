import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { disputeKeys } from "@/features/disputes/queries";
import { disputesServerApi } from "@/features/disputes/api.server";
import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_SECTION_PERMISSIONS } from "@/features/authentication/permissions";
import DisputeDetailsClient from "./DisputeDetailsClient";

export default async function DisputeDetailsPage(props: { params: Promise<{ id: string }> }) {
  await requireAdminPermission(ADMIN_SECTION_PERMISSIONS.businesses);

  const { id } = await props.params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: disputeKeys.detail(id),
    queryFn: () => disputesServerApi.getDispute(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DisputeDetailsClient id={id} />
    </HydrationBoundary>
  );
}
