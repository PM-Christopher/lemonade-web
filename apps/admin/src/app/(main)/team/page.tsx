import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { teamKeys } from "@/features/team/queries";
import { teamServerApi } from "@/features/team/api.server";
import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_SECTION_PERMISSIONS } from "@/features/authentication/permissions";
import TeamClient from "./TeamClient";

export default async function TeamPage() {
  await requireAdminPermission(ADMIN_SECTION_PERMISSIONS.teamMembers);

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
