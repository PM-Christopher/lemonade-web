import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { dashboardKeys } from "@/features/dashboard/queries";
import { dashboardServerApi } from "@/features/dashboard/api.server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: dashboardKeys.metrics(),
    queryFn: dashboardServerApi.getMetrics,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardClient />
    </HydrationBoundary>
  );
}
