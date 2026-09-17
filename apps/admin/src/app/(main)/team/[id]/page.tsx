import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { teamKeys } from "@/features/team/queries";
import { teamServerApi } from "@/features/team/api.server";
import TeamDetailsClient from "./TeamDetailsClient";

export default async function TeamDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = Number(params.id);
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: teamKeys.detail(id),
    queryFn: () => teamServerApi.getTeamDetail(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TeamDetailsClient id={id} />
    </HydrationBoundary>
  );
}
