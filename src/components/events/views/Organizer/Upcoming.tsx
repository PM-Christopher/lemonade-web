import React from 'react';
import Image from "next/image";
import CalendarIcon from "@/images/icons/calendar-large.svg";
import ClockIcon from "@/images/icons/clock.svg";
import LocationIcon from "@/images/icons/location-large.svg";
import ChevronRight from "@/images/icons/chevronRight.svg";
import OrganizerEventCard from "@/components/events/OrganizerEventCard";
import Link from "next/link";
import {EventInterface} from "@/interfaces/EventInterface";
import {formatLongDate, formatLongTime} from "@/lib/dateTimeFormatter";
import EditIcon from "@/images/icons/edit.svg";
import {useMediaQuery} from "react-responsive";
import {PlusIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import {EventsSkeleton} from "@/components/Skeletons";

const Upcoming = ({events, loading}: { events: EventInterface[], loading: boolean }) => {
    return (
        <>
            {
                events?.length > 0 && (
                    <div
                        className="flex flex-col laptop:flex-row bg-white gap-[24px] rounded-[16px] pr-0 laptop:pr-[80px] w-full laptop:w-[780px]">
                        <Image src={events[0]?.event_image} alt="poster" width={320} height={343}
                               className="w-[320px]"/>
                        <div className="flex flex-col mt-[12px] laptop:mt-[24px] px-[10px] pb-[10px]">
                            <p className="font-sans font-semibold text-[24px] leading-[33.6px]">
                                {events[0]?.event_name}
                            </p>
                            <div className="flex items-center gap-2 mt-[16px]">
                                <CalendarIcon/>
                                <p className="font-sans font-semi-normal text-[16px] leading-[24px] tracking-custom text-text-grey">
                                    {formatLongDate(events[0]?.start_date, 'mid')}
                                </p>
                                <p>-</p>
                                <p className="font-sans font-semi-normal text-[16px] leading-[24px] tracking-custom text-text-grey">
                                    {formatLongDate(events[0]?.end_date, 'mid')}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 mt-[16px]">
                                <ClockIcon/>
                                <p className="font-sans font-semi-normal text-[16px] leading-[24px] text-text-grey">
                                    {formatLongTime(events[0]?.start_date)}
                                </p>
                                <p>-</p>
                                <p className="font-sans font-semi-normal text-[16px] leading-[24px] text-text-grey">
                                    {formatLongTime(events[0]?.end_date)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 mt-[16px]">
                                <LocationIcon/>
                                <p className="font-sans font-semi-normal text-[16px] leading-[24px] text-text-grey">
                                    {events[0]?.location}
                                </p>
                            </div>
                            <Link href={`/event/${events[0]?.id}/details`} className="w-fit">
                                <div className="flex items-center gap-2 mt-[40px] w-fit">
                                    <p className="font-sans font-semi-normal text-[16px] leading-[24px] text-light-green">View
                                        Details</p>
                                    <ChevronRight className="text-light-green"/>
                                </div>
                            </Link>
                        </div>
                    </div>
                )
            }
            <div className="grid grid-cols-2 laptop:grid-cols-3 mt-[10px] w-full laptop:w-[780px] p-[16px] gap-[16px] bg-white rounded-[12px]">
                {loading ? (
                    <EventsSkeleton count={3} />
                ) : events?.length > 0 ? (
                    events?.map((event, index) => (
                        <OrganizerEventCard key={index} event={event} draft={false} />
                    ))
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
                            No upcoming events
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                            Start creating events to engage your audience.
                        </p>
                        <button className="mt-4 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg shadow hover:bg-primary-dark transition">
                            Create Event
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default Upcoming;