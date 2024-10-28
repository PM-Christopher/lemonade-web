import React from 'react';
import SearchIcon from "@/image/icons/search.svg";
import AgentImage from "@/image/event_images/agent_image.png"
import Image from "next/image";
import TicketIcon from "@/image/icons/TicketGreyIcon.svg"
import AgentEventCard from "@/components/Events/AgentEventCard";
import Link from "next/link";

function FindEventSubMenu({}) {
    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-full">
                <div>
                    <SearchIcon/>
                </div>
                <div>
                    <input
                        id="search"
                        type="text"
                        className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                        placeholder="Search events..."
                    />
                </div>
            </div>
            <div className="grid grid-cols-3 mt-[24px]">
                <Link href={"/event/5/agent-details"}>
                    <AgentEventCard />
                </Link>
                <AgentEventCard />
                <AgentEventCard />
                <AgentEventCard />
                <AgentEventCard />
            </div>
        </div>
    );
}

export default FindEventSubMenu;