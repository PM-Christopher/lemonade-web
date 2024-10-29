import React from 'react';
import Link from "next/link";
import {EventInterface} from "@/interfaces/EventInterface";
import CalendarIcon from "@/images/icons/calendar.svg";
import {formatDate, formatLongTime} from "@/lib/dateTimeFormatter";
import {DotFilledIcon} from "@radix-ui/react-icons";
import LocationIcon from "@/images/icons/location.svg";
import ChevronRightIcon from "@/images/icons/chevronRight.svg";

const  PromotionsSubMenu = ({events, loading}: {events: EventInterface[], loading: boolean}) => {
    return (
        <div className="overflow-y-auto max-h-screen hide-scrollbar">
            {
                !loading && events.map((event, index: number) => (
                    <Link href={`/event/5/program-details`}>
                        <div className="p-4 flex justify-between cursor-pointer">
                            <div className="flex gap-2">
                                <div>
                                    {/*<Image src={event?.event_image} alt="upcoming_event" width={84} height={84}/>*/}
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom text-black-light">
                                        {event?.event_name}
                                    </p>
                                    <div className="flex mt-[8px] items-center gap-[4px]">
                                        <CalendarIcon/>
                                        <p className="font-sans font-semi-normal text-text-grey text-[12px] leading-[14.4px]">
                                            {formatDate(event?.start_date)}
                                        </p>
                                        <DotFilledIcon className="text-text-grey w-[10px]"/>
                                        <p className="font-sans font-semi-normal text-text-grey text-[12px] leading-[14.4px]">
                                            {formatLongTime(event?.start_date)}
                                        </p>
                                        <p className="font-sans font-semi-normal text-text-grey text-[12px] leading-[14.4px]">-</p>
                                        <p className="font-sans font-semi-normal text-text-grey text-[12px] leading-[14.4px]">
                                            {formatLongTime(event?.end_date)}
                                        </p>
                                    </div>
                                    <div className="flex mt-[8px] items-center">
                                        <LocationIcon/>
                                        <p className="font-sans font-semi-normal text-[12px] leading-[14.4px] text-text-grey">
                                            {event?.location}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <ChevronRightIcon/>
                            </div>
                        </div>
                    </Link>
                ))
            }
        </div>
    );
}

export default PromotionsSubMenu;