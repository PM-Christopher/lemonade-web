"use client";
import React from "react";
import GearIcon from "@/images/icons/gear.svg";
import { PlusIcon } from "lucide-react";
import { Button } from "@lemonade/ui";
import { useRouter } from "next/navigation";

type OrganizerSubMenuInterface = {
  toggle: () => void;
};

const OrganizerSubMenu: React.FC<OrganizerSubMenuInterface> = ({ toggle }) => {
  const router = useRouter();
  return (
    <div className="laptop:flex hidden items-center gap-4">
      <div
        className="border-light-grey-50 flex h-[36px] cursor-pointer items-center gap-2 rounded-[12px] border-[1px] p-[8px] px-[14px]"
        onClick={toggle}
      >
        <GearIcon />
        <p className="font-semi-normal text-black-light font-sans text-[16px]">Payment setting</p>
      </div>
      <Button
        className="border-step-color bg-gradient-green shadow-green-inset hover:shadow-green-inset-strong h-[40px] w-[156px] rounded-[12px] border-[1px]"
        onClick={() => router.push("/event/create-event")}
      >
        <div className="flex items-center gap-2">
          <PlusIcon />
          <p className="font-semi-normal font-sans text-[16px] text-white">Add Event</p>
        </div>
      </Button>
    </div>
  );
};

export default OrganizerSubMenu;
