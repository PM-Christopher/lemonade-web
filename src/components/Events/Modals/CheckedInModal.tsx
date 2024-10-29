import React from 'react';
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";

type CheckedInInterface = {
    toggle: () => void,
    isOpen: boolean
}

const CheckedInModal: React.FC<CheckedInInterface> = ({toggle, isOpen}) => {
    return (
        <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[480px] p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon/>
                        </div>
                    </div>
                </div>
                <div className="mt-[24px]">
                    <div className="flex justify-center">
                        <Image src={"/images/checkIn.png"} alt="check in" width={311} height={160}/>
                    </div>
                </div>
                <div className="mt-[24px]">
                    <div className="flex flex-col">
                        <p className="font-sans font-semibold text-[20px] leading-[28px] text-center text-black-light">Check
                            in Successful!</p>
                        <p className="font-sans font-normal text-[16px] leading-[24px] tracking-custom text-center text-light-black">Guest
                            with ticket ID HP092W2 has been successfully checked in.</p>
                    </div>
                </div>
                <div className="mt-[40px]">
                    <button className="auth-button px-[14px] p-[10px] rounded-[12px] border-step-color shadow-custom-bottom" onClick={toggle}>
                        <p className="font-sans font-semi-normal text-[16px] text-white">Done</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CheckedInModal;