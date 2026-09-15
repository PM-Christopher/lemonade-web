// Server Component — prefetches the wallet on the server. This is
// CLAUDE.md's money bucket (staleTime 0 in useWalletSettingsQuery) — the
// prefetch only seeds a real server-fetched snapshot for first paint, it
// doesn't change the client's own staleness policy: the client query is
// still immediately stale on mount and free to revalidate per normal
// TanStack Query behavior, same as if there'd been no prefetch. Never
// treated as optimistic — this is a real fetch of the same real endpoint,
// just earlier. See event/[id]/details/page.tsx and
// docs/ARCHITECTURE.md Phase 6 for the general pattern.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { settingsKeys } from "@/features/settings/queries";
import { settingsServerApi } from "@/features/settings/api.server";
import WalletSettingsClient from "./WalletSettingsClient";

export default async function WalletSettingsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: settingsKeys.wallet(),
    queryFn: settingsServerApi.getWallet,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WalletSettingsClient />
    </HydrationBoundary>
  );
}
