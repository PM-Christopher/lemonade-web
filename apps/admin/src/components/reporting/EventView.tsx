import React from "react";
import Image from "next/image";
import { DotIcon, MoreVerticalIcon } from "lucide-react";

function EventView({ event }: { event: any }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            {/*<Image src={thread?.created_by?.user?.avatar} alt="" width={48} height={48}*/}
            {/*       className="w-[48px] h-[48px] rounded-[16px] border-[1px] border-grey-90"/>*/}
          </div>
          <div>
            {/*<p className="font-semi-normal font-sans text-[14px] leading-[14.4px]">{thread?.created_by?.user?.username}</p>*/}
          </div>
          {/*{*/}
          {/*    thread?.created_by.user.verified && (*/}
          {/*        <div>*/}
          {/*            <Image src={"/images/verified.png"} alt="verifed" width={13} height={13}/>*/}
          {/*        </div>*/}
          {/*    )*/}
          {/*}*/}
          <div>
            <DotIcon className="h-[3px] w-[3px]" />
          </div>
          <div>
            {/*<p className="font-sans font-normal text-[12px] leading-[14.4px]">{thread?.created_at}</p>*/}
          </div>
        </div>
        <div className="cursor-pointer">
          <MoreVerticalIcon className="cursor-pointer" />
        </div>
      </div>
      <div className="mt-[4px]">
        <p className="font-sans text-[14px] font-semibold leading-[21px]">{/*{thread?.topic}*/}</p>
        <p className="mt-[30px] font-sans text-[14px] font-normal leading-[21px] text-light-black">
          {/*{isExpanded || !thread?.thoughts || thread.thoughts.length <= charLimit*/}
          {/*    ? thread?.thoughts*/}
          {/*    : `${thread.thoughts.slice(0, charLimit)}...`}*/}
        </p>
        {/*{thread?.thoughts && thread.thoughts.length > charLimit && (*/}
        {/*    <p*/}
        {/*        className="font-sans font-semi-normal text-[14px] text-light-green cursor-pointer"*/}
        {/*        onClick={handleToggle}*/}
        {/*    >*/}
        {/*        {isExpanded ? "see less" : "see more"}*/}
        {/*    </p>*/}
        {/*)}*/}
      </div>
    </div>
  );
}

export default EventView;
