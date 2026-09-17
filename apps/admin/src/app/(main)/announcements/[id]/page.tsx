import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { announcementKeys } from "@/features/announcements/queries";
import { announcementsServerApi } from "@/features/announcements/api.server";
import AnnouncementDetailsClient from "./AnnouncementDetailsClient";

export default async function AnnouncementDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = Number(params.id);
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: announcementKeys.detail(id),
    queryFn: () => announcementsServerApi.getAnnouncement(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AnnouncementDetailsClient id={id} />
    </HydrationBoundary>
  );
}
