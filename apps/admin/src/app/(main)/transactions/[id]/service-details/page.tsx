import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { transactionKeys } from "@/features/transaction/queries";
import { transactionServerApi } from "@/features/transaction/api.server";
import ServiceDetailsClient from "./ServiceDetailsClient";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: transactionKeys.serviceDetail(id),
    queryFn: () => transactionServerApi.getServiceDetail(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ServiceDetailsClient id={id} />
    </HydrationBoundary>
  );
}
