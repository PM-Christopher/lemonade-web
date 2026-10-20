import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { transactionKeys } from "@/features/transaction/queries";
import { transactionServerApi } from "@/features/transaction/api.server";
import BoostingDetailsClient from "./BoostingDetailsClient";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: transactionKeys.boostDetail(id),
    queryFn: () => transactionServerApi.getBoostDetail(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BoostingDetailsClient id={id} />
    </HydrationBoundary>
  );
}
