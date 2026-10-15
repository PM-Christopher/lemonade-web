import { FallbackImage } from "@/components/global/FallbackImage";
import { images } from "@/lib/images";
import React from "react";
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
    <div className="laptop:w-79 mb-4 flex w-41.25 flex-col rounded-xl bg-white">
      <FallbackImage
        src={event?.event_image}
        fallbackSrc={images.DEFAULT_EVENT}
        alt="event_1"
        width={316}
        height={316}
        className="laptop:h-79 laptop:w-79 h-41.25 w-41.25 rounded-t-xl"
      />
      <div className="p-2">
        <p className="tracking-custom laptop:text-body-xl text-body-s my-2 font-sans leading-6.75 font-semibold">
          {event.event_name}
        </p>
        <div className="my-2 flex items-center gap-1">
          <CalendarIcon className="h-3 w-3" />
          <p className="text-text-grey laptop:text-body-s text-meta font-sans leading-4.25 font-normal">
            {formatDate(event?.start_date)}
          </p>
          <DotIcon className="h-0.75 w-0.75" />
          <p className="text-text-grey laptop:text-body-s text-meta font-sans leading-4.25 font-normal">
            {formatLongTime(event?.start_date)}
          </p>
        </div>
        <div className="my-2 flex items-center gap-1">
          <LocationIcon className="h-3 w-3" />
          <p className="text-text-grey laptop:text-body-s text-meta truncate font-sans leading-4.25 font-normal">
            {event?.location}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
