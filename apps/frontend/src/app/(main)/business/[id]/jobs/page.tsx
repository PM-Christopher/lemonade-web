// Server Component — prefetches this business's job data on the server.
// Migrated off the legacy useRequest hook onto useBusinessJobDataQuery
// (features/business) in the same pass — see docs/ARCHITECTURE.md Phase 6
// and event/[id]/details/page.tsx for the general SSR-prefetch pattern.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { businessKeys } from "@/features/business/queries";
import { businessServerApi } from "@/features/business/api.server";
import JobsClient from "./JobsClient";

export default async function JobsPage(props: {
  params: Promise<{ id: number }>;
}) {
  const params = await props.params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: businessKeys.businessJobData(params.id),
    queryFn: () => businessServerApi.getBusinessJobData(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JobsClient id={params.id} />
    </HydrationBoundary>
  );
}
