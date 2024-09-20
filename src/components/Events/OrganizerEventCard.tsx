import React from 'react';
import Image from "next/image";
import event_1 from "@/image/event_images/event_image_lg.png";
import CalendarIcon from "@/image/icons/calendar.svg";
import DotIcon from "@/image/icons/divider.svg";
import More from "@/image/icons/MoreIcon.svg";

type OrganizerEventInterface = {
    draft: boolean
}
const OrganizerEventCard: React.FC<OrganizerEventInterface> = ({draft}) => {
    return (
        <div className="bg-white rounded-[12px] mb-[16px] border-[1px] border-grey-20 p-[4px]">
            <div className="flex flex-col">
                <div className="relative">
                    <Image src={event_1} alt="event_1" className="rounded-[8px]"/>
                    {
                        draft && (
                            <div
                                className="absolute top-0 right-0 bg-warning p-[4px] px-[8px] rounded-tl-[0px] rounded-bl-[8px] rounded-tr-[8px] rounded-br-[8px]">
                                <p className="text-[14px] leading-[16.8px] font-sans font-semibold text-warning-bold text-center">Draft</p>
                            </div>
                        )
                    }
                </div>
                <div className="flex justify-between mt-2 px-2">
                    <div className="">
                        <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">Halloween
                            party</p>
                        <div className="flex items-center gap-1 my-2">
                            <CalendarIcon/>
                            <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Mon, 23
                                Mar</p>
                            <DotIcon className="w-[3px]"/>
                            <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">4PM</p>
                        </div>
                    </div>
                    <div>
                        <More/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrganizerEventCard;