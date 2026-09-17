import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { userKeys } from "@/features/user/queries";
import { userServerApi } from "@/features/user/api.server";
import AffiliateUserClient from "./AffiliateUserClient";

export default async function AffiliateUserPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = Number(params.id);
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: userKeys.affiliateDetail(id),
    queryFn: () => userServerApi.getAffiliateDetail(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AffiliateUserClient id={id} />
    </HydrationBoundary>
  );
}
