import React from "react";
import { EventInterface } from "@/interfaces/EventInterface";
import Link from "next/link";
import CalendarIcon from "@/images/icons/calendar.svg";
import { formatDate, formatLongTime } from "@/lib/dateTimeFormatter";
import { DotFilledIcon } from "@radix-ui/react-icons";
import LocationIcon from "@/images/icons/location.svg";
import ChevronRightIcon from "@/images/icons/chevronRight.svg";
import Image from "next/image";

const AffiliateItems = ({ event }: { event: EventInterface }) => {
  return (
    <Link href={`/event/${event?.id}/program-details`} className="block">
      <div className="sm:p-4 group flex w-full cursor-pointer items-start justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:border-gray-200 hover:shadow-md">
        {/* Left: image + content */}
        <div className="flex min-w-0 gap-3">
          {/* Image */}
          <div className="sm:w-[84px] sm:h-[84px] relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={event?.event_image}
              alt={event?.event_name ?? "event"}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 64px, 84px"
            />
          </div>

          {/* Content */}
          <div className="flex min-w-0 flex-col">
            <p className="sm:text-[15px] truncate font-sans text-[14px] font-semibold leading-[1.3] text-black-light">
              {event?.event_name}
            </p>

            {/* Date + time (wraps on mobile) */}
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-text-grey">
              <span className="inline-flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span className="sm:text-[13px] font-sans text-[12px] font-normal leading-[1.2]">
                  {formatDate(event?.start_date)}
                </span>
              </span>

              <span className="sm:inline hidden text-text-grey/60">•</span>

              <span className="sm:text-[13px] font-sans text-[12px] font-normal leading-[1.2]">
                {formatLongTime(event?.start_date)} – {formatLongTime(event?.end_date)}
              </span>
            </div>

            {/* Location */}
            <div className="mt-2 flex min-w-0 items-center gap-1 text-text-grey">
              <LocationIcon className="h-4 w-4 shrink-0" />
              <p className="sm:text-[13px] truncate font-sans text-[12px] font-normal leading-[1.2]">
                {event?.location}
              </p>
            </div>
          </div>
        </div>

        {/* Right: chevron */}
        <div className="shrink-0 pt-1 text-text-grey/70 transition group-hover:text-text-grey">
          <ChevronRightIcon className="h-5 w-5" />
        </div>
      </div>
    </Link>
  );
};

export default AffiliateItems;
