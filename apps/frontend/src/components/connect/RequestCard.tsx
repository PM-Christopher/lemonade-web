import { images } from "@/lib/images";
import React from "react";
import Image from "next/image";
import ChevronRight from "@/images/icons/chevronRight.svg";
import { formatDistanceAway } from "@/lib/helper";
import type { ChatInvite } from "@/features/connect/api";

type RequestInterface = {
  toggle: () => void;
  invite: ChatInvite;
  toggleInviteIndex: (index: number) => void;
  index: number;
};

const RequestCard: React.FC<RequestInterface> = ({ toggle, invite, toggleInviteIndex, index }) => {
  const distance = formatDistanceAway(invite?.distance_km);

  return (
    <>
      <div
        className="border-mid-grey mb-8 flex cursor-pointer items-center justify-between rounded-lg border-b p-4 transition-all duration-200 hover:bg-gray-50"
        onClick={() => {
          toggle();
          toggleInviteIndex(index);
        }}
      >
        {/* Left section: Avatar + Info */}
        <div className="flex items-center gap-3">
          {/* Avatar with lemon image and ID */}
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gray-100">
            <Image src={images.LEMON} alt="lemon" fill className="object-contain" />
            <p className="text-meta absolute inset-0 flex items-center justify-center leading-normal font-semibold text-black">
              {invite?.invitee?.lemon_id_short}
            </p>
          </div>

          {/* Text Info */}
          <div className="flex flex-col">
            <p className="text-body-s font-semibold text-gray-900">
              {invite?.invitee?.lemon_id_full}{" "}
              <span className="font-normal text-gray-600">wants to connect with you</span>
            </p>

            <div className="text-meta mt-1 flex items-center gap-2 leading-normal text-gray-500">
              {distance && (
                <>
                  <p className="whitespace-nowrap">{distance}</p>
                  <span className="text-gray-300">|</span>
                </>
              )}
              <p className="laptop:max-w-full max-w-45 truncate">{invite?.message}</p>
            </div>
          </div>
        </div>

        {/* Right section: Chevron */}
        <div
          className="rounded-full p-2 transition-all hover:bg-gray-200"
          onClick={(e) => {
            e.stopPropagation(); // prevent triggering parent onClick
            toggle();
          }}
        >
          <ChevronRight className="h-4 w-4 text-gray-500" />
        </div>
      </div>
    </>
  );
};

export default RequestCard;
