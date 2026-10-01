import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { transactionKeys } from "@/features/transaction/queries";
import { transactionServerApi } from "@/features/transaction/api.server";
import TransactionEventDetailsClient from "./TransactionEventDetailsClient";

export default async function EventDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: transactionKeys.eventDetail(id),
    queryFn: () => transactionServerApi.getEventDetail(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TransactionEventDetailsClient id={id} />
    </HydrationBoundary>
  );
}
