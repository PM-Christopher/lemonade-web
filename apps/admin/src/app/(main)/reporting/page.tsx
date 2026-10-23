// Prefetches page 1 with no filters, the client's default view.
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { reportingKeys } from "@/features/reporting/queries";
import { reportingServerApi } from "@/features/reporting/api.server";
import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_PERMISSIONS } from "@/features/authentication/permissions";
import ReportingClient from "./ReportingClient";

const DEFAULT_PER_PAGE = DEFAULT_PAGE_SIZE;

export default async function ReportingPage() {
  await requireAdminPermission(ADMIN_PERMISSIONS.reportsView);

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: reportingKeys.list(1, {}),
    queryFn: () => reportingServerApi.getReportData({ page: 1, perPage: DEFAULT_PER_PAGE }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReportingClient />
    </HydrationBoundary>
  );
}
