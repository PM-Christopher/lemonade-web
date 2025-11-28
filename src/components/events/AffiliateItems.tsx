import React from 'react';
import {EventInterface} from "@/interfaces/EventInterface";
import Link from "next/link";
import CalendarIcon from "@/images/icons/calendar.svg";
import {formatDate, formatLongTime} from "@/lib/dateTimeFormatter";
import {DotFilledIcon} from "@radix-ui/react-icons";
import LocationIcon from "@/images/icons/location.svg";
import ChevronRightIcon from "@/images/icons/chevronRight.svg";
import Image from "next/image";

const AffiliateItems = ({event}: { event: EventInterface }) => {
    return (
        <Link
            href={`/event/${event?.id}/program-details`}
            className="block"
        >
            <div
                className="
      group w-full
      flex items-start justify-between gap-3
      rounded-2xl bg-white
      p-3 sm:p-4
      border border-gray-100
      shadow-sm hover:shadow-md
      hover:border-gray-200
      transition
      cursor-pointer
    "
            >
                {/* Left: image + content */}
                <div className="flex gap-3 min-w-0">
                    {/* Image */}
                    <div
                        className="relative shrink-0 w-16 h-16 sm:w-[84px] sm:h-[84px] overflow-hidden rounded-xl bg-gray-100">
                        <Image
                            src={event?.event_image}
                            alt={event?.event_name ?? "event"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 64px, 84px"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col min-w-0">
                        <p className="font-sans font-semibold text-[14px] sm:text-[15px] leading-[1.3] text-black-light truncate">
                            {event?.event_name}
                        </p>

                        {/* Date + time (wraps on mobile) */}
                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-text-grey">
          <span className="inline-flex items-center gap-1">
            <CalendarIcon className="w-4 h-4"/>
            <span className="font-sans font-normal text-[12px] sm:text-[13px] leading-[1.2]">
              {formatDate(event?.start_date)}
            </span>
          </span>

                            <span className="hidden sm:inline text-text-grey/60">•</span>

                            <span className="font-sans font-normal text-[12px] sm:text-[13px] leading-[1.2]">
            {formatLongTime(event?.start_date)} – {formatLongTime(event?.end_date)}
          </span>
                        </div>

                        {/* Location */}
                        <div className="mt-2 flex items-center gap-1 text-text-grey min-w-0">
                            <LocationIcon className="w-4 h-4 shrink-0"/>
                            <p className="font-sans font-normal text-[12px] sm:text-[13px] leading-[1.2] truncate">
                                {event?.location}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: chevron */}
                <div className="shrink-0 pt-1 text-text-grey/70 group-hover:text-text-grey transition">
                    <ChevronRightIcon className="w-5 h-5"/>
                </div>
            </div>
        </Link>

    );
};

export default AffiliateItems;