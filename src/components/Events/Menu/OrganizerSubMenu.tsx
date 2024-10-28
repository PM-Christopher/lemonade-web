"use client"
import React from 'react';
import GearIcon from "@/image/icons/gear.svg";
import PlusIcon from "@/image/icons/Plus.svg";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

type OrganizerSubMenuInterface = {
    toggle: () => void
}

const OrganizerSubMenu: React.FC<OrganizerSubMenuInterface> = ({toggle}) => {
    const router = useRouter()
    return (
        <div className="flex gap-4 items-center">
            <div className="border-[1px] p-[8px] px-[14px] gap-2 flex items-center border-light-grey-50 rounded-[12px] cursor-pointer h-[36px]" onClick={toggle}>
                <GearIcon/>
                <p className="font-sans font-semi-normal text-[16px] text-black-light">Payment setting</p>
            </div>
            <Button className="bg-gradient-green p-[10px] px-[24px] rounded-[12px] shadow-custom-bottom border-[1px] border-step-color" onClick={() => router.push("/event/create-event")}>
                <div className="flex items-center gap-2">
                    <PlusIcon className="" />
                    <p className="font-sans font-semi-normal text-[16px]">Add Event</p>
                </div>
            </Button>
        </div>
    );
}

export default OrganizerSubMenu;