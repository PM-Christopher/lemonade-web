// Server Component — prefetches the default "users" tab's list on the
// server (UsersClient's own menuOption default). The "affiliates" tab's
// query stays client-only: if a visitor switches tabs, that tab's query
// fetches normally, same "prefetch only the default tab" pattern as
// apps/frontend's tribe/page.tsx and business/page.tsx. middleware.ts
// already gates every non-public admin route behind login, so there's no
// client-side enabled: isLoggedIn branch to reproduce server-side. First
// Server Component conversion in apps/admin under Phase 6's
// list-shell/table-island split — see docs/ARCHITECTURE.md.
//
// Pagination (docs/ARCHITECTURE.md §22 Conflict 1): a deep link that
// already carries a search/status filter (e.g. `/users?q=foo`) prefetches
// the old unpaginated shape instead of page 1, so UsersClient's
// client-side filtering has every user to search on first paint too, not
// just page 1's ten rows — matches what it falls back to once mounted.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { userKeys } from "@/features/user/queries";
import { userServerApi } from "@/features/user/api.server";
import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_SECTION_PERMISSIONS } from "@/features/authentication/permissions";
import UsersClient from "./UsersClient";

const DEFAULT_PER_PAGE = 10;

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireAdminPermission(ADMIN_SECTION_PERMISSIONS.users);

  const params = await searchParams;
  const isFiltering = Boolean(params.q) || Boolean(params.status);
  const page = isFiltering ? undefined : Number(params.page ?? 1);

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: userKeys.list("users", page),
    queryFn: () => userServerApi.getUsers(page ? { page, perPage: DEFAULT_PER_PAGE } : undefined),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersClient />
    </HydrationBoundary>
  );
}
