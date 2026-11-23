// Server Component — prefetches the same three lists as the current dashboard, so
// both pages share one cache and the redesign can replace it without new calls.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { dashboardKeys } from "@/features/dashboard/queries";
import { dashboardServerApi } from "@/features/dashboard/api.server";
import NewDashboardClient from "./NewDashboardClient";

export default async function NewDashboardPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: dashboardKeys.tribes(),
      queryFn: dashboardServerApi.getTribes,
    }),
    queryClient.prefetchQuery({
      queryKey: dashboardKeys.events(),
      queryFn: dashboardServerApi.getEvents,
    }),
    queryClient.prefetchQuery({
      queryKey: dashboardKeys.businesses(),
      queryFn: dashboardServerApi.getBusinesses,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NewDashboardClient />
    </HydrationBoundary>
  );
}
