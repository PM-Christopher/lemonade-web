import React from 'react';
import Image from "next/image";
import avatar from "@/image/avatar_3.png";
import DotIcon from "@/image/icons/Dot.svg";

type ChatListInterface = {
    active: boolean
}

const ChatListCard: React.FC<ChatListInterface> = ({ active }) => {
    return (
        <div className={`p-[16px] flex items-center gap-[4px] ${active && "bg-light-green-10"}`}>
            <div>
                <Image src={avatar} alt="avatar"/>
            </div>
            <div className="flex flex-col w-full">
                <div className="flex items-center gap-[4px]">
                    <p className="font-semibold text-[14px] text-black-light">Dan-maxy</p>
                    <DotIcon className="w-[4px]"/>
                    <p className="text-text-grey text-[14px] font-normal">L1</p>
                </div>
                <div className="flex justify-between">
                    <p className="font-normal text-[14px] text-light-black">Do you want eggs</p>
                    <div className="flex gap-2">
                        <p className="text-[12px] font-normal text-text-grey">|</p>
                        <p className="text-[12px] font-normal text-text-grey">2m ago</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatListCard;