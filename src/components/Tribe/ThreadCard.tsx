import React from 'react';
import Image from "next/image";
import avatar_image from "@/image/avatar_3.png";
import ver_image from "@/image/verified.png";
import DotIcon from "@/image/icons/Dot.svg";
import MoreIcon from "@/image/icons/MoreIcon.svg";
import thread_video from "@/image/ThreadVideo.png";
import heart_image from "@/image/icons/heart.png";
import chat_image from "@/image/icons/chat.png";

function ThreadCard() {
    return (
        <div className="bg-white p-4 py-4">
            <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <div>
                        <Image src={avatar_image} alt="" width={48}/>
                    </div>
                    <div>
                        <p className="font-semi-normal font-sans text-[14px] leading-[14.4px]">Christojoe</p>
                    </div>
                    <div>
                        <Image src={ver_image} alt="verifed"/>
                    </div>
                    <div>
                        <DotIcon className="w-[3px] h-[3px]"/>
                    </div>
                    <div>
                        <p className="font-sans font-normal text-[12px] leading-[14.4px]">2s</p>
                    </div>
                </div>
                <div>
                    <MoreIcon/>
                </div>
            </div>
            <div>
                <p className="font-sans font-semibold text-[14px] leading-[21px]">Why are architectural structures not
                    as good as before?</p>
                <p className="font-sans font-normal leading-[21px] text-[14px] text-light-black">Architecture, often
                    seen as the art of designing buildings, goes far deeper than aesthetics. It's a captivating blend of
                    art, science, history, and human experience. From towering skyscrapers to cozy cottages,
                    architec...</p>
                <p className="font-sans font-semi-normal text-[14px] text-light-green">see more</p>
            </div>
            <div>
                <Image src={thread_video} alt="thre"/>
            </div>
            <div className="flex gap-4 mt-2">
                <div
                    className="rounded-[12px] bg-light_grey p-[4px] px-[8px] w-[64px] h-[30px] flex justify-center items-center">
                    <Image src={heart_image} alt="like"/>
                </div>
                <div
                    className="rounded-[12px] bg-light_grey p-[4px] px-[8px] w-[64px] h-[30px] flex justify-center items-center">
                    <Image src={chat_image} alt="chat"/>
                </div>
            </div>
        </div>
    );
}

export default ThreadCard;