// Server Component — prefetches this business record on the server. Reuses
// businessServerApi.getBusiness (same query key as business/[id]/page.tsx),
// no api.server.ts changes needed. The categories useRequest call stays
// client-only — it's not a TanStack Query and out of scope for this phase
// (see the NOTE in EditBusinessClient.tsx). See event/[id]/details/page.tsx
// and docs/ARCHITECTURE.md Phase 6 for the general pattern.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { businessKeys } from "@/features/business/queries";
import { businessServerApi } from "@/features/business/api.server";
import EditBusinessClient from "./EditBusinessClient";

export default async function EditBusinessPage(props: {
  params: Promise<{ id: number }>;
}) {
  const params = await props.params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: businessKeys.detail(params.id),
    queryFn: () => businessServerApi.getBusiness(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditBusinessClient id={params.id} />
    </HydrationBoundary>
  );
}
