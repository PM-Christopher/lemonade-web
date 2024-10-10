import React from 'react';
import CloseIcon from "@/image/icons/close.svg";
import Image from "next/image";
import Lemon from "@/image/Lemon.png";
import LocationIcon from "@/image/icons/LocationPinGreenIcon.svg";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";

type SettingsInterface = {
    toggle: () => void,
    isOpen: boolean
}

const SettingsModal: React.FC<SettingsInterface>= ({toggle, isOpen}) => {
    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[480px] p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon className="w-[11.25px]"/>
                        </div>
                        <p className="font-semibold text-[16px]">Visibility settings</p>
                    </div>
                </div>
                <div className="mt-[24px]">
                    <div className="flex flex-col">
                        <div className="pt-[12px] pb-[12px] rounded-[12px] bg-light-green-10 w-full flex flex-col items-center justify-center">
                            <div className="relative">
                                <Image src={Lemon} alt="lemon"/>
                                <p className="absolute bottom-3.5 left-2 text-black text-[12px] font-semibold text-center">
                                    L12
                                </p>
                            </div>
                            <p className="font-semibold text-[18px]">Lemon 12</p>
                        </div>
                        <div className="mt-[32px] flex justify-between">
                            <div className="flex flex-col">
                                <p className="font-semibold text-[16px]">Turn on visibility</p>
                                <p className="font-semi-normal text-[12px] text-text-grey">Your live location will be visible to everybody</p>
                            </div>
                            <p>CHK_BOX</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsModal;