import React from 'react';
import Image from "next/image";
import forum_icon from "@/image/forum_icon.png";
import tribe_image from "@/image/forum_image.png";
import heart_icon from "@/image/icons/heart.png";
import chat_icon from "@/image/icons/chat.png";
import arrow_left from "@/image/icons/arrow-left.png";

function TribeCard() {
    return (
        <div className="w-full flex flex-col bg-light-yellow p-4 px-4 rounded-2xl shadow-lg">
            <div>
                <Image src={forum_icon} alt="forum_icon" width={48}/>
            </div>
            <div className="mt-2 flex justify-between">
                <div>
                    <p className="text-text-grey text-[12px] font-semibold font-sans">Structural
                        masters</p>
                    <p className="text-[12px] font-semibold font-sans text-ellipsis">Why are architectural structures
                        not ...</p>
                </div>
                <div>
                    <Image src={tribe_image} alt="" width={48}/>
                </div>
            </div>
            <div className="mt-2 flex justify-between">
                <div className="flex gap-2">
                    <div className="flex justify-between items-center gap-1">
                        <div>
                            <Image src={heart_icon} alt="like" width={16}/>
                        </div>
                        <div>
                            <p className="font-sans text-[14px] font-semi-normal text-light-black">120</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center gap-1">
                        <div>
                            <Image src={chat_icon} alt="comment" width={16}/>
                        </div>
                        <div>
                            <p className="font-sans text-[14px] font-semi-normal text-light-black">15</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center gap-1">
                    <div>
                        <p className="font-sans text-[14px] font-semi-normal text-light-green">View</p>
                    </div>
                    <div>
                        <Image src={arrow_left} alt="arrow left" width={12.5}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TribeCard;