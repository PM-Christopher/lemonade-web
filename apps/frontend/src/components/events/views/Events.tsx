"use client";
import React from "react";
import Carousel from "@/components/global/ImageSlider";
import EventCard from "@/components/events/EventCard";
import { EventInterface } from "@/interfaces/EventInterface";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { EventsSkeleton, TrendingEventsSkeleton } from "@/components/Skeletons";
import { useEventsQuery } from "@/features/events/queries";

type EventsInterface = {
  results: EventInterface[];
  searchTerm: string;
  filtered: boolean;
  filteredEvents: EventInterface[];
  filteredLoading: boolean;
};

const EventsSectionView: React.FC<EventsInterface> = ({
  results,
  searchTerm,
  filtered,
  filteredEvents,
  filteredLoading,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 1023px)" });
  const { data: eventsData, isLoading: eventsLoading } = useEventsQuery();
  const events = eventsData ?? { trending: [], this_week: [], upcoming: [] };

  return (
    <section className="mt-2 flex flex-col items-center">
      {eventsLoading ? (
        <div className="flex w-full justify-center rounded-[12px] bg-none p-[24px] laptop:w-[1008px] laptop:bg-light-green-50">
          <TrendingEventsSkeleton />
        </div>
      ) : (
        events?.trending?.length > 0 && (
          <div className="flex w-full justify-center rounded-[12px] bg-none p-[24px] laptop:w-[1008px] laptop:bg-light-green-50">
            <Carousel events={events?.trending} showDots={true} showArrows={false} />
          </div>
        )
      )}

      <div className="mt-[48px] w-full rounded-[12px] p-[24px] laptop:w-[1008px]">
        {searchTerm ? (
          results.length > 0 ? (
            isMobile ? (
              <div className="scrollbar-hide mt-3 flex space-x-2 overflow-x-auto py-4 shadow-none">
                {results.map((event: EventInterface, index: number) => (
                  <Link href={`/event/${event?.id}`} key={index}>
                    <EventCard event={event} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {results.map((event: EventInterface, index: number) => (
                  <Link href={`/event/${event?.id}`} key={index}>
                    <EventCard event={event} />
                  </Link>
                ))}
              </div>
            )
          ) : (
            <div className="col-span-2 flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-12 laptop:col-span-3">
              <svg
                className="mb-3 h-12 w-12 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 1.343-3 3 0 1.306.835 2.418 2 2.83V17h2v-3.17c1.165-.412 2-1.524 2-2.83 0-1.657-1.343-3-3-3z"
                />
              </svg>
              <p className="font-medium text-gray-600">No results found</p>
              <p className="mt-1 text-sm text-gray-400">Search for another event.</p>
            </div>
          )
        ) : filtered ? (
          <>
            <p className="mb-[16px] font-sans text-[20px] font-semibold leading-[28px]">
              Filtered Events
            </p>
            <div className="grid grid-cols-3 gap-2">
              {filteredLoading ? (
                <EventsSkeleton count={3} />
              ) : (
                filteredEvents.map((event: EventInterface, index: number) => (
                  <Link href={`/event/${event?.id}`} key={index}>
                    <EventCard event={event} />
                  </Link>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            <p className="mb-[16px] font-sans text-[20px] font-semibold leading-[28px]">
              All Events
            </p>
            {isMobile ? (
              <div className="scrollbar-hide mt-3 flex space-x-2 overflow-x-auto py-4 shadow-none">
                {events?.this_week.map((event: EventInterface, index: number) => (
                  <Link href={`/event/${event?.id}`} key={index}>
                    <EventCard event={event} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {eventsLoading ? (
                  <EventsSkeleton count={6} />
                ) : events?.this_week && events.this_week.length > 0 ? (
                  events.this_week.map((event: EventInterface, index: number) => (
                    <Link href={`/event/${event?.id}`} key={index}>
                      <EventCard event={event} />
                    </Link>
                  ))
                ) : (
                  <div className="col-span-3 flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-10">
                    <svg
                      className="mb-3 h-12 w-12 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-2h6v2m-7 4h8a2 2 0 002-2v-6H5v6a2 2 0 002 2zM9 9V7a3 3 0 016 0v2m6 4H3"
                      />
                    </svg>
                    <p className="font-medium text-gray-600">No events scheduled for this week</p>
                    <p className="mt-1 text-sm text-gray-400">
                      Check back later or explore other upcoming events.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default EventsSectionView;
