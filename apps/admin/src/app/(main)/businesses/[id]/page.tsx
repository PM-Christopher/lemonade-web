import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { businessKeys } from "@/features/businesses/queries";
import { businessesServerApi } from "@/features/businesses/api.server";
import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_PERMISSIONS } from "@/features/authentication/permissions";
import BusinessDetailsClient from "./BusinessDetailsClient";

export default async function BusinessDetailsPage(props: { params: Promise<{ id: string }> }) {
  await requireAdminPermission(ADMIN_PERMISSIONS.businessesView);

  const { id } = await props.params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: businessKeys.detail(id),
    queryFn: () => businessesServerApi.getBusinessDetail(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BusinessDetailsClient id={id} />
    </HydrationBoundary>
  );
}
