"use client";
import { images } from "@/lib/images";
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
    <div className="grid h-full w-full gap-12.5 p-4 py-4">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <Image
                src={images.DEFAULT_TRIBE}
                alt=""
                width={48}
                height={48}
                className="border-grey-90 h-12 w-12 rounded-2xl border"
              />
            </div>
            <div>
              <p className="font-semi-normal text-body-s font-sans leading-3.5">christjoe</p>
            </div>
            <div>
              <Image src={images.VERIFIED} alt="verifed" width={13} height={13} />
            </div>
            <div>
              <DotIcon className="h-0.75 w-0.75" />
            </div>
            <div>
              <p className="text-meta font-sans font-normal">{thread?.created_at}</p>
            </div>
          </div>
          <MoreVerticalIcon className="cursor-pointer" />
        </div>
        <div className="mt-1">
          <p className="text-body-s font-sans font-semibold">{thread?.topic}</p>
          <p className="text-light-black text-body-s mt-7.5 font-sans font-normal">
            {isExpanded || content || content.length <= charLimit
              ? content
              : `${content.slice(0, charLimit)}...`}
          </p>
          {content && content.length > charLimit && (
            <p
              className="font-semi-normal text-light-green text-body-s cursor-pointer font-sans"
              onClick={handleToggle}
            >
              {isExpanded ? "see less" : "see more"}
            </p>
          )}
        </div>
      </div>
      <div className="mt-2 flex gap-4"></div>
      <div className="w-full border-b"></div>
    </div>
  );
};

export default ThreadCard;
