import React from "react";
import Image from "next/image";
import organizer_image from "@/image/event_images/organizer_image.png";
import { Button } from "@lemonade/ui";

const EmptyEvent: React.FC = () => {
  return (
    <div className="mt-[101px] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Image src={organizer_image} alt="organizer image" />
        <p className="mt-[24px] font-sans text-[20px] font-semibold leading-[28px]">List event</p>
        <p className="text-center font-sans text-[14px] font-normal leading-[21px] tracking-custom text-light-black">
          Your event list is currently empty. List your <br /> events to see them here
        </p>
        <Button className="mt-[24px] h-[48px] w-[207px] rounded-[12px] border-b-2 border-transparent bg-gradient-green shadow-custom-bottom shadow-custom-top">
          <p className="font-sans text-[16px] font-semi-normal leading-[19.2px]">Add event</p>
        </Button>
      </div>
    </div>
  );
};

export default EmptyEvent;
