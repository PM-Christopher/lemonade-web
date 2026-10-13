// Server Component. Prefetches the profile, which mid-signup is read with the onboarding cookie.
import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { settingsKeys } from "@/features/settings/queries";
import { settingsServerApi } from "@/features/settings/api.server";
import ProfileSetupClient from "./ProfileSetupClient";

export const metadata: Metadata = { title: "Set up your profile" };

export default async function Page() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: settingsKeys.profile(),
    queryFn: settingsServerApi.getUserProfile,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileSetupClient />
    </HydrationBoundary>
  );
}
