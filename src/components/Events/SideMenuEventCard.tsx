import React from 'react';
import Image from "next/image";
import upcoming_event from "@/image/event_images/upcoming_event.png";
import CalendarIcon from "@/image/icons/calendar.svg";
import {DotFilledIcon} from "@radix-ui/react-icons";
import LocationIcon from "@/image/icons/Location.svg";
import ChevronRightIcon from "@/image/icons/ChevronRight.svg";

const SideMenuEventCard = () => {
    return (
        <div className="p-4 flex justify-between">
            <div className="flex gap-2">
                <div>
                    <Image src={upcoming_event} alt="upcoming_event"/>
                </div>
                <div className="flex flex-col">
                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom text-black-light">Unlocking
                        business poten...</p>
                    <div className="flex mt-[8px] items-center gap-[4px]">
                        <CalendarIcon/>
                        <p className="font-sans font-semi-normal text-text-grey text-[12px] leading-[14.4px]">23 Mar</p>
                        <DotFilledIcon className="text-text-grey w-[10px]"/>
                        <p className="font-sans font-semi-normal text-text-grey text-[12px] leading-[14.4px]">04:30PM</p>
                        <p className="font-sans font-semi-normal text-text-grey text-[12px] leading-[14.4px]">-</p>
                        <p className="font-sans font-semi-normal text-text-grey text-[12px] leading-[14.4px]">05:30PM</p>
                    </div>
                    <div className="flex mt-[8px] items-center">
                        <LocationIcon/>
                        <p className="font-sans font-semi-normal text-[12px] leading-[14.4px] text-text-grey">Lekki
                            phase 1</p>
                    </div>
                </div>
            </div>
            <div>
                <ChevronRightIcon/>
            </div>
        </div>
    );
}

export default SideMenuEventCard;