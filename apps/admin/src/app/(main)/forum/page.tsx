import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { moderationKeys } from "@/features/moderation/queries";
import { moderationServerApi } from "@/features/moderation/api.server";
import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_SECTION_PERMISSIONS } from "@/features/authentication/permissions";
import ForumClient from "./ForumClient";

const DEFAULT_PER_PAGE = 10;

export default async function ForumPage() {
  await requireAdminPermission(ADMIN_SECTION_PERMISSIONS.moderation);

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: moderationKeys.queue(),
      queryFn: () => moderationServerApi.getQueue(),
    }),
    queryClient.prefetchQuery({
      queryKey: moderationKeys.content("forums", { page: 1, perPage: DEFAULT_PER_PAGE }),
      queryFn: () =>
        moderationServerApi.getContent("forums", { page: 1, perPage: DEFAULT_PER_PAGE }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ForumClient />
    </HydrationBoundary>
  );
}
