import React from 'react';
import Image from "next/image";
import organizer_image from "@/image/event_images/organizer_image.png";
import {Button} from "@/components/ui/button";

const EmptyEvent: React.FC = () => {
    return (
        <div className="flex justify-center items-center mt-[101px]">
            <div className="flex flex-col items-center">
                <Image src={organizer_image} alt="organizer image"/>
                <p className="font-sans font-semibold text-[20px] leading-[28px] mt-[24px]">List event</p>
                <p className="font-normal font-sans text-[14px] leading-[21px] tracking-custom text-center text-light-black">Your
                    event list is currently empty. List your <br/> events to see them here</p>
                <Button
                    className="mt-[24px] w-[207px] h-[48px] rounded-[12px] bg-gradient-green border-b-2 border-transparent shadow-custom-top shadow-custom-bottom">
                    <p className="font-semi-normal font-sans text-[16px] leading-[19.2px]">Add event</p>
                </Button>
            </div>
        </div>
    );
}

export default EmptyEvent;