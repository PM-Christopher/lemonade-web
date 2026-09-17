import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { reportingKeys } from "@/features/reporting/queries";
import { reportingServerApi } from "@/features/reporting/api.server";
import ReportDetailsClient from "./ReportDetailsClient";

export default async function ReportDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = Number(params.id);
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: reportingKeys.detail(id),
    queryFn: () => reportingServerApi.getReportDetail(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReportDetailsClient id={id} />
    </HydrationBoundary>
  );
}
