import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { announcementKeys } from "@/features/announcements/queries";
import { announcementsServerApi } from "@/features/announcements/api.server";
import AnnouncementsClient from "./AnnouncementsClient";

export default async function AnnouncementsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: announcementKeys.list(),
    queryFn: announcementsServerApi.getAnnouncements,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AnnouncementsClient />
    </HydrationBoundary>
  );
}
