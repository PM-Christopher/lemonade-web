import React from "react";
import Image from "next/image";
import TicketIcon from "@/images/icons/ticketGreyIcon.svg";

const AgentEventCard = ({
  image,
  name,
  amount,
  commission,
}: {
  image?: string;
  name?: string;
  amount?: any;
  commission: string;
}) => {
  return (
    <div className="mb-[24px] flex flex-col">
      <Image
        src={image || "/images/event_images/agent_image.png"}
        alt="agent-image"
        width={164}
        height={164}
        className="h-[164px] w-[164px] rounded-[12px]"
      />
      <p className="mt-[8px] font-sans text-[14px] font-semibold">{name}</p>
      <p className="mt-[4px] w-fit rounded-[8px] bg-light-green-10 p-[4px] font-sans text-[14px] font-normal text-light-tint-2">
        {commission}%
      </p>
      <div className="mt-[4px] flex items-center gap-2">
        <TicketIcon />
        <p className="text-[14px] font-normal text-text-grey">
          From <span className="font-semibold text-black-light">N{amount} </span>
        </p>
      </div>
    </div>
  );
};

export default AgentEventCard;
