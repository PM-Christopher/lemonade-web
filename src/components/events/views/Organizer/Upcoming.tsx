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

const Upcoming = ({events, loading}: {events: EventInterface[], loading: boolean}) => {
    return (
        <>
            {
                !loading && (
                    <>
                        {
                            events.length > 0 && (
                                <div className="flex flex-col laptop:flex-row bg-white gap-[24px] rounded-[16px] pr-0 laptop:pr-[80px] w-full laptop:w-[780px]">
                                    <Image src={events[0]?.event_image} alt="poster" width={320} height={343} className="w-[320px]"/>
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
                        <div
                            className="grid grid-cols-2 laptop:grid-cols-3 mt-[10px] w-full laptop:w-[780px] p-[16px] gap-[16px] bg-white rounded-[12px]">
                            {
                                events.length > 0 ? (
                                    events.map((event, index) => (
                                        <OrganizerEventCard event={event} draft={false}/>
                                    ))
                                ) : (
                                    <p>No events upcoming</p>
                                )
                            }
                        </div>
                    </>
                )
            }
        </>
    );
}

export default Upcoming;