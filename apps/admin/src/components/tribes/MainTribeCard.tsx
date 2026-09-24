import React from "react";
import Image from "next/image";
import { DotIcon, Trash2Icon } from "lucide-react";
import { TribeThread } from "@/features/tribes/api";

interface MainTribeCardProps {
  thread: TribeThread;
  onDelete?: (threadId: string) => void;
}

const MainTribeCard = ({ thread, onDelete }: MainTribeCardProps) => {
  return (
    <div className="flex flex-col gap-[8px] border-b-[1px] border-grey-20 pb-[16px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[8px]">
          <Image
            src={thread.user?.profile_image || "/images/tribe_1.png"}
            alt={thread.user?.fullname ?? "member"}
            width={32}
            height={32}
            className="h-[32px] w-[32px] rounded-full"
          />
          <div className="flex items-center gap-[8px]">
            <p className="text-[14px] font-normal">{thread.user?.fullname ?? "Unknown member"}</p>
            <DotIcon className="px-[0px] text-light-grey-50" />
            <p className="text-[12px] font-normal text-text-grey">{thread.created_at}</p>
          </div>
        </div>
        {onDelete && (
          <button
            type="button"
            aria-label="Delete thread"
            className="cursor-pointer text-text-grey hover:text-red-1"
            onClick={() => onDelete(thread.id)}
          >
            <Trash2Icon className="h-[16px] w-[16px]" />
          </button>
        )}
      </div>
      <p className="text-[14px] font-medium">{thread.topic}</p>
      <p className="font-sans text-[14px] font-normal leading-[21px] text-light-black">
        {thread.thoughts}
      </p>
    </div>
  );
};

export default MainTribeCard;
