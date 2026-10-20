"use client";
import React from "react";
import Carousel from "@/components/global/ImageSlider";
import EventCard from "@/components/events/EventCard";
import { EventInterface } from "@/interfaces/EventInterface";
import Link from "next/link";
import { EventsSkeleton, TrendingEventsSkeleton } from "@/components/Skeletons";
import { useEventsQuery } from "@/features/events/queries";
import { routes } from "@/lib/routes";

type EventsInterface = {
  results: EventInterface[];
  searchTerm: string;
  searchLoading?: boolean;
  filtered: boolean;
  filteredEvents: EventInterface[];
  filteredLoading: boolean;
  onClearFilter?: () => void;
};

// One scrolling row on small screens, three columns on large ones.
function EventList({ events }: { events: EventInterface[] }) {
  return (
    <div className="scrollbar-hide laptop:grid laptop:grid-cols-3 laptop:gap-2 laptop:overflow-visible flex gap-2 overflow-x-auto py-2">
      {events.map((event) => (
        <Link href={routes.EVENT_DETAIL(event.id)} key={event.id} className="shrink-0">
          <EventCard event={event} />
        </Link>
      ))}
    </div>
  );
}

function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 py-10 text-center">
      <p className="font-medium text-gray-600">{title}</p>
      <p className="mt-1 text-sm text-gray-400">{hint}</p>
    </div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-title-r font-sans font-semibold">{title}</p>
        {action}
      </div>
      {children}
    </section>
  );
}

const EventsSectionView: React.FC<EventsInterface> = ({
  results,
  searchTerm,
  searchLoading = false,
  filtered,
  filteredEvents,
  filteredLoading,
  onClearFilter,
}) => {
  const { data: eventsData, isLoading: eventsLoading } = useEventsQuery();
  const events = eventsData ?? { trending: [], this_week: [], upcoming: [] };
  const isBrowsing = !searchTerm && !filtered;

  return (
    <section className="mt-2 flex flex-col items-center">
      {isBrowsing &&
        (eventsLoading ? (
          <div className="laptop:w-252 laptop:bg-light-green-50 flex w-full justify-center rounded-xl bg-none p-4">
            <TrendingEventsSkeleton />
          </div>
        ) : (
          events.trending.length > 0 && (
            <div className="laptop:w-252 laptop:bg-light-green-50 flex w-full justify-center rounded-xl bg-none p-4">
              <Carousel events={events.trending} showDots={true} showArrows={false} />
            </div>
          )
        ))}

      <div className="laptop:w-252 mt-6 w-full rounded-xl p-4">
        {searchTerm ? (
          <Section title="Search results">
            {searchLoading ? (
              <EventsSkeleton count={3} />
            ) : results.length > 0 ? (
              <EventList events={results} />
            ) : (
              <EmptyState title="No results found" hint="Search for another event." />
            )}
          </Section>
        ) : filtered ? (
          <Section
            title="Filtered events"
            action={
              onClearFilter && (
                <button
                  type="button"
                  onClick={onClearFilter}
                  className="text-body-s text-light-green cursor-pointer font-semibold"
                >
                  Clear filter
                </button>
              )
            }
          >
            {filteredLoading ? (
              <EventsSkeleton count={3} />
            ) : filteredEvents.length > 0 ? (
              <EventList events={filteredEvents} />
            ) : (
              <EmptyState title="No events match your filter" hint="Try different options." />
            )}
          </Section>
        ) : eventsLoading ? (
          <EventsSkeleton count={6} />
        ) : (
          <>
            {events.this_week.length > 0 && (
              <Section title="This week">
                <EventList events={events.this_week} />
              </Section>
            )}
            <Section title="All events">
              {events.upcoming.length > 0 ? (
                <EventList events={events.upcoming} />
              ) : (
                <EmptyState title="No upcoming events" hint="Check back later for new events." />
              )}
            </Section>
          </>
        )}
      </div>
    </section>
  );
};

export default EventsSectionView;
