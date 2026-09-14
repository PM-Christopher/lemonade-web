"use client";
import React from "react";
import GearIcon from "@/images/icons/gear.svg";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type OrganizerSubMenuInterface = {
  toggle: () => void;
};

const OrganizerSubMenu: React.FC<OrganizerSubMenuInterface> = ({ toggle }) => {
  const router = useRouter();
  return (
    <div className="hidden items-center gap-4 laptop:flex">
      <div
        className="flex h-[36px] cursor-pointer items-center gap-2 rounded-[12px] border-[1px] border-light-grey-50 p-[8px] px-[14px]"
        onClick={toggle}
      >
        <GearIcon />
        <p className="font-sans text-[16px] font-semi-normal text-black-light">Payment setting</p>
      </div>
      <Button
        className="h-[40px] w-[156px] rounded-[12px] border-[1px] border-step-color bg-gradient-green shadow-green-inset hover:shadow-green-inset-strong"
        onClick={() => router.push("/event/create-event")}
      >
        <div className="flex items-center gap-2">
          <PlusIcon />
          <p className="font-sans text-[16px] font-semi-normal text-white">Add Event</p>
        </div>
      </Button>
    </div>
  );
};

export default OrganizerSubMenu;
