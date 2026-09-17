// Server Component — prefetches the default "users" tab's list on the
// server (UsersClient's own menuOption default). The "affiliates" tab's
// query stays client-only: if a visitor switches tabs, that tab's query
// fetches normally, same "prefetch only the default tab" pattern as
// apps/frontend's tribe/page.tsx and business/page.tsx. middleware.ts
// already gates every non-public admin route behind login, so there's no
// client-side enabled: isLoggedIn branch to reproduce server-side. First
// Server Component conversion in apps/admin under Phase 6's
// list-shell/table-island split — see docs/ARCHITECTURE.md.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { userKeys } from "@/features/user/queries";
import { userServerApi } from "@/features/user/api.server";
import UsersClient from "./UsersClient";

export default async function UsersPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: userKeys.list("users"),
    queryFn: userServerApi.getUsers,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersClient />
    </HydrationBoundary>
  );
}
