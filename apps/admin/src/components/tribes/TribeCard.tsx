import React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { ChatIcon } from "evergreen-ui";

const TribeCard = ({
  image,
  title,
  date,
  category,
  threads,
  members,
}: {
  image: any;
  title: string;
  date: string;
  category: string;
  threads: string;
  members: string;
}) => {
  return (
    <div className="px-[24px]">
      <div className="mb-2 rounded-[16px] border-[1px] border-grey-30 bg-mid-grey">
        <div className="flex items-center justify-between rounded-[16px] bg-white p-4">
          <div className="flex items-center gap-2">
            <div>
              <Image src={image} alt="tribe image" width={40} height={40} />
            </div>
            <div className="flex flex-col">
              <div>
                <p className="font-sans text-[14px] font-semibold">{title}</p>
              </div>
              <div>
                <p className="font-sans text-[12px] font-normal text-text-grey">
                  Created on {date}
                </p>
              </div>
            </div>
          </div>
          <ChevronRight className={"w-[10px] text-text-grey"} />
        </div>
        <div className="flex justify-between rounded-b-[16px] bg-mid-grey p-4 py-6">
          <div>
            <p className="font-semi-normal font-sans text-[12px] leading-[14.4px] text-black-light">
              {category}
            </p>
          </div>
          <div>
            <p className="font-semi-normal font-sans text-[12px] leading-[14.4px] text-black-light">
              {members || 0} Members
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ChatIcon />
            <p className="font-semi-normal font-sans text-[12px] leading-[14.4px] text-black-light">
              {threads || 0}threads
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TribeCard;
