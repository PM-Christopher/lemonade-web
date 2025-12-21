import React from 'react';
import Image from "next/image";
import CalendarIcon from "@/images/icons/calendar.svg";
import {DotFilledIcon} from "@radix-ui/react-icons";
import LocationIcon from "@/images/icons/location.svg";
import ChevronRightIcon from "@/images/icons/chevronRight.svg";
import {EventInterface} from "@/interfaces/EventInterface";
import {formatDate, formatLongTime, formatTime} from "@/lib/dateTimeFormatter";

const SideMenuEventCard = ({ event, toggle, ticket_id }: { event: EventInterface, toggle: (id: number) => void, ticket_id: number }) => {


    return (
        <div className="p-4 flex justify-between cursor-pointer" onClick={() => toggle(ticket_id)}>
            <div className="flex gap-2 items-center">
                <div>
                    <Image
                        src={event.event_image}
                        alt="upcoming_event" width={94}
                        height={94}
                        className={"w-[94px] h-[94px] rounded-[12px]"}
                    />
                </div>
                <div className="flex flex-col gap-[10px]">
                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom text-black-light">
                        {event.event_name}
                    </p>
                    <div className="flex items-center gap-[4px]">
                        <CalendarIcon/>
                        <p className="font-sans font-semi-normal text-text-grey text-[12px] leading-[14.4px]">
                            {formatDate(event?.start_date)}
                        </p>
                        <DotFilledIcon className="text-text-grey w-[10px]"/>
                        <p className="font-sans font-semi-normal text-text-grey text-[12px] leading-[14.4px]">
                            {formatLongTime(event.start_date)}
                        </p>
                        <p className="font-sans font-semi-normal text-text-grey text-[12px] leading-[14.4px]">-</p>
                        <p className="font-sans font-semi-normal text-text-grey text-[12px] leading-[14.4px]">
                            {formatLongTime(event.end_date)}
                        </p>
                    </div>
                    <div className="flex items-center">
                        <LocationIcon/>
                        <p className="font-sans font-semi-normal text-[12px] leading-[14.4px] text-text-grey">
                            {event.location}
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <ChevronRightIcon/>
            </div>
        </div>
    );
}

export default SideMenuEventCard;