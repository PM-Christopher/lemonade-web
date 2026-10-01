import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { reportingKeys } from "@/features/reporting/queries";
import { reportingServerApi } from "@/features/reporting/api.server";
import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_SECTION_PERMISSIONS } from "@/features/authentication/permissions";
import ReportDetailsClient from "./ReportDetailsClient";

export default async function ReportDetailsPage(props: { params: Promise<{ id: string }> }) {
  await requireAdminPermission(ADMIN_SECTION_PERMISSIONS.moderation);

  const params = await props.params;
  const id = params.id;
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
