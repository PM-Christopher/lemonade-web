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
        className="border-light-grey-50 flex h-9 cursor-pointer items-center gap-2 rounded-xl border p-2 px-3.5"
        onClick={toggle}
      >
        <GearIcon />
        <p className="font-semi-normal text-black-light font-sans text-[16px]">Payment setting</p>
      </div>
      <Button
        className="border-step-color bg-gradient-green shadow-green-inset hover:shadow-green-inset-strong h-10 w-[156px] rounded-xl border"
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
