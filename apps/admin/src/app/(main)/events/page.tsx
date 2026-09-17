import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client.server";
import { eventKeys } from "@/features/events/queries";
import { eventsServerApi } from "@/features/events/api.server";
import EventsClient from "./EventsClient";

export default async function EventsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: eventKeys.list("events"),
    queryFn: eventsServerApi.getEvents,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EventsClient />
    </HydrationBoundary>
  );
}
