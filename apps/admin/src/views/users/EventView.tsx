import React from "react";
import { CalendarIcon, ChevronDown, Dot, DotIcon } from "lucide-react";
import Image from "next/image";

interface EventViewProps {
  userDetail: any;
}

const EventView: React.FC<EventViewProps> = ({ userDetail }) => {
  return (
    <div className="flex flex-col gap-[24px]">
      <div className={"p-[16px] px-[24px] pt-[24px]"}>
        <div
          className={
            "flex h-[40px] items-center justify-between rounded-[12px] border-[1px] border-grey-20 bg-light-grey px-[16px] py-[10px]"
          }
        >
          <div className={"flex items-center justify-between"}>
            <div className={"flex items-center gap-[8px] text-text-grey"}>
              <CalendarIcon className={"w-[15px]"} />
              <p className={"text-[12px] font-semiBold text-text-grey"}>ALL EVENTS</p>
            </div>
          </div>
          <ChevronDown className={"w-[20px] text-text-grey"} />
        </div>
      </div>
      <div className={"p-[24px]"}>
        <div className={"flex flex-wrap gap-[24px]"}>
          {userDetail?.events?.map((item: any) => (
            <div
              key={item?.id}
              className={"flex w-fit flex-col gap-[4px] rounded-[12px] border-[1px] p-[4px]"}
            >
              <Image src={item?.image} alt={""} width={155.5} height={155.5} />
              <p className={"text-[14px] font-semiBold"}>{item?.name}</p>
              <div className={"flex items-center gap-[4px]"}>
                <CalendarIcon className={"w-[12px]"} />
                <p className={"text-[12px] font-normal text-text-grey"}>{item?.date}</p>
                <Dot className={"text-text-grey"} />
                <p className={"text-[12px] font-normal text-text-grey"}>{item?.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventView;
