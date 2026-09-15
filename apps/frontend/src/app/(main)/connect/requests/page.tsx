// Server Component — prefetches pending connection requests on the
// server. Unlike every other converted page, /connect isn't in
// middleware.ts's PROTECTED_PREFIXES, so an unauthenticated visitor can
// reach this route; that's fine here since prefetchQuery already swallows
// the backend's 401 (no cookie, no token) the same way it does for a fake
// token on a gated page — see docs/ARCHITECTURE.md Phase 6. The client's
// own useInvitesQuery stays enabled: Boolean(user?.id), so an unauthed
// visitor still renders the empty/loading state client-side regardless of
// what the server tried to prefetch.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { connectKeys } from "@/features/connect/queries";
import { connectServerApi } from "@/features/connect/api.server";
import RequestsClient from "./RequestsClient";

export default async function RequestsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: connectKeys.invites(),
    queryFn: connectServerApi.getInvites,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RequestsClient />
    </HydrationBoundary>
  );
}
