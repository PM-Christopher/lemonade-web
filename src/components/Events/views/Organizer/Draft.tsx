import React from 'react';
import OrganizerEventCard from "@/components/Events/OrganizerEventCard";

const Draft: React.FC = () => {
    return (
        <div className="grid grid-cols-3 mt-[10px] w-[780px] p-[16px] gap-[16px] bg-white rounded-[12px]">
            <OrganizerEventCard draft={true} />
            <OrganizerEventCard draft={true} />
            <OrganizerEventCard draft={true} />
            <OrganizerEventCard draft={true} />
            <OrganizerEventCard draft={true} />
            <OrganizerEventCard draft={true} />
        </div>
    );
}

export default Draft;