import React from "react";
import Image from "next/image";
import CalendarIcon from "@/images/icons/calendar.svg";
import DotIcon from "@/images/icons/dot.svg";
import LocationIcon from "@/images/icons/location.svg";
import { EventInterface } from "@/interfaces/EventInterface";
import { formatDate, formatLongTime } from "@/lib/dateTimeFormatter";

type EventCardIF = {
  event: EventInterface;
};
const EventCard: React.FC<EventCardIF> = ({ event }) => {
  return (
    <div className="mb-[16px] flex w-[165px] flex-col rounded-[12px] bg-white laptop:w-[316px]">
      <Image
        src={event?.event_image}
        alt="event_1"
        width={316}
        height={316}
        className="h-[165px] w-[165px] rounded-t-[12px] laptop:h-[316px] laptop:w-[316px]"
      />
      <div className="p-2">
        <p className="my-2 font-sans text-[14px] font-semibold leading-[27px] tracking-custom laptop:text-[18px]">
          {event.event_name}
        </p>
        <div className="my-2 flex items-center gap-1">
          <CalendarIcon className="h-[12px] w-[12px]" />
          <p className="font-sans text-[10px] font-normal leading-[16.8px] text-text-grey laptop:text-[14px]">
            {formatDate(event?.start_date)}
          </p>
          <DotIcon className="h-[3px] w-[3px]" />
          <p className="font-sans text-[10px] font-normal leading-[16.8px] text-text-grey laptop:text-[14px]">
            {formatLongTime(event?.start_date)}
          </p>
        </div>
        <div className="my-2 flex items-center gap-1">
          <LocationIcon className="h-[12px] w-[12px]" />
          <p className="truncate font-sans text-[10px] font-normal leading-[16.8px] text-text-grey laptop:text-[14px]">
            {event?.location}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
