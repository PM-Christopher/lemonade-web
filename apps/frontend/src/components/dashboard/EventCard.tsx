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
    <div className="flex h-[280px] w-[200px] flex-col overflow-hidden rounded-2xl shadow-sm">
      <div className="h-[200px] flex-shrink-0">
        <Image
          src={getSafeImageSrc(event?.event_image, "/images/event_images/event_1.png")}
          alt="event_1"
          width={200}
          height={200}
          className="h-full w-full rounded-t-2xl object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-3">
        <div className="mb-2">
          <p className="line-clamp-2 font-sans text-base font-semi-normal leading-6">
            {event.event_name}
          </p>
        </div>
        <div className="mt-auto flex items-center gap-1">
          <CalendarIcon className="h-4 w-4 text-text-grey" />
          <p className="font-sans text-sm font-semi-normal leading-[21px] text-text-grey">
            {formatDate(event?.start_date)}
          </p>
          <DotIcon className="h-[3px] w-[3px] text-text-grey" />
          <p className="font-sans text-sm font-semi-normal leading-[21px] text-text-grey">
            {formatTime(event?.start_date)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
