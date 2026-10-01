import React from "react";
import Image from "next/image";
import CalendarIcon from "@/images/icons/calendar.svg";
import DotIcon from "@/images/icons/dot.svg";
import LocationIcon from "@/images/icons/location.svg";
import { EventInterface } from "@/interfaces/EventInterface";
import { formatDate, formatLongTime } from "@/lib/dateTimeFormatter";
import { getSafeImageSrc } from "@/lib/helper";

type EventCardIF = {
  event: EventInterface;
};
const EventCard: React.FC<EventCardIF> = ({ event }) => {
  return (
    <div className="laptop:w-[316px] mb-[16px] flex w-[165px] flex-col rounded-[12px] bg-white">
      <Image
        src={getSafeImageSrc(event?.event_image, "/images/default-event.jpg")}
        alt="event_1"
        width={316}
        height={316}
        className="laptop:h-[316px] laptop:w-[316px] h-[165px] w-[165px] rounded-t-[12px]"
      />
      <div className="p-2">
        <p className="tracking-custom laptop:text-[18px] my-2 font-sans text-[14px] leading-[27px] font-semibold">
          {event.event_name}
        </p>
        <div className="my-2 flex items-center gap-1">
          <CalendarIcon className="h-[12px] w-[12px]" />
          <p className="text-text-grey laptop:text-[14px] font-sans text-[10px] leading-[16.8px] font-normal">
            {formatDate(event?.start_date)}
          </p>
          <DotIcon className="h-[3px] w-[3px]" />
          <p className="text-text-grey laptop:text-[14px] font-sans text-[10px] leading-[16.8px] font-normal">
            {formatLongTime(event?.start_date)}
          </p>
        </div>
        <div className="my-2 flex items-center gap-1">
          <LocationIcon className="h-[12px] w-[12px]" />
          <p className="text-text-grey laptop:text-[14px] truncate font-sans text-[10px] leading-[16.8px] font-normal">
            {event?.location}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
