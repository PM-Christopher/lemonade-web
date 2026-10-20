import React from "react";
import OrganizerEventCard from "@/components/events/OrganizerEventCard";
import { EventInterface } from "@/interfaces/EventInterface";
import { EventsSkeleton } from "@/components/Skeletons";
import { OrganizerEmpty } from "@/components/events/views/Organizer/OrganizerEmpty";

const Draft = ({ events, loading }: { events: EventInterface[]; loading: boolean }) => {
  return (
    <div className="laptop:w-195 laptop:grid-cols-3 mt-2.5 grid w-full grid-cols-2 gap-4 rounded-xl bg-white p-4">
      {loading ? (
        <EventsSkeleton count={3} />
      ) : events.length > 0 ? (
        events.map((event, index) => <OrganizerEventCard key={index} event={event} draft={true} />)
      ) : (
        <OrganizerEmpty message="You currently do not have any events in works. You can start by creating a new event." />
      )}
    </div>
  );
};

export default Draft;
