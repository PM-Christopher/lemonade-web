'use client'
import React from 'react';
import CloseIcon from "@/images/icons/close.svg";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import PromoteEvent from "@/image/PromoteEventIcon.png"
import {useRouter} from "next/navigation";

const VerifyBoost = ({isOpen, toggleMenu, boost}: {isOpen: boolean, toggleMenu: () => void, boost: any}) => {
    const router = useRouter()
    const backToBusiness = () => {
        toggleMenu()
        const currentPath = window.location.pathname;
        router.push(currentPath);
    }
    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-screen laptop:w-[480px] p-6 h-full laptop:h-screen">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggleMenu}>
                            <CloseIcon/>
                        </div>
                    </div>
                </div>
                <div className="mt-10 flex flex-col">
                    <div className="flex flex-col items-center">
                        <Image src={"/images/promoteEventIcon.png"} alt="promote" width={160} height={160} />
                    </div>
                    <div className="px-[10px]">
                        <div className="mt-[24px] flex flex-col items-center">
                            <p className="font-semiBold text-[20px] text-center text-light-green">Payment successful</p>
                            <p className="font-normal text-[14px] w-[416px] text-center">Your payment has been processed
                                and your business will be boosted from <span className="font-semi-normal">
                                    {boost?.full_start_date} to {boost?.full_end_date}
                            </span>
                            </p>
                        </div>
                        <div className="mt-[24px]">
                            <p className="font-semiBold text-[20px]">Featured</p>
                        </div>
                        <div className="flex flex-col mt-[24px]">
                            <p className="text-[14px] font-normal text-text-grey">Start date</p>
                            <p className="text-[14px] font-semi-normal text-light-black">
                                {boost?.start_date}
                            </p>
                        </div>

                        <div className="flex flex-col mt-[16px]">
                            <p className="text-[14px] font-normal text-text-grey">Start time</p>
                            <p className="text-[14px] font-semi-normal text-light-black">
                                {boost?.start_time}
                            </p>
                        </div>

                        <div className="flex flex-col mt-[16px]">
                            <p className="text-[14px] font-normal text-text-grey">Duration</p>
                            <p className="text-[14px] font-semi-normal text-light-black">
                                {boost?.duration} days
                            </p>
                        </div>
                    </div>

                    <Button className="bg-gradient-green w-full h-[48px] mt-[24px]" onClick={backToBusiness} type="button">
                        <p className="text-white">Go to business</p>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default VerifyBoost;