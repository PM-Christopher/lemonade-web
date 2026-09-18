// Prefetches page 1 (docs/ARCHITECTURE.md §22 Conflict 1) — no search/status
// filter to preserve here, unlike users/page.tsx, since ReportingClient's
// search/status inputs aren't wired to any filtering logic yet.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { reportingKeys } from "@/features/reporting/queries";
import { reportingServerApi } from "@/features/reporting/api.server";
import ReportingClient from "./ReportingClient";

const DEFAULT_PER_PAGE = 10;

export default async function ReportingPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: reportingKeys.list(1),
    queryFn: () => reportingServerApi.getReportData({ page: 1, perPage: DEFAULT_PER_PAGE }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReportingClient />
    </HydrationBoundary>
  );
}
