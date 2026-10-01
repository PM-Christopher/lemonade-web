import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { walletKeys } from "@/features/wallet/queries";
import { walletServerApi } from "@/features/wallet/api.server";
import TransactionWalletDetailsClient from "./TransactionWalletDetailsClient";

export default async function WalletDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: walletKeys.detail(id),
    queryFn: () => walletServerApi.getWalletDetail(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TransactionWalletDetailsClient id={id} />
    </HydrationBoundary>
  );
}
