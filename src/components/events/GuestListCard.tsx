import React from 'react';
import ChevronRightIcon from "@/images/icons/chevronRight.svg";
import Link from "next/link";
import {GuestListCardProps} from "@/interfaces/EventInterface";
import { formatStringUCFirst} from "@/lib/helper";

type SideMenuInterface = {
    toggleMenu: () => void,
    isOpen: boolean,
    setSelectedGuest: (guest: any) => void;
}


const GuestListCard = ( { guest, data }: { guest: GuestListCardProps, data: SideMenuInterface} ) => {
    const handleSelectGuest = () => {
        data.setSelectedGuest(guest)
    }

    return (
        <div className="px-[24px] cursor-pointer" onClick={handleSelectGuest}>
            <div className="flex justify-between border-b-2 border-b-grey-20 pb-[16px] items-center">
                <div className="flex flex-col gap-[2px]">
                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom text-black-light">
                        {guest?.name}
                    </p>
                    <p className="font-normal text-[12px] text-text-grey">
                        {formatStringUCFirst(guest?.type)}
                    </p>
                </div>
                <ChevronRightIcon />
            </div>
        </div>
    );
};

export default GuestListCard;