import React from "react";
import Image from "next/image";
import CalendarIcon from "@/images/icons/calendar-large.svg";
import ClockIcon from "@/images/icons/clock.svg";
import LocationIcon from "@/images/icons/location-large.svg";
import ChevronRight from "@/images/icons/chevronRight.svg";
import OrganizerEventCard from "@/components/events/OrganizerEventCard";
import Link from "next/link";
import { EventInterface } from "@/interfaces/EventInterface";
import { formatLongDate, formatLongTime } from "@/lib/dateTimeFormatter";
import EditIcon from "@/images/icons/edit.svg";
import { useMediaQuery } from "react-responsive";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { EventsSkeleton } from "@/components/Skeletons";
import { getSafeImageSrc } from "@/lib/helper";

const Upcoming = ({ events, loading }: { events: EventInterface[]; loading: boolean }) => {
  const router = useRouter();
  return (
    <>
      {events?.length > 0 && (
        <div className="laptop:w-[780px] laptop:flex-row laptop:pr-20 flex w-full flex-col gap-6 rounded-2xl bg-white pr-0">
          <Image
            src={getSafeImageSrc(events[0]?.event_image, "/images/default-event.jpg")}
            alt="poster"
            width={320}
            height={343}
            className="w-80"
          />
          <div className="laptop:mt-6 mt-3 flex flex-col px-2.5 pb-2.5">
            <p className="font-sans text-[24px] leading-[33.6px] font-semibold">
              {events[0]?.event_name}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <CalendarIcon />
              <p className="font-semi-normal tracking-custom text-text-grey font-sans text-[16px] leading-[24px]">
                {formatLongDate(events[0]?.start_date, "mid")}
              </p>
              <p>-</p>
              <p className="font-semi-normal tracking-custom text-text-grey font-sans text-[16px] leading-[24px]">
                {formatLongDate(events[0]?.end_date, "mid")}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <ClockIcon />
              <p className="font-semi-normal text-text-grey font-sans text-[16px] leading-[24px]">
                {formatLongTime(events[0]?.start_date)}
              </p>
              <p>-</p>
              <p className="font-semi-normal text-text-grey font-sans text-[16px] leading-[24px]">
                {formatLongTime(events[0]?.end_date)}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <LocationIcon />
              <p className="font-semi-normal text-text-grey font-sans text-[16px] leading-[24px]">
                {events[0]?.location}
              </p>
            </div>
            <Link href={`/event/${events[0]?.id}/details`} className="w-fit">
              <div className="mt-10 flex w-fit items-center gap-2">
                <p className="font-semi-normal text-light-green font-sans text-[16px] leading-[24px]">
                  View Details
                </p>
                <ChevronRight className="text-light-green" />
              </div>
            </Link>
          </div>
        </div>
      )}
      <div className="laptop:w-[780px] laptop:grid-cols-3 mt-2.5 grid w-full grid-cols-2 gap-4 rounded-xl bg-white p-4">
        {loading ? (
          <EventsSkeleton count={3} />
        ) : events?.length > 0 ? (
          events?.map((event, index) => (
            <OrganizerEventCard key={index} event={event} draft={false} />
          ))
        ) : (
          <div className="laptop:col-span-3 col-span-2 flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-12">
            <svg
              className="mb-3 h-12 w-12 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 1.343-3 3 0 1.306.835 2.418 2 2.83V17h2v-3.17c1.165-.412 2-1.524 2-2.83 0-1.657-1.343-3-3-3z"
              />
            </svg>
            <p className="font-medium text-gray-600">No upcoming events</p>
            <p className="mt-1 text-sm text-gray-400">
              Start creating events to engage your audience.
            </p>
            <button
              onClick={() => router.push("/event/create-event")}
              className="bg-gradient-green shadow-green-inset hover:shadow-green-inset-strong mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white transition"
            >
              Add Event
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Upcoming;
