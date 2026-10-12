import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { settingsKeys } from "@/features/settings/queries";
import { settingsServerApi } from "@/features/settings/api.server";
import ReferralClient from "./ReferralClient";

export const metadata: Metadata = { title: "Referrals" };

// Prefetches the referral summary and activity for first paint.
export default async function ReferralSettingsPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: settingsKeys.referral(),
      queryFn: settingsServerApi.getReferralSummary,
    }),
    queryClient.prefetchQuery({
      queryKey: settingsKeys.referralActivity(),
      queryFn: settingsServerApi.getReferralActivity,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReferralClient />
    </HydrationBoundary>
  );
}
