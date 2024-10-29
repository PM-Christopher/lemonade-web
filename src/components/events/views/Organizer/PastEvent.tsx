import React from 'react';
import OrganizerEventCard from "@/components/events/OrganizerEventCard";
import {EventInterface} from "@/interfaces/EventInterface";

const PastEvent = ({events, loading}: {events: EventInterface[], loading: boolean}) => {
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
                                <p>No past events</p>
                            )
                        }
                    </div>
                )
            }
        </>
    );
}

export default PastEvent;