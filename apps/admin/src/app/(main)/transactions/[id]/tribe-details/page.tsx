import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { transactionKeys } from "@/features/transaction/queries";
import { transactionServerApi } from "@/features/transaction/api.server";
import TransactionTribeDetailsClient from "./TransactionTribeDetailsClient";

export default async function TribeDetailsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: transactionKeys.tribeDetail(id),
    queryFn: () => transactionServerApi.getTribeDetail(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TransactionTribeDetailsClient id={id} />
    </HydrationBoundary>
  );
}
