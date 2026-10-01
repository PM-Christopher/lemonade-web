// Prefetches this user's detail and their default "activities-log" tab's
// account info. UserDetailsClient's own menuOption defaults to
// "activities-log" — if a visitor switches tabs, that tab's query fetches
// normally, same "prefetch only the default tab" pattern used elsewhere.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { userKeys } from "@/features/user/queries";
import { userServerApi } from "@/features/user/api.server";
import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_SECTION_PERMISSIONS } from "@/features/authentication/permissions";
import UserDetailsClient from "./UserDetailsClient";

export default async function UserDetailsPage(props: { params: Promise<{ id: string }> }) {
  await requireAdminPermission(ADMIN_SECTION_PERMISSIONS.users);

  const params = await props.params;
  const id = params.id;
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: userKeys.detail(id),
      queryFn: () => userServerApi.getUserDetail(id),
    }),
    queryClient.prefetchQuery({
      queryKey: userKeys.accountInfo(id, "activities-log"),
      queryFn: () => userServerApi.getAccountInfoDefault(id),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserDetailsClient id={id} />
    </HydrationBoundary>
  );
}
