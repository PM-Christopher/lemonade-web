// Prefetches page 1 of the default "plan-subscriptions" tab
// (docs/ARCHITECTURE.md §22 Conflict 1) — no search/filter to preserve
// here, TransactionsClient's search input is dead markup (commented out).
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { transactionKeys } from "@/features/transaction/queries";
import { transactionServerApi } from "@/features/transaction/api.server";
import TransactionsClient from "./TransactionsClient";

const DEFAULT_PER_PAGE = 10;

export default async function TransactionsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: transactionKeys.list("plan-subscriptions", 1),
    queryFn: () =>
      transactionServerApi.getPlanSubscriptions({ page: 1, perPage: DEFAULT_PER_PAGE }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TransactionsClient />
    </HydrationBoundary>
  );
}
