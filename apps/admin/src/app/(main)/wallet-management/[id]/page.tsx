import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { walletKeys } from "@/features/wallet/queries";
import { walletServerApi } from "@/features/wallet/api.server";
import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_SECTION_PERMISSIONS } from "@/features/authentication/permissions";
import WalletManagementDetailsClient from "./WalletManagementDetailsClient";

export default async function WalletDetailsPage(props: { params: Promise<{ id: string }> }) {
  await requireAdminPermission(ADMIN_SECTION_PERMISSIONS.wallet);

  const params = await props.params;
  const id = params.id;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: walletKeys.detail(id),
    queryFn: () => walletServerApi.getWalletDetail(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WalletManagementDetailsClient id={id} />
    </HydrationBoundary>
  );
}
