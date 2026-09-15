// Server Component — prefetches the dashboard's three discovery lists on
// the server. No dynamic params; middleware already gates "/" behind
// login, so there's no client-side enabled: isLoggedIn branch to reproduce
// server-side (same reasoning as settings/wallet/page.tsx). First
// features/dashboard/api.server.ts. See event/[id]/details/page.tsx and
// docs/ARCHITECTURE.md Phase 6 for the general pattern.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { dashboardKeys } from "@/features/dashboard/queries";
import { dashboardServerApi } from "@/features/dashboard/api.server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
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
      <DashboardClient />
    </HydrationBoundary>
  );
}
