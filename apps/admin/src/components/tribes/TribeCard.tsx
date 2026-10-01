import React from "react";
import Image from "next/image";
import { ChevronRight, MessageSquare } from "lucide-react";

const TribeCard = ({
  image,
  title,
  date,
  category,
  threads,
  members,
}: {
  image: string;
  title: string;
  date: string;
  category: string;
  threads: string;
  members: string;
}) => {
  return (
    <div className="px-[24px]">
      <div className="border-grey-30 bg-mid-grey mb-2 rounded-[16px] border-[1px]">
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
                <p className="text-text-grey font-sans text-[12px] font-normal">
                  Created on {date}
                </p>
              </div>
            </div>
          </div>
          <ChevronRight className={"text-text-grey w-[10px]"} />
        </div>
        <div className="bg-mid-grey flex justify-between rounded-b-[16px] p-4 py-6">
          <div>
            <p className="font-semi-normal text-black-light font-sans text-[12px] leading-[14.4px]">
              {category}
            </p>
          </div>
          <div>
            <p className="font-semi-normal text-black-light font-sans text-[12px] leading-[14.4px]">
              {members || 0} Members
            </p>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <p className="font-semi-normal text-black-light font-sans text-[12px] leading-[14.4px]">
              {threads || 0}threads
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TribeCard;
