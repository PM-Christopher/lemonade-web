import React from 'react';
import Image from "next/image";
import event_1 from "@/image/event_images/event_1.png";
import CalendarIcon from "@/image/icons/CalendarIcon.svg";
import DotIcon from "@/image/icons/Dot.svg";
import {EventInterface} from "@/interfaces/EventInterface";
import {formatDate, formatTime} from "@/lib/dateTimeFormatter";

type EventIF = {
    event: EventInterface
}

const EventCard: React.FC<EventIF> = ({event}) => {
    return (
        <div className="flex flex-col">
            <div>
                <Image src={event_1} alt="event_1" width={200}/>
            </div>
            <div className="my-2">
                <p className="font-sans font-semi-normal text-[16px] leading-[24px]">{event.event_name}</p>
            </div>
            <div className="flex items-center gap-1">
                <div>
                    <CalendarIcon/>
                </div>
                <div>
                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-text-grey">
                        {formatDate(event?.start_date)}
                    </p>
                </div>
                <div>
                    <DotIcon className="w-[3px] h-[3px]"/>
                </div>
                <div>
                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-text-grey">
                        {formatTime(event?.start_date)}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default EventCard;