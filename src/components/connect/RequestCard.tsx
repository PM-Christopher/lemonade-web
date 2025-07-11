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
            <div className="flex justify-between pb-[16px] border-b-[1px] border-b-mid-grey mb-[32px] cursor-pointer" onClick={() => {
                toggle()
                toggleInviteIndex(index)
            }}>
                <div className="flex gap-2">
                    <div className="relative flex items-center justify-center">
                        <Image src={'/images/lemon.png'} alt="lemon" width={33} height={41}/>
                        <p className="absolute text-black text-[12px] font-semibold text-center">
                            {invite?.invitee.lemon_id_short}
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-[14px] font-semibold">{invite?.invitee?.lemon_id_full} <span
                            className="font-normal">wants to connect with you</span>
                        </p>
                        <div className="flex items-center gap-[8px]">
                            <p className="font-normal text-[12px] text-text-grey">
                                {getDistanceFromLatLonInKm(user?.connect_info?.latitude, user?.connect_info?.longitude, invite?.location?.latitude, invite?.location?.longitude)}
                                km away
                            </p>
                            <p className="text-grey-80">|</p>
                            <p className="font-normal text-[12px] text-light-black truncate w-[195px] laptop:w-full">{invite?.message}</p>
                        </div>
                    </div>
                </div>
                <ChevronRight onClick={toggle} />
            </div>
        </>
    );
}

export default RequestCard;