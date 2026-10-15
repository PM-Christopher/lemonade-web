import { FallbackImage } from "@/components/global/FallbackImage";
import { images } from "@/lib/images";
import React from "react";
import CalendarIcon from "@/images/icons/calendarIcon.svg";
import DotIcon from "@/images/icons/dot.svg";
import { EventInterface } from "@/interfaces/EventInterface";
import { formatDate, formatTime } from "@/lib/dateTimeFormatter";

type EventIF = {
  event: EventInterface;
};

const EventCard: React.FC<EventIF> = ({ event }) => {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl shadow-sm">
      <div className="flex h-50 flex-shrink-0 items-center justify-center bg-white">
        <FallbackImage
          src={event?.event_image}
          fallbackSrc={images.EVENT_1}
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
          <DotIcon className="text-text-grey h-0.75 w-0.75" />
          <p className="font-semi-normal text-text-grey text-body-s font-sans">
            {formatTime(event?.start_date)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
