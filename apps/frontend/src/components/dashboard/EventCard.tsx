import React from "react";
import Image from "next/image";
import CalendarIcon from "@/images/icons/calendarIcon.svg";
import DotIcon from "@/images/icons/dot.svg";
import { EventInterface } from "@/interfaces/EventInterface";
import { formatDate, formatTime } from "@/lib/dateTimeFormatter";
import { getSafeImageSrc } from "@/lib/helper";

type EventIF = {
  event: EventInterface;
};

const EventCard: React.FC<EventIF> = ({ event }) => {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl shadow-sm">
      <div className="flex h-[200px] flex-shrink-0 items-center justify-center bg-white">
        <Image
          src={getSafeImageSrc(event?.event_image, "/images/event_images/event_1.png")}
          alt="event_1"
          width={200}
          height={200}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex flex-col p-3">
        <p className="font-semi-normal text-body-l truncate font-sans" title={event.event_name}>
          {event.event_name}
        </p>
        <div className="mt-2 flex items-center gap-1 overflow-hidden">
          <CalendarIcon className="text-text-grey h-4 w-4 shrink-0" />
          <p className="font-semi-normal text-text-grey text-body-s shrink-0 font-sans whitespace-nowrap">
            {formatDate(event?.start_date)}
          </p>
          <DotIcon className="text-text-grey h-[3px] w-[3px]" />
          <p className="font-semi-normal text-text-grey text-body-s font-sans">
            {formatTime(event?.start_date)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
