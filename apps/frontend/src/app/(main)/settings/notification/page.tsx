// Server Component — prefetches the current user's notification settings
// on the server. Migrated off the legacy useRequest hook onto
// useNotificationSettingsQuery (features/authentication — see that
// feature's queries.ts for why it lives there and not features/settings)
// in the same pass — see docs/ARCHITECTURE.md Phase 6 and
// event/[id]/details/page.tsx for the general SSR-prefetch pattern.
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { authKeys } from "@/features/authentication/queries";
import { authServerApi } from "@/features/authentication/api.server";
import NotificationSettingsClient from "./NotificationSettingsClient";

export default async function NotificationSettingsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: authKeys.notificationSettings(),
    queryFn: authServerApi.getNotificationSettings,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotificationSettingsClient />
    </HydrationBoundary>
  );
}
