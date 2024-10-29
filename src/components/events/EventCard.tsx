import React from 'react';
import Image from "next/image";
import CalendarIcon from "@/images/icons/calendar.svg";
import DotIcon from "@/images/icons/dot.svg";
import LocationIcon from "@/images/icons/location.svg";
import {EventInterface} from "@/interfaces/EventInterface";
import {formatDate, formatLongTime} from "@/lib/dateTimeFormatter";

type EventCardIF = {
    event: EventInterface
}
const EventCard: React.FC<EventCardIF> = ({event}) => {
    return (
        <div className="bg-white flex flex-col w-[316px] rounded-[12px] mb-[16px]">
            <Image src={event?.event_image} alt="event_1" width={316} height={316}/>
            <div className="p-2">
                <p className="my-2 font-sans font-semibold text-[18px] leading-[27px] tracking-custom">
                    {event.event_name}
                </p>
                <div className="flex items-center gap-1 my-2">
                    <CalendarIcon/>
                    <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">
                        {formatDate(event?.start_date)}
                    </p>
                    <DotIcon className="w-[3px] h-[3px]"/>
                    <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">
                        {formatLongTime(event?.start_date)}
                    </p>
                </div>
                <div className="flex items-center gap-1 my-2">
                    <LocationIcon/>
                    <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">
                        {event?.location}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default EventCard;