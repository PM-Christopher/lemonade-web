import React from "react";
import { CalendarIcon, ChevronDown, Dot } from "lucide-react";
import Image from "next/image";
import type { AccountInfoResponse } from "@/features/user/api";

interface EventViewProps {
  userDetail: AccountInfoResponse | undefined;
}

const EventView: React.FC<EventViewProps> = ({ userDetail }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className={"p-4 px-6 pt-6"}>
        <div
          className={
            "border-grey-20 bg-light-grey flex h-10 items-center justify-between rounded-xl border px-4 py-2.5"
          }
        >
          <div className={"flex items-center justify-between"}>
            <div className={"text-text-grey flex items-center gap-2"}>
              <CalendarIcon className={"w-[15px]"} />
              <p className={"font-semiBold text-text-grey text-[12px]"}>ALL EVENTS</p>
            </div>
          </div>
          <ChevronDown className={"text-text-grey w-5"} />
        </div>
      </div>
      <div className={"p-6"}>
        <div className={"flex flex-wrap gap-6"}>
          {userDetail?.events?.map((item) => (
            <div key={item?.id} className={"flex w-fit flex-col gap-1 rounded-xl border p-1"}>
              <Image src={item?.image ?? ""} alt={""} width={155.5} height={155.5} />
              <p className={"font-semiBold text-[14px]"}>{item?.name}</p>
              <div className={"flex items-center gap-1"}>
                <CalendarIcon className={"w-3"} />
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
