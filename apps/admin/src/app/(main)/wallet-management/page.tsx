// Prefetches page 1 of withdrawal requests (docs/ARCHITECTURE.md §22
// Conflict 1). WalletManagementClient's search box is local useState, not
// URL state, and always starts empty on mount — no deep-linked filter to
// account for here, unlike users/page.tsx.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { walletKeys } from "@/features/wallet/queries";
import { walletServerApi } from "@/features/wallet/api.server";
import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_SECTION_PERMISSIONS } from "@/features/authentication/permissions";
import WalletManagementClient from "./WalletManagementClient";

const DEFAULT_PER_PAGE = 10;

export default async function WalletManagementPage() {
  await requireAdminPermission(ADMIN_SECTION_PERMISSIONS.wallet);

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: walletKeys.withdrawalRequests(1),
      queryFn: () => walletServerApi.getWithdrawalRequests({ page: 1, perPage: DEFAULT_PER_PAGE }),
    }),
    queryClient.prefetchQuery({
      queryKey: walletKeys.data(),
      queryFn: walletServerApi.getWalletData,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WalletManagementClient />
    </HydrationBoundary>
  );
}
