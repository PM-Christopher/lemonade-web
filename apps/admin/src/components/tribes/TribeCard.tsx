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
    <div className="px-6">
      <div className="border-grey-30 bg-mid-grey mb-2 rounded-2xl border">
        <div className="flex items-center justify-between rounded-2xl bg-white p-4">
          <div className="flex items-center gap-2">
            <div>
              <Image src={image} alt="tribe image" width={40} height={40} />
            </div>
            <div className="flex flex-col">
              <div>
                <p className="text-body-s font-sans font-semibold">{title}</p>
              </div>
              <div>
                <p className="text-text-grey text-meta font-sans leading-normal font-normal">
                  Created on {date}
                </p>
              </div>
            </div>
          </div>
          <ChevronRight className={"text-text-grey w-2.5"} />
        </div>
        <div className="bg-mid-grey flex justify-between rounded-b-2xl p-4 py-6">
          <div>
            <p className="font-semi-normal text-black-light text-meta font-sans">{category}</p>
          </div>
          <div>
            <p className="font-semi-normal text-black-light text-meta font-sans">
              {members || 0} Members
            </p>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <p className="font-semi-normal text-black-light text-meta font-sans">
              {threads || 0}threads
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TribeCard;
