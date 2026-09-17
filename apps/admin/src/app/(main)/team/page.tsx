import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { teamKeys } from "@/features/team/queries";
import { teamServerApi } from "@/features/team/api.server";
import TeamClient from "./TeamClient";

export default async function TeamPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: teamKeys.list(),
    queryFn: teamServerApi.getTeamData,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TeamClient />
    </HydrationBoundary>
  );
}
