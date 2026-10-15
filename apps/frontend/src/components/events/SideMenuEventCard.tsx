import { FallbackImage } from "@/components/global/FallbackImage";
import { images } from "@/lib/images";
import React from "react";
import CalendarIcon from "@/images/icons/calendar.svg";
import { DotFilledIcon } from "@radix-ui/react-icons";
import LocationIcon from "@/images/icons/location.svg";
import ChevronRightIcon from "@/images/icons/chevronRight.svg";
import { EventInterface } from "@/interfaces/EventInterface";
import { formatDate, formatLongTime } from "@/lib/dateTimeFormatter";

const SideMenuEventCard = ({
  event,
  toggle,
  ticket_id,
}: {
  event: EventInterface;
  toggle: (id: number) => void;
  ticket_id: number;
}) => {
  return (
    <div className="flex cursor-pointer justify-between p-4" onClick={() => toggle(ticket_id)}>
      <div className="flex items-center gap-2">
        <div>
          <FallbackImage
            src={event.event_image}
            fallbackSrc={images.DEFAULT_EVENT}
            alt="upcoming_event"
            width={94}
            height={94}
            className={"h-23.5 w-23.5 rounded-xl"}
          />
        </div>
        <div className="flex flex-col gap-2.5">
          <p className="font-semi-normal tracking-custom text-black-light text-body-s font-sans">
            {event.event_name}
          </p>
          <div className="flex items-center gap-1">
            <CalendarIcon />
            <p className="font-semi-normal text-text-grey text-meta font-sans">
              {formatDate(event?.start_date)}
            </p>
            <DotFilledIcon className="text-text-grey w-2.5" />
            <p className="font-semi-normal text-text-grey text-meta font-sans">
              {formatLongTime(event.start_date)}
            </p>
            <p className="font-semi-normal text-text-grey text-meta font-sans">-</p>
            <p className="font-semi-normal text-text-grey text-meta font-sans">
              {formatLongTime(event.end_date)}
            </p>
          </div>
          <div className="flex items-center">
            <LocationIcon />
            <p className="font-semi-normal text-text-grey text-meta font-sans">{event.location}</p>
          </div>
        </div>
      </div>
      <div>
        <ChevronRightIcon />
      </div>
    </div>
  );
};

export default SideMenuEventCard;
