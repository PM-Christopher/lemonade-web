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
    <div className="border-grey-30 bg-mid-grey mb-2 rounded-2xl border">
      <div className="flex items-center justify-between rounded-2xl bg-white p-4">
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
              <p className="text-text-grey font-sans text-[12px] font-normal">
                Created on {formatLongDate(tribe.created_at)}
              </p>
            </div>
          </div>
        </div>
        {tribe.has_joined ||
          (!tribe.owner && (
            <button
              className="border-light-green/20 hover:border-light-green/40 hover:bg-light-green/10 flex items-center gap-1 rounded-xl border px-4 py-1 transition-all duration-200 hover:shadow-sm active:scale-95"
              onClick={() => router.push(`tribe/${tribe.slug}`)}
            >
              <span className="text-light-green font-sans text-sm font-semibold">Join</span>
              {tribe.monetized && <MoneyIcon className="text-light-green h-4 w-4" />}
            </button>
          ))}
      </div>
      <div className="bg-mid-grey flex justify-between rounded-b-2xl p-4 py-6">
        <div>
          <p className="font-semi-normal text-black-light font-sans text-[12px] leading-[14.4px]">
            {tribe.category}
          </p>
        </div>
        <div>
          <p className="font-semi-normal text-black-light font-sans text-[12px] leading-[14.4px]">
            {tribe.members} Members
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ChatsIcon />
          <p className="font-semi-normal text-black-light font-sans text-[12px] leading-[14.4px]">
            {tribe.threads} threads
          </p>
        </div>
      </div>
    </div>
  );
};

export default TribeCardList;
