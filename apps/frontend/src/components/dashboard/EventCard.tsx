import React from "react";
import Image from "next/image";
import CalendarIcon from "@/images/icons/calendarIcon.svg";
import DotIcon from "@/images/icons/dot.svg";
import {EventInterface} from "@/interfaces/EventInterface";
import {formatDate, formatTime} from "@/lib/dateTimeFormatter";

type EventIF = {
    event: EventInterface;
};

const EventCard: React.FC<EventIF> = ({event}) => {
    return (
        <div className="flex flex-col h-[280px] w-[200px] rounded-2xl overflow-hidden shadow-sm">
            <div className="flex-shrink-0 h-[200px]">
                <Image
                    src={event?.event_image}
                    alt="event_1"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover rounded-t-2xl"
                />
            </div>
            <div className="flex-1 flex flex-col justify-between p-3">
                <div className="mb-2">
                    <p className="font-sans font-semi-normal text-base leading-6 line-clamp-2">
                        {event.event_name}
                    </p>
                </div>
                <div className="flex items-center gap-1 mt-auto">
                    <CalendarIcon className="w-4 h-4 text-text-grey"/>
                    <p className="font-sans font-semi-normal text-sm leading-[21px] text-text-grey">
                        {formatDate(event?.start_date)}
                    </p>
                    <DotIcon className="w-[3px] h-[3px] text-text-grey"/>
                    <p className="font-sans font-semi-normal text-sm leading-[21px] text-text-grey">
                        {formatTime(event?.start_date)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
