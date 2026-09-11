import React from 'react';
import Image from "next/image";
import TicketIcon from "@/images/icons/ticketGreyIcon.svg";

const AgentEventCard = ({image, name, amount, commission}:{image?: string, name?:string, amount?: any, commission: string}) => {
    return (
        <div className="flex flex-col mb-[24px]">
            <Image src={ image ||"/images/event_images/agent_image.png"} alt="agent-image" width={164} height={164} className="w-[164px] h-[164px] rounded-[12px]"/>
            <p className="font-sans font-semibold text-[14px] mt-[8px]">{name}</p>
            <p className="font-sans font-normal p-[4px] text-[14px] text-light-tint-2 bg-light-green-10 w-fit rounded-[8px] mt-[4px]">{commission}%</p>
            <div className="flex items-center gap-2 mt-[4px]">
                <TicketIcon/>
                <p className="text-[14px] font-normal text-text-grey">From <span
                    className="font-semibold text-black-light">N{amount} </span></p>
            </div>
        </div>
    );
}

export default AgentEventCard;