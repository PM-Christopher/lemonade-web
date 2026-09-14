import React from "react";
import Image from "next/image";
import { DotIcon } from "lucide-react";

const TribeDetails = () => {
  return (
    <div className="flex h-fit w-full flex-col gap-6">
      <h3 className="mb-3 text-lg font-semibold">Tribe details</h3>
      {/* Tribe Details Card */}
      <div className="w-[430px] rounded-lg bg-white p-4">
        <div className="mb-4 flex flex-col items-center gap-2">
          <Image src="/images/tribe_1.png" alt="Tribe" width={96} height={96} className="rounded" />
          <p className="text-center text-[16px] font-semiBold">Start-ups</p>
          <p className={"text-[14px] font-medium text-text-grey"}>Business</p>
          <div className={"flex items-center"}>
            <p className={"text-[12px] font-normal text-text-grey"}>3 members</p>
            <DotIcon className={"text-text-grey"} />
            <p className={"text-[12px] font-normal text-text-grey"}>1 thread</p>
          </div>
          <div className={"w-[311px]"}>
            <p className="text-center text-[14px] font-normal text-light-black">
              Share your start-up experiences to teach others on what to do.
            </p>
          </div>
          <p className="text-center text-[12px] font-normal text-text-grey">
            Created on 23 Mar, 2024
          </p>
        </div>
      </div>

      {/* Private Tribe + Members Card */}
      <div className="">
        <div className="mb-4 flex items-center justify-between">
          <div className={"flex flex-col"}>
            <p className="text-[16px] font-medium">Private Tribe</p>
            <p className="text-[12px] font-normal text-text-grey">
              Available to only added members
            </p>
          </div>
        </div>
        <div className={"flex flex-col gap-[8px] rounded-[12px] bg-light-grey px-[24px] py-[16px]"}>
          <p className={"text-[14px] font-medium text-text-grey"}>Members</p>
          <div className={"flex justify-between border-b-[1px] border-b-grey-20 py-[10px]"}>
            <div className={"flex items-center gap-2"}>
              <Image src={"/images/tribe_1.png"} alt={"image"} width={20} height={20} />
              <p className={"text-[14px] font-medium"}>Samjoe</p>
            </div>
            <p className={"text-[14px] font-medium italic text-text-grey"}>Creator</p>
          </div>
          <div className={"flex justify-between border-b-[1px] border-b-grey-20 py-[10px]"}>
            <div className={"flex items-center gap-2"}>
              <Image src={"/images/tribe_1.png"} alt={"image"} width={20} height={20} />
              <p className={"text-[14px] font-medium"}>Christojoe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TribeDetails;
