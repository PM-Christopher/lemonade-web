"use client"
import React from 'react';
import GearIcon from "@/images/icons/gear.svg";
import { PlusIcon } from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

type OrganizerSubMenuInterface = {
    toggle: () => void
}

const OrganizerSubMenu: React.FC<OrganizerSubMenuInterface> = ({toggle}) => {
    const router = useRouter()
    return (
        <div className="hidden laptop:flex gap-4 items-center">
            <div className="border-[1px] p-[8px] px-[14px] gap-2 flex items-center border-light-grey-50 rounded-[12px] cursor-pointer h-[36px]" onClick={toggle}>
                <GearIcon/>
                <p className="font-sans font-semi-normal text-[16px] text-black-light">Payment setting</p>
            </div>
            <Button className="bg-gradient-green w-[156px] h-[40px] rounded-[12px] border-[1px] border-step-color shadow-green-inset hover:shadow-green-inset-strong" onClick={() => router.push("/event/create-event")}>
                <div className="flex items-center gap-2">
                    <PlusIcon />
                    <p className="font-sans font-semi-normal text-[16px] text-white">Add Event</p>
                </div>
            </Button>
        </div>
    );
}

export default OrganizerSubMenu;