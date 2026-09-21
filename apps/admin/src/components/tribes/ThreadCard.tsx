"use client";
import React, { useState } from "react";
import Image from "next/image";
import { DotIcon, MoreVerticalIcon } from "lucide-react";

interface ThreadCardProps {
  thread?: { created_at?: string; topic?: string };
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread }) => {
  const [isExpanded, setIsExpanded] = useState(false); // State to track if text is expanded
  const charLimit = 200;
  const [content] = useState(
    "This is the content of the text you are reading and this is happening at the moment",
  );

  const handleToggle = () => {
    setIsExpanded(!isExpanded); // Toggle the expanded state
  };

  return (
    <div className="grid h-full w-full gap-[50px] p-4 py-4">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <Image
                src={"/images/tribe_1.png"}
                alt=""
                width={48}
                height={48}
                className="h-[48px] w-[48px] rounded-[16px] border-[1px] border-grey-90"
              />
            </div>
            <div>
              <p className="font-semi-normal font-sans text-[14px] leading-[14.4px]">christjoe</p>
            </div>
            <div>
              <Image src={"/images/verified.png"} alt="verifed" width={13} height={13} />
            </div>
            <div>
              <DotIcon className="h-[3px] w-[3px]" />
            </div>
            <div>
              <p className="font-sans text-[12px] font-normal leading-[14.4px]">
                {thread?.created_at}
              </p>
            </div>
          </div>
          <MoreVerticalIcon className="cursor-pointer" />
        </div>
        <div className="mt-[4px]">
          <p className="font-sans text-[14px] font-semibold leading-[21px]">{thread?.topic}</p>
          <p className="mt-[30px] font-sans text-[14px] font-normal leading-[21px] text-light-black">
            {isExpanded || content || content.length <= charLimit
              ? content
              : `${content.slice(0, charLimit)}...`}
          </p>
          {content && content.length > charLimit && (
            <p
              className="font-semi-normal cursor-pointer font-sans text-[14px] text-light-green"
              onClick={handleToggle}
            >
              {isExpanded ? "see less" : "see more"}
            </p>
          )}
        </div>
      </div>
      <div className="mt-2 flex gap-4"></div>
      <div className="w-full border-b-[1px]"></div>
    </div>
  );
};

export default ThreadCard;
