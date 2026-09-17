import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@lemonade/ui";
import Image from "next/image";
import {
  ChevronLeft,
  DotIcon,
  HeartIcon,
  MessageSquare,
  MoreVerticalIcon,
  SearchIcon,
} from "lucide-react";

const MainTribeCard = () => {
  return (
    <>
      <div className="flex flex-col gap-[8px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[8px]">
            <div className="h-[48px] w-[48px] rounded-[10px] bg-gray-600"></div>
            <div className="flex items-center gap-[8px]">
              <p className="text-[14px] font-normal">Christjoe</p>
              <Image src={"/images/verified.png"} alt="verified" width={13} height={13} />
              <DotIcon className="px-[0px] text-light-grey-50" />
              <p className="text-[12px] font-normal text-text-grey">2s</p>
            </div>
          </div>
          <MoreVerticalIcon className="cursor-pointer text-text-grey" />
        </div>
        <p className="text-[14px] font-medium">
          Why are architectural structures not as good as before
        </p>
        <p className="mt-[30px] font-sans text-[14px] font-normal leading-[21px] text-light-black">
          This is the detail of the thread.
          {/* {isExpanded || !thread?.thoughts || thread.thoughts.length <= charLimit ? thread?.thoughts : `${thread.thoughts.slice(0, charLimit)}...`} */}
        </p>
        {/* {thread?.thoughts && thread.thoughts.length > charLimit && (
            <p className="font-sans font-semi-normal text-[14px] text-light-green cursor-pointer" onClick={handleToggle}>
              {isExpanded ? "see less" : "see more"}
            </p>
          )} */}
        <div className="mt-2 flex gap-4">
          <div className="bg-light_grey flex h-[30px] w-[64px] cursor-pointer items-center justify-center rounded-[12px] bg-light-grey p-[4px] px-[8px]">
            <HeartIcon className="w-[14px] text-text-grey" />
            {/* {
                        thread?.hasLiked ? (
                            <HeartFilledIcon/>
                        ) : (
                            <HeartIcon className=""/>
                        )
                    } */}
          </div>
          <div className="bg-light_grey flex h-[30px] w-[64px] cursor-pointer items-center justify-center rounded-[12px] bg-light-grey p-[4px] px-[8px]">
            <MessageSquare className="w-[14px] text-text-grey" />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainTribeCard;
