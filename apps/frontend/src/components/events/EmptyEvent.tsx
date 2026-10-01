import React from "react";
import Image from "next/image";
import organizer_image from "@/image/event_images/organizer_image.png";
import { Button } from "@lemonade/ui";

const EmptyEvent: React.FC = () => {
  return (
    <div className="mt-[101px] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Image src={organizer_image} alt="organizer image" />
        <p className="mt-6 font-sans text-[20px] leading-[28px] font-semibold">List event</p>
        <p className="tracking-custom text-light-black text-center font-sans text-[14px] leading-[21px] font-normal">
          Your event list is currently empty. List your <br /> events to see them here
        </p>
        <Button className="bg-gradient-green shadow-custom-bottom shadow-custom-top mt-6 h-12 w-[207px] rounded-xl border-b-2 border-transparent">
          <p className="font-semi-normal font-sans text-[16px] leading-[19.2px]">Add event</p>
        </Button>
      </div>
    </div>
  );
};

export default EmptyEvent;
