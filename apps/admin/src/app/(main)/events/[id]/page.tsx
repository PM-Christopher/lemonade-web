import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { eventKeys } from "@/features/events/queries";
import { eventsServerApi } from "@/features/events/api.server";
import EventDetailsClient from "./EventDetailsClient";

export default async function EventDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = Number(params.id);
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventsServerApi.getEventDetail(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EventDetailsClient id={id} />
    </HydrationBoundary>
  );
}
