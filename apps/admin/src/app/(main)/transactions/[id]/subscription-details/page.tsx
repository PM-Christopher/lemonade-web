import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { transactionKeys } from "@/features/transaction/queries";
import { transactionServerApi } from "@/features/transaction/api.server";
import SubscriptionDetailsClient from "./SubscriptionDetailsClient";

export default async function SubscriptionDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = Number(params.id);
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: transactionKeys.subscriptionDetail(id),
    queryFn: () => transactionServerApi.getPlanSubscription(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SubscriptionDetailsClient id={id} />
    </HydrationBoundary>
  );
}
