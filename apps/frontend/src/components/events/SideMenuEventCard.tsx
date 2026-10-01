import React from "react";
import Image from "next/image";
import CalendarIcon from "@/images/icons/calendar.svg";
import { DotFilledIcon } from "@radix-ui/react-icons";
import LocationIcon from "@/images/icons/location.svg";
import ChevronRightIcon from "@/images/icons/chevronRight.svg";
import { EventInterface } from "@/interfaces/EventInterface";
import { formatDate, formatLongTime, formatTime } from "@/lib/dateTimeFormatter";
import { getSafeImageSrc } from "@/lib/helper";

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
            src={getSafeImageSrc(event.event_image, "/images/default-event.jpg")}
            alt="upcoming_event"
            width={94}
            height={94}
            className={"h-[94px] w-[94px] rounded-xl"}
          />
        </div>
        <div className="flex flex-col gap-2.5">
          <p className="font-semi-normal tracking-custom text-black-light font-sans text-[14px] leading-[21px]">
            {event.event_name}
          </p>
          <div className="flex items-center gap-1">
            <CalendarIcon />
            <p className="font-semi-normal text-text-grey font-sans text-[12px] leading-[14.4px]">
              {formatDate(event?.start_date)}
            </p>
            <DotFilledIcon className="text-text-grey w-2.5" />
            <p className="font-semi-normal text-text-grey font-sans text-[12px] leading-[14.4px]">
              {formatLongTime(event.start_date)}
            </p>
            <p className="font-semi-normal text-text-grey font-sans text-[12px] leading-[14.4px]">
              -
            </p>
            <p className="font-semi-normal text-text-grey font-sans text-[12px] leading-[14.4px]">
              {formatLongTime(event.end_date)}
            </p>
          </div>
          <div className="flex items-center">
            <LocationIcon />
            <p className="font-semi-normal text-text-grey font-sans text-[12px] leading-[14.4px]">
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
