// Server Component — prefetches this tribe's detail, threads and pinned
// threads on the server, then hands the cache to TribeClient via
// <HydrationBoundary>. Same pattern as event/[id]/details/page.tsx — see
// that file and docs/ARCHITECTURE.md Phase 6 for the full explanation.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { tribeKeys } from "@/features/tribes/queries";
import { tribesServerApi } from "@/features/tribes/api.server";
import TribeClient from "./TribeClient";

export default async function TribePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: tribeKeys.detail(params.id),
      queryFn: () => tribesServerApi.getTribe(params.id),
    }),
    queryClient.prefetchQuery({
      queryKey: tribeKeys.threads(params.id),
      queryFn: () => tribesServerApi.getThreads(params.id),
    }),
    queryClient.prefetchQuery({
      queryKey: tribeKeys.pinnedThreads(params.id),
      queryFn: () => tribesServerApi.getPinThreads(params.id),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TribeClient id={params.id} />
    </HydrationBoundary>
  );
}
