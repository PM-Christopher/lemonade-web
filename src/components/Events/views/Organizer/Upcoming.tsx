import React from 'react';
import Image from "next/image";
import poster from "@/image/event_images/vertical_image2.png";
import CalendarIcon from "@/image/icons/calendar-large.svg";
import ClockIcon from "@/image/icons/clock.svg";
import LocationIcon from "@/image/icons/location-large.svg";
import ChevronRight from "@/image/icons/ChevronRight.svg";
import OrganizerEventCard from "@/components/Events/OrganizerEventCard";

const Upcoming: React.FC = () => {
    return (
        <>
            <div className="flex bg-white p-2 gap-[24px] rounded-[16px] pr-[80px]">
                <Image src={poster} alt="poster"/>
                <div className="flex flex-col mt-[24px]">
                    <p className="font-sans font-semibold text-[24px] leading-[33.6px]">Unlocking business
                        potentials</p>
                    <div className="flex items-center gap-2 mt-[16px]">
                        <CalendarIcon/>
                        <p className="font-sans font-semi-normal text-[16px] leading-[24px] tracking-custom text-text-grey">Mon,
                            23
                            Mar</p>
                        <p>-</p>
                        <p className="font-sans font-semi-normal text-[16px] leading-[24px] tracking-custom text-text-grey">Mon,
                            23
                            Mar</p>
                    </div>
                    <div className="flex items-center gap-2 mt-[16px]">
                        <ClockIcon/>
                        <p className="font-sans font-semi-normal text-[16px] leading-[24px] text-text-grey">04:00PM</p>
                        <p>-</p>
                        <p className="font-sans font-semi-normal text-[16px] leading-[24px] text-text-grey">11:00PM</p>
                    </div>
                    <div className="flex items-center gap-2 mt-[16px]">
                        <LocationIcon/>
                        <p className="font-sans font-semi-normal text-[16px] leading-[24px] text-text-grey">Lekki
                            phase 1</p>
                    </div>
                    <div className="flex items-center gap-2 mt-[40px]">
                        <p className="font-sans font-semi-normal text-[16px] leading-[24px] text-light-green">View
                            Details</p>
                        <ChevronRight className="text-light-green"/>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 mt-[10px] w-[780px] p-[16px] gap-[16px] bg-white rounded-[12px]">
                <OrganizerEventCard draft={false} />
                <OrganizerEventCard draft={false} />
                <OrganizerEventCard draft={false} />
                <OrganizerEventCard draft={false} />
                <OrganizerEventCard draft={false} />
                <OrganizerEventCard draft={false} />
            </div>
        </>
    );
}

export default Upcoming;