import React from 'react';
import Image from "next/image";
import MoneyIcon from "@/images/icons/money.svg";
import {TribeInterface} from "@/interfaces/TribeInterface";
import {formatLongDate} from "@/lib/dateTimeFormatter";
import ChatsIcon from "@/images/icons/chatsIcon.svg"
import {useRouter} from "next/navigation";

type TribeCardIF = {
    tribe: TribeInterface
}

const TribeCardList: React.FC<TribeCardIF> = ({tribe}) => {
    const router = useRouter()
    return (
        <div className="bg-mid-grey rounded-[16px] mb-2 border-[1px] border-grey-30">
            <div className="flex items-center justify-between bg-white p-4 rounded-[16px]">
                <div className="flex gap-2 items-center">
                    <div>
                        <Image src={tribe?.image} alt="tribe image" width={40} height={40}/>
                    </div>
                    <div className="flex flex-col">
                        <div>
                            <p className="font-sans text-[14px] font-semibold">{tribe.tribe_name}</p>
                        </div>
                        <div>
                            <p className="font-sans font-normal text-[12px] text-text-grey">Created on {formatLongDate(tribe.created_at)}</p>
                        </div>
                    </div>
                </div>
                {
                    tribe.has_joined || !tribe.owner && (
                        <button
                            className="flex items-center gap-1 border border-light-green/20 px-4 py-1 rounded-xl transition-all duration-200 hover:bg-light-green/10 hover:border-light-green/40 hover:shadow-sm active:scale-95"
                            onClick={() => router.push(`tribe/${tribe.slug}`)}
                        >
                            <span className="font-sans font-semibold text-sm text-light-green">
                                Join
                            </span>
                            {tribe.monetized && (
                                <MoneyIcon className="w-4 h-4 text-light-green" />
                            )}
                        </button>
                    )
                }

            </div>
            <div className="flex justify-between p-4 bg-mid-grey rounded-b-[16px] py-6">
                <div>
                    <p className="font-sans font-semi-normal text-[12px] leading-[14.4px] text-black-light">{
                        tribe.category
                    }</p>
                </div>
                <div>
                    <p className="font-sans font-semi-normal text-[12px] leading-[14.4px] text-black-light">
                        {tribe.members} Members</p>
                </div>
                <div className="flex gap-2 items-center">
                    <ChatsIcon />
                    <p className="font-sans font-semi-normal text-[12px] leading-[14.4px] text-black-light">
                        {tribe.threads} threads
                    </p>
                </div>
            </div>
        </div>
    );
}

export default TribeCardList;