// Server Component — prefetches the boost-package catalog on the server.
// This page was still on the legacy useRequest hook (see
// features/business/api.ts's NOTE) until this pass, when it was migrated
// to a real TanStack Query (useBoostPackagesQuery) specifically so it could
// become a Server Component candidate too — see
// docs/ARCHITECTURE.md Phase 6 for that decision and event/[id]/details/page.tsx
// for the general SSR-prefetch pattern.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { businessKeys } from "@/features/business/queries";
import { businessServerApi } from "@/features/business/api.server";
import BoostBusinessClient from "./BoostBusinessClient";

export default async function BoostBusinessPage(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: businessKeys.boostPackages(),
    queryFn: businessServerApi.getBoostPackages,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BoostBusinessClient id={params.id} />
    </HydrationBoundary>
  );
}
