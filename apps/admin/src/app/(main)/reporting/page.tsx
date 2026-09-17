import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { reportingKeys } from "@/features/reporting/queries";
import { reportingServerApi } from "@/features/reporting/api.server";
import ReportingClient from "./ReportingClient";

export default async function ReportingPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: reportingKeys.list(),
    queryFn: reportingServerApi.getReportData,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReportingClient />
    </HydrationBoundary>
  );
}
