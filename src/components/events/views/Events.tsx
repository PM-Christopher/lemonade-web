"use client";
import React, { useState } from "react";
import Carousel from "@/components/global/ImageSlider";
import EventCard from "@/components/events/EventCard";
import { useSelector } from "react-redux";
import { useRequest } from "@/hooks/useRequest";
import { EventInterface } from "@/interfaces/EventInterface";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";

type EventsInterface = {
  results: EventInterface[];
  searchTerm: string;
};

const EventsSectionView: React.FC<EventsInterface> = ({
  results,
  searchTerm,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 1023px)" });
  const { authToken } = useSelector((state: any) => state.auth);
  const getHeader = () => {
    return {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  };
  const [trendingEvents, setTrendingEvents] = useState([]);

  const { data, loading } = useRequest(
    `/events/attendees`,
    "GET",
    {},
    true,
    getHeader()
  );

  return (
    <section className="mt-2 flex flex-col items-center">
      {searchTerm ? (
        <div>
          <p>Showing results for "{searchTerm}"</p>
        </div>
      ) : (
        trendingEvents.length > 0 && (
          <div className="bg-none laptop:bg-light-green-50 p-[24px] w-full laptop:w-[1008px] rounded-[12px] flex justify-center">
            {!loading && (
              <Carousel
                events={data?.trending}
                showDots={true}
                showArrows={false}
              />
            )}
          </div>
        )
      )}

      <div className="w-full laptop:w-[1008px] p-[24px] rounded-[12px] mt-[48px]">
        {searchTerm ? (
          results.length > 0 ? (
            isMobile ? (
              <div className="flex overflow-x-auto mt-3 space-x-2 scrollbar-hide py-4 shadow-none">
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
            <p className="font-semiBold text-[24px]">No results found</p>
          )
        ) : (
          <>
            <p className="font-sans font-semibold text-[20px] leading-[28px] mb-[16px]">
              This week
            </p>
            {isMobile ? (
              <div className="flex overflow-x-auto mt-3 space-x-2 scrollbar-hide py-4 shadow-none">
                {data?.this_week.map((event: EventInterface, index: number) => (
                  <Link href={`/event/${event?.id}`} key={index}>
                    <EventCard event={event} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {data?.this_week.map((event: EventInterface, index: number) => (
                  <Link href={`/event/${event?.id}`} key={index}>
                    <EventCard event={event} />
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default EventsSectionView;
