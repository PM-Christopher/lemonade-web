import React from "react";
import { CalendarIcon, ChevronDown, Dot } from "lucide-react";
import Image from "next/image";
import type { AccountInfoResponse } from "@/features/user/api";

interface EventViewProps {
  userDetail: AccountInfoResponse | undefined;
}

const EventView: React.FC<EventViewProps> = ({ userDetail }) => {
  return (
    <div className="flex flex-col gap-[24px]">
      <div className={"p-[16px] px-[24px] pt-[24px]"}>
        <div
          className={
            "border-grey-20 bg-light-grey flex h-[40px] items-center justify-between rounded-[12px] border-[1px] px-[16px] py-[10px]"
          }
        >
          <div className={"flex items-center justify-between"}>
            <div className={"text-text-grey flex items-center gap-[8px]"}>
              <CalendarIcon className={"w-[15px]"} />
              <p className={"font-semiBold text-text-grey text-[12px]"}>ALL EVENTS</p>
            </div>
          </div>
          <ChevronDown className={"text-text-grey w-[20px]"} />
        </div>
      </div>
      <div className={"p-[24px]"}>
        <div className={"flex flex-wrap gap-[24px]"}>
          {userDetail?.events?.map((item) => (
            <div
              key={item?.id}
              className={"flex w-fit flex-col gap-[4px] rounded-[12px] border-[1px] p-[4px]"}
            >
              <Image src={item?.image ?? ""} alt={""} width={155.5} height={155.5} />
              <p className={"font-semiBold text-[14px]"}>{item?.name}</p>
              <div className={"flex items-center gap-[4px]"}>
                <CalendarIcon className={"w-[12px]"} />
                <p className={"text-text-grey text-[12px] font-normal"}>{item?.date}</p>
                <Dot className={"text-text-grey"} />
                <p className={"text-text-grey text-[12px] font-normal"}>{item?.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventView;
