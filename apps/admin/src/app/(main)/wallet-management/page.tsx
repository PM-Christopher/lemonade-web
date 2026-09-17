import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { walletKeys } from "@/features/wallet/queries";
import { walletServerApi } from "@/features/wallet/api.server";
import WalletManagementClient from "./WalletManagementClient";

export default async function WalletManagementPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: walletKeys.withdrawalRequests(),
      queryFn: walletServerApi.getWithdrawalRequests,
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
