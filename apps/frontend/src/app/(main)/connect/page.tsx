// Server Component — prefetches the chat sidebar (getMessages) and the
// connection info (getConnection) on the server. The third query on this
// page, useChatQuery, is enabled only once a chat is actually opened
// client-side (chatOpened) — same "don't prefetch interaction-gated
// queries" rule as event/[id]/guest-list, so it stays client-only. Like
// connect/requests, /connect isn't in middleware.ts's PROTECTED_PREFIXES —
// see that page and docs/ARCHITECTURE.md Phase 6 for why an unauthenticated
// hit here is still safe (prefetchQuery swallows the failed backend call).
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { connectKeys } from "@/features/connect/queries";
import { connectServerApi } from "@/features/connect/api.server";
import ConnectClient from "./ConnectClient";

export default async function ConnectPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: connectKeys.chats(),
      queryFn: connectServerApi.getMessages,
    }),
    queryClient.prefetchQuery({
      queryKey: connectKeys.connection(),
      queryFn: connectServerApi.getConnection,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ConnectClient />
    </HydrationBoundary>
  );
}
