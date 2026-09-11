"use client";
import React, {useEffect, useState} from "react";
import Carousel from "@/components/global/ImageSlider";
import EventCard from "@/components/events/EventCard";
import {useSelector} from "react-redux";
import {useRequest} from "@/hooks/useRequest";
import {EventInterface} from "@/interfaces/EventInterface";
import Link from "next/link";
import {useMediaQuery} from "react-responsive";
import {RootState} from "@/redux/store";
import {EventsSkeleton, TrendingEventsSkeleton} from "@/components/Skeletons";
import {useAppDispatch} from "@/redux/hook";
import {getEvents} from "@/features/events/event.slice";

type EventsInterface = {
    results: EventInterface[];
    searchTerm: string;
};

const EventsSectionView: React.FC<EventsInterface> = ({
                                                          results,
                                                          searchTerm,
                                                      }) => {
    const isMobile = useMediaQuery({query: "(max-width: 1023px)"});
    const dispatch = useAppDispatch();
    const {
        filtered,
        filteredEvents,
        events,
        eventsLoading,
        filteredLoading
    } = useSelector((state: RootState) => state.event);

    useEffect(() => {
        dispatch(getEvents())
    }, []);

    return (
        <section className="mt-2 flex flex-col items-center">
            {
                eventsLoading ? (
                    <div
                        className="bg-none laptop:bg-light-green-50 p-[24px] w-full laptop:w-[1008px] rounded-[12px] flex justify-center">
                        <TrendingEventsSkeleton/>
                    </div>
                ) : (
                    events?.trending?.length > 0 && (
                        <div
                            className="bg-none laptop:bg-light-green-50 p-[24px] w-full laptop:w-[1008px] rounded-[12px] flex justify-center">
                            <Carousel
                                events={events?.trending}
                                showDots={true}
                                showArrows={false}
                            />
                        </div>
                    )
                )
            }

            <div className="w-full laptop:w-[1008px] p-[24px] rounded-[12px] mt-[48px]">
                {searchTerm ? (
                    results.length > 0 ? (
                        isMobile ? (
                            <div className="flex overflow-x-auto mt-3 space-x-2 scrollbar-hide py-4 shadow-none">
                                {results.map((event: EventInterface, index: number) => (
                                    <Link href={`/event/${event?.id}`} key={index}>
                                        <EventCard event={event}/>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-2">
                                {results.map((event: EventInterface, index: number) => (
                                    <Link href={`/event/${event?.id}`} key={index}>
                                        <EventCard event={event}/>
                                    </Link>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="col-span-2 laptop:col-span-3 flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                            <svg
                                className="w-12 h-12 text-gray-300 mb-3"
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
                            <p className="text-gray-600 font-medium">
                                No results found
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                                Search for another event.
                            </p>
                        </div>
                    )
                ) : filtered ? (
                    <>
                        <p className="font-sans font-semibold text-[20px] leading-[28px] mb-[16px]">
                            Filtered Events
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {
                                filteredLoading ? (
                                    <EventsSkeleton count={3}/>
                                ) : (
                                    filteredEvents.map((event: EventInterface, index: number) => (
                                        <Link href={`/event/${event?.id}`} key={index}>
                                            <EventCard event={event}/>
                                        </Link>
                                    ))
                                )
                            }
                        </div>
                    </>
                ) : (
                    <>
                        <p className="font-sans font-semibold text-[20px] leading-[28px] mb-[16px]">
                            All Events
                        </p>
                        {isMobile ? (
                            <div className="flex overflow-x-auto mt-3 space-x-2 scrollbar-hide py-4 shadow-none">
                                {events?.this_week.map((event: EventInterface, index: number) => (
                                    <Link href={`/event/${event?.id}`} key={index}>
                                        <EventCard event={event}/>
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
                                    <div className="col-span-3 flex flex-col items-center justify-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                                        <svg
                                            className="w-12 h-12 text-gray-300 mb-3"
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
                                        <p className="text-gray-600 font-medium">
                                            No events scheduled for this week
                                        </p>
                                        <p className="text-gray-400 text-sm mt-1">
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
