import { images } from "@/lib/images";
import { FallbackImage } from "@/components/global/FallbackImage";
import React from "react";
import TicketIcon from "@/images/icons/ticketGreyIcon.svg";
import { formatNumberWithCommas } from "@/lib/formatNumber";

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
      <FallbackImage
        src={image}
        fallbackSrc={images.AGENT_EVENT}
        alt="agent-image"
        width={164}
        height={164}
        className="aspect-square h-auto w-full rounded-xl object-cover"
      />
      <p className="text-body-s mt-2 font-sans font-semibold">{name}</p>
      <p className="bg-light-green-10 text-light-tint-2 text-body-s mt-1 w-fit rounded-lg p-1 font-sans font-normal">
        {Number(commission.toFixed(2))}%
      </p>
      <div className="mt-1 flex items-center gap-2">
        <TicketIcon />
        <p className="text-text-grey text-body-s font-normal">
          From{" "}
          <span className="text-black-light font-semibold">₦{formatNumberWithCommas(amount)}</span>
        </p>
      </div>
    </div>
  );
};

export default AgentEventCard;
