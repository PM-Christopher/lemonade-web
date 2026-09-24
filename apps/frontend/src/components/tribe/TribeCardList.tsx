import React from "react";
import Image from "next/image";
import MoneyIcon from "@/images/icons/money.svg";
import { TribeInterface } from "@/interfaces/TribeInterface";
import { formatLongDate } from "@/lib/dateTimeFormatter";
import ChatsIcon from "@/images/icons/chatsIcon.svg";
import { useRouter } from "next/navigation";

type TribeCardIF = {
  tribe: TribeInterface;
};

const TribeCardList: React.FC<TribeCardIF> = ({ tribe }) => {
  const router = useRouter();
  return (
    <div className="mb-2 rounded-[16px] border-[1px] border-grey-30 bg-mid-grey">
      <div className="flex items-center justify-between rounded-[16px] bg-white p-4">
        <div className="flex items-center gap-2">
          <div>
            <Image
              src={tribe?.image || "/images/tribe_1.png"}
              alt="tribe image"
              width={40}
              height={40}
            />
          </div>
          <div className="flex flex-col">
            <div>
              <p className="font-sans text-[14px] font-semibold">{tribe.tribe_name}</p>
            </div>
            <div>
              <p className="font-sans text-[12px] font-normal text-text-grey">
                Created on {formatLongDate(tribe.created_at)}
              </p>
            </div>
          </div>
        </div>
        {tribe.has_joined ||
          (!tribe.owner && (
            <button
              className="flex items-center gap-1 rounded-xl border border-light-green/20 px-4 py-1 transition-all duration-200 hover:border-light-green/40 hover:bg-light-green/10 hover:shadow-sm active:scale-95"
              onClick={() => router.push(`tribe/${tribe.slug}`)}
            >
              <span className="font-sans text-sm font-semibold text-light-green">Join</span>
              {tribe.monetized && <MoneyIcon className="h-4 w-4 text-light-green" />}
            </button>
          ))}
      </div>
      <div className="flex justify-between rounded-b-[16px] bg-mid-grey p-4 py-6">
        <div>
          <p className="font-sans text-[12px] font-semi-normal leading-[14.4px] text-black-light">
            {tribe.category}
          </p>
        </div>
        <div>
          <p className="font-sans text-[12px] font-semi-normal leading-[14.4px] text-black-light">
            {tribe.members} Members
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ChatsIcon />
          <p className="font-sans text-[12px] font-semi-normal leading-[14.4px] text-black-light">
            {tribe.threads} threads
          </p>
        </div>
      </div>
    </div>
  );
};

export default TribeCardList;
