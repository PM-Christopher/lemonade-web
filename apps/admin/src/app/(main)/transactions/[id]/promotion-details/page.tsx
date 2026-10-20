import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { transactionKeys } from "@/features/transaction/queries";
import { transactionServerApi } from "@/features/transaction/api.server";
import PromotionDetailsClient from "./PromotionDetailsClient";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: transactionKeys.promotionDetail(id),
    queryFn: () => transactionServerApi.getPromotionDetail(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PromotionDetailsClient id={id} />
    </HydrationBoundary>
  );
}
