import React from 'react';
import OrganizerEventCard from "@/components/Events/OrganizerEventCard";
import {EventInterface} from "@/interfaces/EventInterface";

const Draft = ({events, loading}: {events: EventInterface[], loading: boolean}) => {
    return (
        <>
            {
                !loading && (
                    <div className="grid grid-cols-3 mt-[10px] w-[780px] p-[16px] gap-[16px] bg-white rounded-[12px]">
                        {
                            events.length > 0 ? (
                                events.map((event, index) => (
                                    <OrganizerEventCard event={event} draft={false}/>
                                ))
                            ) : (
                                <p>No events in draft</p>
                            )
                        }
                    </div>
                )
            }
        </>
    );
}

export default Draft;