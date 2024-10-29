import React from 'react';
import Image from "next/image";
import avatar from "@/image/avatar_3.png";
import DotIcon from "@/image/icons/Dot.svg";
import MoreIcon from "@/image/icons/MoreIcon.svg";
import {Input} from "@/components/ui/input";
import ImageIcon from "@/image/icons/ImageIcon.svg";

const EmptyChat = () => {
    return (
        <div
            className="w-[560px] h-[648px] border-t-[1px] border-b-[1px] border-r-[1px] bg-white flex flex-col rounded-tr-[16px] rounded-br-[16px] relative">

            <div className="absolute top-0 left-0 w-full text-white p-[8px] rounded-tr-[16px]">
            </div>

            <div className="flex justify-center items-center h-screen bg-white rounded-tr-[16px] rounded-br-[16px] p-[16px] mb-16">
                <p className="font-semibold text-[20px]">Open chat to begin messaging</p>
            </div>

            <div className="absolute bottom-0 left-0 w-full text-white p-[16px] px-[13px] rounded-br-[16px]">

            </div>
        </div>
    );
}

export default EmptyChat;