import React from 'react';
import Image from "next/image";
import event_1 from "@/image/event_images/event_1.png";
import CalendarIcon from "@/image/icons/Calendar.svg";
import DotIcon from "@/image/icons/Dot.svg";

function EventCard() {
    return (
        <div className="flex flex-col">
            <div>
                <Image src={event_1} alt="event_1" width={200}/>
            </div>
            <div className="my-2">
                <p className="font-sans font-semi-normal text-[16px] leading-[24px]">Halloween party</p>
            </div>
            <div className="flex items-center gap-1">
                <div>
                    <CalendarIcon/>
                </div>
                <div>
                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-text-grey">23 Mar</p>
                </div>
                <div>
                    <DotIcon/>
                </div>
                <div>
                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-text-grey">04 PM</p>
                </div>
            </div>
        </div>
    );
}

export default EventCard;