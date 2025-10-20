import React from 'react';
import Image from "next/image";
import ChevronRight from "@/images/icons/chevronRight.svg";
import {getDistanceFromLatLonInKm} from "@/lib/helper";

type RequestInterface = {
    toggle: () => void,
    invite: any,
    toggleInviteIndex: (index: number) => void,
    index: number,
    user: any
}

const RequestCard: React.FC<RequestInterface> = ({toggle, invite, toggleInviteIndex, index, user}) => {
    return (
        <>
            <div
                className="flex justify-between items-center p-4 border-b border-mid-grey mb-8 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
                onClick={() => {
                    toggle();
                    toggleInviteIndex(index);
                }}
            >
                {/* Left section: Avatar + Info */}
                <div className="flex gap-3 items-center">
                    {/* Avatar with lemon image and ID */}
                    <div className="relative w-[44px] h-[44px] flex items-center justify-center rounded-full overflow-hidden bg-gray-100">
                        <Image
                            src="/images/lemon.png"
                            alt="lemon"
                            fill
                            className="object-contain"
                        />
                        <p className="absolute inset-0 flex items-center justify-center text-black text-[12px] font-semibold">
                            {invite?.invitee.lemon_id_short}
                        </p>
                    </div>

                    {/* Text Info */}
                    <div className="flex flex-col">
                        <p className="text-[14px] font-semibold text-gray-900">
                            {invite?.invitee?.lemon_id_full}{" "}
                            <span className="font-normal text-gray-600">wants to connect with you</span>
                        </p>

                        <div className="flex items-center gap-2 mt-1 text-[12px] text-gray-500">
                            <p className="whitespace-nowrap">
                                {getDistanceFromLatLonInKm(
                                    user?.connect_info?.latitude,
                                    user?.connect_info?.longitude,
                                    invite?.location?.latitude,
                                    invite?.location?.longitude
                                )}{" "}
                                km away
                            </p>
                            <span className="text-gray-300">|</span>
                            <p className="truncate max-w-[180px] laptop:max-w-full">
                                {invite?.message}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right section: Chevron */}
                <div
                    className="p-2 rounded-full hover:bg-gray-200 transition-all"
                    onClick={(e) => {
                        e.stopPropagation(); // prevent triggering parent onClick
                        toggle();
                    }}
                >
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
            </div>
        </>
    );
}

export default RequestCard;