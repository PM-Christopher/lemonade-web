import { FallbackImage } from "@/components/global/FallbackImage";
import { images } from "@/lib/images";
import React from "react";
import { EventInterface } from "@/interfaces/EventInterface";
import Link from "next/link";
import CalendarIcon from "@/images/icons/calendar.svg";
import { formatDate, formatLongTime } from "@/lib/dateTimeFormatter";
import LocationIcon from "@/images/icons/location.svg";
import ChevronRightIcon from "@/images/icons/chevronRight.svg";

import { routes } from "@/lib/routes";

const AffiliateItems = ({ event }: { event: EventInterface }) => {
  return (
    <Link href={routes.EVENT_PROGRAM_DETAILS(event?.id)} className="block">
      <div className="group flex w-full cursor-pointer items-start justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:border-gray-200 hover:shadow-md sm:p-4">
        {/* Left: image + content */}
        <div className="flex min-w-0 gap-3">
          {/* Image */}
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-21 sm:w-21">
            <FallbackImage
              src={event?.event_image}
              fallbackSrc={images.DEFAULT_EVENT}
              alt={event?.event_name ?? "event"}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 64px, 84px"
            />
          </div>

          {/* Content */}
          <div className="flex min-w-0 flex-col">
            <p className="text-black-light text-body-s sm:text-body-s truncate font-sans leading-[1.3] font-semibold">
              {event?.event_name}
            </p>

            {/* Date + time (wraps on mobile) */}
            <div className="text-text-grey mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="inline-flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span className="text-meta sm:text-meta font-sans leading-[1.2] font-normal sm:leading-normal">
                  {formatDate(event?.start_date)}
                </span>
              </span>

              <span className="text-text-grey/60 hidden sm:inline">•</span>

              <span className="text-meta sm:text-meta font-sans leading-[1.2] font-normal sm:leading-normal">
                {formatLongTime(event?.start_date)} – {formatLongTime(event?.end_date)}
              </span>
            </div>

            {/* Location */}
            <div className="text-text-grey mt-2 flex min-w-0 items-center gap-1">
              <LocationIcon className="h-4 w-4 shrink-0" />
              <p className="text-meta sm:text-meta truncate font-sans leading-[1.2] font-normal sm:leading-normal">
                {event?.location}
              </p>
            </div>
          </div>
        </div>

        {/* Right: chevron */}
        <div className="text-text-grey/70 group-hover:text-text-grey shrink-0 pt-1 transition">
          <ChevronRightIcon className="h-5 w-5" />
        </div>
      </div>
    </Link>
  );
};

export default AffiliateItems;
