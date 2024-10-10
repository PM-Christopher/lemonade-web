import React from 'react';
import Image from "next/image";
import tribe_image from "@/image/tribe_image.png";
import MoneyIcon from "@/image/icons/money.svg";
import {TribeInterface} from "@/interfaces/TribeInterface";
import {formatLongDate} from "@/lib/dateTimeFormatter";

type TribeCardIF = {
    tribe: TribeInterface
}

const TribeCardList: React.FC<TribeCardIF> = ({tribe}) => {
    return (
        <div className="bg-mid-grey rounded-[16px] mb-2 border-[1px] border-grey-30">
            <div className="flex items-center justify-between bg-white p-4 rounded-[16px]">
                <div className="flex gap-2 items-center">
                    <div>
                        <Image src={tribe_image} alt="tribe image"/>
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
                <div className="flex items-center gap-1 border-2 px-[16px] p-[4px] rounded-[12px]">
                    <div>
                        <p className="font-sans font-semi-normal text-[14px] text-light-green">Join</p>
                    </div>
                    {
                        tribe.monetized === 1 && (
                            <div>
                                <MoneyIcon/>
                            </div>
                        )
                    }
                </div>
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
                <div>
                    <p className="font-sans font-semi-normal text-[12px] leading-[14.4px] text-black-light">
                        {tribe.threads} threads
                    </p>
                </div>
            </div>
        </div>
    );
}

export default TribeCardList;