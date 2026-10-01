import React from "react";
import OrganizerEventCard from "@/components/events/OrganizerEventCard";
import { EventInterface } from "@/interfaces/EventInterface";
import { EventsSkeleton } from "@/components/Skeletons";

const Draft = ({ events, loading }: { events: EventInterface[]; loading: boolean }) => {
  return (
    <div className="laptop:w-[780px] laptop:grid-cols-3 mt-2.5 grid w-full grid-cols-2 gap-4 rounded-xl bg-white p-4">
      {loading ? (
        <EventsSkeleton count={3} />
      ) : events.length > 0 ? (
        events.map((event, index) => <OrganizerEventCard key={index} event={event} draft={true} />)
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
          <p className="font-medium text-gray-600">No events in draft</p>
          <p className="mt-1 text-sm text-gray-400">
            Start creating events to engage your audience.
          </p>
        </div>
      )}
    </div>
  );
};

export default Draft;
