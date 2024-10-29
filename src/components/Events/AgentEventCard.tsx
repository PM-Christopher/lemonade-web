import React from 'react';
import Image from "next/image";
import TicketIcon from "@/images/icons/ticketGreyIcon.svg";

const AgentEventCard = () => {
    return (
        <div className="flex flex-col mb-[24px]">
            <Image src={"/images/event_images/agent_image.png"} alt="agent-image" width={164} height={164}/>
            <p className="font-sans font-semibold text-[14px] mt-[8px]">Halloween party</p>
            <p className="font-sans font-normal p-[4px] text-[14px] text-light-tint-2 bg-light-green-10 w-fit rounded-[8px] mt-[4px]">0.01%</p>
            <div className="flex items-center gap-2 mt-[4px]">
                <TicketIcon/>
                <p className="text-[14px] font-normal text-text-grey">From <span
                    className="font-semibold text-black-light">N1,100</span></p>
            </div>
        </div>
    );
}

export default AgentEventCard;