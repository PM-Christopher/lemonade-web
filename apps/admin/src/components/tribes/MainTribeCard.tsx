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
    <div className="border-grey-20 flex flex-col gap-2 border-b pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={thread.user?.profile_image || "/images/tribe_1.png"}
            alt={thread.user?.fullname ?? "member"}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full"
          />
          <div className="flex items-center gap-2">
            <p className="text-[14px] font-normal">{thread.user?.fullname ?? "Unknown member"}</p>
            <DotIcon className="text-light-grey-50 px-0" />
            <p className="text-text-grey text-[12px] font-normal">{thread.created_at}</p>
          </div>
        </div>
        {onDelete && (
          <button
            type="button"
            aria-label="Delete thread"
            className="text-text-grey hover:text-red-1 cursor-pointer"
            onClick={() => onDelete(thread.id)}
          >
            <Trash2Icon className="h-4 w-4" />
          </button>
        )}
      </div>
      <p className="text-[14px] font-medium">{thread.topic}</p>
      <p className="text-light-black font-sans text-[14px] leading-[21px] font-normal">
        {thread.thoughts}
      </p>
    </div>
  );
};

export default MainTribeCard;
