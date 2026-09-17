import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { transactionKeys } from "@/features/transaction/queries";
import { transactionServerApi } from "@/features/transaction/api.server";
import TransactionsClient from "./TransactionsClient";

export default async function TransactionsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: transactionKeys.list("plan-subscriptions"),
    queryFn: transactionServerApi.getPlanSubscriptions,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TransactionsClient />
    </HydrationBoundary>
  );
}
