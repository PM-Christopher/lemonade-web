import { FallbackImage } from "@/components/global/FallbackImage";
import { images } from "@/lib/images";
import { routes } from "@/lib/routes";
import React from "react";
import CalendarIcon from "@/images/icons/calendar-large.svg";
import ClockIcon from "@/images/icons/clock.svg";
import LocationIcon from "@/images/icons/location-large.svg";
import ChevronRight from "@/images/icons/chevronRight.svg";
import OrganizerEventCard from "@/components/events/OrganizerEventCard";
import Link from "next/link";
import { EventInterface } from "@/interfaces/EventInterface";
import { formatLongDate, formatLongTime } from "@/lib/dateTimeFormatter";

import { EventsSkeleton } from "@/components/Skeletons";
import { OrganizerEmpty } from "@/components/events/views/Organizer/OrganizerEmpty";

const Upcoming = ({ events, loading }: { events: EventInterface[]; loading: boolean }) => {
  return (
    <>
      {events?.length > 0 && (
        <div className="laptop:w-195 laptop:flex-row laptop:pr-20 flex w-full flex-col gap-6 rounded-2xl bg-white pr-0">
          <div className="laptop:shrink-0 relative">
            <span className="bg-green-tint text-light-green-70 text-meta absolute top-0 left-0 z-10 rounded-tl-2xl rounded-br-xl px-3 py-1 font-sans font-semibold">
              Next event
            </span>
            <FallbackImage
              src={events[0]?.event_image}
              fallbackSrc={images.DEFAULT_EVENT}
              alt="poster"
              width={320}
              height={343}
              className="laptop:h-full laptop:w-80 h-56 w-full rounded-2xl object-cover"
            />
          </div>
          <div className="laptop:mt-6 mt-3 flex flex-col px-2.5 pb-2.5">
            <p className="text-title-l font-sans font-semibold">{events[0]?.event_name}</p>
            <div className="mt-4 flex items-center gap-2">
              <CalendarIcon />
              <p className="font-semi-normal tracking-custom text-text-grey text-body-l font-sans">
                {formatLongDate(events[0]?.start_date, "mid")}
              </p>
              <p>-</p>
              <p className="font-semi-normal tracking-custom text-text-grey text-body-l font-sans">
                {formatLongDate(events[0]?.end_date, "mid")}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <ClockIcon />
              <p className="font-semi-normal text-text-grey text-body-l font-sans">
                {formatLongTime(events[0]?.start_date)}
              </p>
              <p>-</p>
              <p className="font-semi-normal text-text-grey text-body-l font-sans">
                {formatLongTime(events[0]?.end_date)}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <LocationIcon />
              <p className="font-semi-normal text-text-grey text-body-l font-sans">
                {events[0]?.location}
              </p>
            </div>
            <Link href={routes.EVENT_DETAILS(events[0]?.id)} className="w-fit">
              <div className="mt-10 flex w-fit items-center gap-2">
                <p className="font-semi-normal text-light-green text-body-l font-sans">
                  View details
                </p>
                <ChevronRight className="text-light-green" />
              </div>
            </Link>
          </div>
        </div>
      )}
      <div className="laptop:w-195 laptop:grid-cols-3 mt-2.5 grid w-full grid-cols-2 gap-4 rounded-xl bg-white p-4">
        {loading ? (
          <EventsSkeleton count={3} />
        ) : events?.length > 0 ? (
          events?.map((event, index) => (
            <OrganizerEventCard key={index} event={event} draft={false} />
          ))
        ) : (
          <OrganizerEmpty message="Your event list is currently empty. List your events to see them here." />
        )}
      </div>
    </>
  );
};

export default Upcoming;
