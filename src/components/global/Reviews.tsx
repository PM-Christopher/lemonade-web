import React from 'react';
import Image from "next/image";
import Avatar from "@/image/ProfileAvatars.png";
import DotIcon from "@/image/icons/Dot.svg";
import RatingIcon from "@/image/icons/RatingIcon.svg";

const Reviews: React.FC = () => {
    return (
        <>
            <div className="">
                <p className="font-semibold text-[14px]">Professional and good worker</p>
                <p className="font-normal text-[14px] text-light-black">He did the work
                    professionally</p>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 mt-[14px]">
                        <div className="rounded-[6px] border-[1px]">
                            <Image src={Avatar} alt="avatar"/>
                        </div>
                        <p className="font-semibold text-[12px] text-text-grey">Christojoe</p>
                        <DotIcon className="w-[5px]"/>
                        <p className="font-normal text-[12px] text-text-grey">10m</p>
                    </div>
                    <div>
                        <div
                            className="flex items-center gap-2 p-[4px] px-[6px] bg-mid-grey rounded-[12px]">
                            <RatingIcon/>
                            <p className="font-semibold text-[12px]">3</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t-[1px] border-t-mid-grey my-[24px]"></div>
        </>
    );
}

export default Reviews;