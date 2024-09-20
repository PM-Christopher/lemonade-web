import React from 'react';
import Image from "next/image";
import event_1 from "@/image/event_images/event_image_lg.png";
import CalendarIcon from "@/image/icons/calendar.svg";
import DotIcon from "@/image/icons/Dot.svg";
import LocationIcon from "@/image/icons/Location.svg";

const EventCard: React.FC = () => {
    return (
        <div className="bg-white flex flex-col w-[316px] rounded-[12px] mb-[16px]">
            <Image src={event_1} alt="event_1" width={316}/>
            <div className="p-2">
                <p className="my-2 font-sans font-semibold text-[18px] leading-[27px] tracking-custom">Halloween
                    party</p>
                <div className="flex items-center gap-1 my-2">
                    <CalendarIcon/>
                    <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">23
                        Mar</p>
                    <DotIcon/>
                    <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">4:30PM</p>
                </div>
                <div className="flex items-center gap-1 my-2">
                    <LocationIcon/>
                    <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Lekki phase 1</p>
                </div>
            </div>
        </div>
    );
}

export default EventCard;