import React from 'react';
import Image from "next/image";
import tribe_image from "@/image/tribe_1.png";
import DotIcon from "@/image/icons/Dot.svg";
import ShareIcon from "@/image/icons/share.svg";
import {Button} from "@/components/ui/button";
import EditIcon from "@/image/icons/edit.svg";
import avatar_image from "@/image/avatar_3.png";
import DeleteIcon from "@/image/icons/delete.svg";

function TribeDetailsCard() {
    return (
        <div className="flex flex-col gap-2 p-4 py-4 bg-white w-[496px] h-fit">
            <div>
                <p className="font-sans font-semibold text-[16px] leading-[24px]">Tribe details</p>
            </div>
            <div className="flex justify-center mt-10">
                <Image src={tribe_image} alt="tribe"/>
            </div>
            <div className="flex flex-col items-center">
                <p className="font-sans font-semibold text-[16px] leading-[24px]">Start-ups</p>
                <i className="font-sans font-semi-normal text-[14px] leading-[16.8px] text-text-grey mt-1">Business</i>
                <div className="flex gap-1 justify-center items-center mt-1">
                    <p className="font-sans font-normal text-[12px] text-text-grey">3 members</p>
                    <DotIcon/>
                    <p className="font-sans font-normal text-[12px] text-text-grey">1 thread</p>
                </div>
                <div className="flex flex-col items-center w-[311px]">
                    <p className="text-center font-sans font-normal text-light-black text-[14px] leading-[21px] my-4">
                        Share your start-up experiences to teach others on what to do.
                    </p>
                    <p className="font-sans font-normal text-[12px] text-text-grey my-2">Created by <span
                        className="font-semibold">You</span> on 23 Mar, 2024</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex flex-col items-center bg-light_grey p-[24px] rounded-[16px]">
                        <ShareIcon/>
                    </div>
                    <p className="text-black-light text-[14px] font-semi-normal font-sans leading-[21px]">Share</p>
                </div>
            </div>
            <div className="flex justify-center my-2">
                <Button
                    className="bg-gradient-green border-step-color shadow-custom-bottom h-[60px] p-[14px] px-[24px] rounded-[37px]">
                    <div className="flex gap-1 justify-center">
                        <EditIcon/>
                        <p className="font-sans font-semi-normal text-[16px] leading-[19.2px]">Create thread</p>
                    </div>
                </Button>
            </div>
            <div className="flex justify-between items-center my-4">
                <div className="flex flex-col">
                    <p className="font-sans font-semi-normal text-[16px] leading-[24px] text-black-light">Monetized
                        Tribe</p>
                    <p className="font-sans font-normal text-[12px] text-text-grey leading-[14.4px]">Only paid user are
                        allowed.</p>
                </div>
                <div>
                    <p className="font-sans font-semi-normal text-light-black text-[14px] leading-[21px]">N 2,000</p>
                </div>
            </div>
            <div className="flex flex-col p-3 bg-light_grey rounded-[12px]">
                <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-text-grey">Members</p>
                <div className="mt-4">
                    <div className="flex justify-between items-center py-1">
                        <div className="flex gap-2 items-center">
                            <div>
                                <Image src={avatar_image} alt="avatar" width={20}/>
                            </div>
                            <div className="font-sans font-semi-normal text-[14px] text-black-light leading-[21px]">
                                You
                            </div>
                        </div>
                        <div></div>
                    </div>
                    <div className="border-t-[1px] my-2"></div>
                    <div className="flex justify-between items-center py-1">
                        <div className="flex gap-2 items-center">
                            <div>
                                <Image src={avatar_image} alt="avatar" width={20}/>
                            </div>
                            <div>
                                <p className="font-sans font-semi-normal text-[14px] text-black-light leading-[21px]">Christojoe</p>
                            </div>
                        </div>
                        <div>
                            <DeleteIcon/>
                        </div>
                    </div>
                    <div className="border-t-[1px] my-2"></div>
                    <div className="flex justify-between items-center py-1">
                        <div className="flex gap-2 items-center">
                            <div>
                                <Image src={avatar_image} alt="avatar" width={20}/>
                            </div>
                            <div>
                                <p className="font-sans font-semi-normal text-[14px] text-black-light leading-[21px]">Daniel22</p>
                            </div>
                        </div>
                        <div>
                            <DeleteIcon/>
                        </div>
                    </div>
                    <div className="border-t-[1px] my-2"></div>
                </div>
            </div>
        </div>
    );
}

export default TribeDetailsCard;