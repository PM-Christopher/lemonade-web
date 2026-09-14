import React from "react";
import Image from "next/image";
import CalendarIcon from "@/images/icons/calendar.svg";
import { DotFilledIcon } from "@radix-ui/react-icons";
import LocationIcon from "@/images/icons/location.svg";
import ChevronRightIcon from "@/images/icons/chevronRight.svg";
import { EventInterface } from "@/interfaces/EventInterface";
import { formatDate, formatLongTime, formatTime } from "@/lib/dateTimeFormatter";

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
          <Image
            src={event.event_image}
            alt="upcoming_event"
            width={94}
            height={94}
            className={"h-[94px] w-[94px] rounded-[12px]"}
          />
        </div>
        <div className="flex flex-col gap-[10px]">
          <p className="font-sans text-[14px] font-semi-normal leading-[21px] tracking-custom text-black-light">
            {event.event_name}
          </p>
          <div className="flex items-center gap-[4px]">
            <CalendarIcon />
            <p className="font-sans text-[12px] font-semi-normal leading-[14.4px] text-text-grey">
              {formatDate(event?.start_date)}
            </p>
            <DotFilledIcon className="w-[10px] text-text-grey" />
            <p className="font-sans text-[12px] font-semi-normal leading-[14.4px] text-text-grey">
              {formatLongTime(event.start_date)}
            </p>
            <p className="font-sans text-[12px] font-semi-normal leading-[14.4px] text-text-grey">
              -
            </p>
            <p className="font-sans text-[12px] font-semi-normal leading-[14.4px] text-text-grey">
              {formatLongTime(event.end_date)}
            </p>
          </div>
          <div className="flex items-center">
            <LocationIcon />
            <p className="font-sans text-[12px] font-semi-normal leading-[14.4px] text-text-grey">
              {event.location}
            </p>
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
