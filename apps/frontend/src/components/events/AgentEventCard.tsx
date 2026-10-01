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
  amount?: number;
  commission: number;
}) => {
  return (
    <div className="mb-6 flex flex-col">
      <Image
        src={image || "/images/event_images/agent_image.png"}
        alt="agent-image"
        width={164}
        height={164}
        className="h-[164px] w-[164px] rounded-xl"
      />
      <p className="mt-2 font-sans text-[14px] font-semibold">{name}</p>
      <p className="bg-light-green-10 text-light-tint-2 mt-1 w-fit rounded-[8px] p-1 font-sans text-[14px] font-normal">
        {commission}%
      </p>
      <div className="mt-1 flex items-center gap-2">
        <TicketIcon />
        <p className="text-text-grey text-[14px] font-normal">
          From <span className="text-black-light font-semibold">N{amount} </span>
        </p>
      </div>
    </div>
  );
};

export default AgentEventCard;
