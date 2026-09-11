import React from 'react';
import OrganizerEventCard from "@/components/events/OrganizerEventCard";
import {EventInterface} from "@/interfaces/EventInterface";
import {EventsSkeleton} from "@/components/Skeletons";

const PastEvent = ({events, loading}: {events: EventInterface[], loading: boolean}) => {
    return (
        <div className="grid grid-cols-2 laptop:grid-cols-3 mt-[10px] w-full laptop:w-[780px] p-[16px] gap-[16px] bg-white rounded-[12px]">
            <div className="grid grid-cols-2 laptop:grid-cols-3 mt-[10px] w-full laptop:w-[780px] p-[16px] gap-[16px] bg-white rounded-[12px]">
                {loading ? (
                    <EventsSkeleton count={3} />
                ) : events.length > 0 ? (
                    events.map((event, index) => (
                        <OrganizerEventCard key={index} event={event} draft={false} />
                    ))
                ) : (
                    <div className="col-span-2 laptop:col-span-3 flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                        <svg
                            className="w-12 h-12 text-gray-300 mb-3"
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
                        <p className="text-gray-600 font-medium">
                            No past events
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                            Start creating events to engage your audience.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PastEvent;