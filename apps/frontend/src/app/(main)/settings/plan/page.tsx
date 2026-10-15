// Server Component — prefetches the public plan catalog on the server.
// Migrated off the legacy useRequest hook onto useSubscriptionPlansQuery
// (features/authentication) in the same pass — see
// docs/ARCHITECTURE.md Phase 6 and event/[id]/details/page.tsx for the
// general SSR-prefetch pattern.
import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { authKeys } from "@/features/authentication/queries";
import { authServerApi } from "@/features/authentication/api.server";
import PlanClient from "./PlanClient";

export const metadata: Metadata = { title: "Plan" };

export default async function PlanPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: authKeys.subscriptionPlans(),
    queryFn: authServerApi.getSubscriptionPlans,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PlanClient />
    </HydrationBoundary>
  );
}
