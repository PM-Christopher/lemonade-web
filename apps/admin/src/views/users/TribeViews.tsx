import React from "react";
import TribeCard from "@/components/tribes/TribeCard";
import type { AccountInfoResponse } from "@/features/user/api";
import { images } from "@/lib/images";

interface TribeViewsProps {
  userDetail: AccountInfoResponse | undefined;
  onOpen: (tribeId: string | number) => void;
}

const TribeViews = ({ userDetail, onOpen }: TribeViewsProps) => {
  const tribes = userDetail?.tribes ?? [];

  return (
    <div className="flex flex-col py-5">
      {tribes.map((item) => (
        <button
          key={item.id}
          type="button"
          className="w-full cursor-pointer text-left"
          onClick={() => onOpen(item.id)}
        >
          <TribeCard
            date={item.created_at}
            image={item.image || images.DEFAULT_TRIBE}
            title={item.name}
            category={item.category}
            members={String(item.members ?? 0)}
            threads={String(item.threads ?? 0)}
          />
        </button>
      ))}
      {tribes.length === 0 && (
        <p className="text-text-grey text-body-s px-6 font-normal">No tribes yet.</p>
      )}
    </div>
  );
};

export default TribeViews;
