import React from 'react';
import CloseIcon from "@/image/icons/close.svg";
import Image from "next/image";
import PromotionImage from "@/image/PromoteEventIcon.png";

type PSInterface = {
    toggle: () => void,
    isOpen: boolean
}

const PaymentSuccessfulModal: React.FC<PSInterface> = ({toggle, isOpen}) => {
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
                        <Image src={PromotionImage} alt="promotion_payment"/>
                    </div>
                </div>
                <div className="mt-[24px]">
                    <div className="flex flex-col">
                        <p className="font-sans font-semibold text-[20px] leading-[28px] text-center text-light-green">Payment
                            successful!</p>
                        <p className="font-sans font-normal text-[14px] leading-[24px] tracking-custom text-center text-light-black">Your
                            payment has been processed. You will get an update on when your event is scheduled for
                            promotion.</p>
                    </div>
                </div>
                <div className="mt-[24px]">
                    <div className="flex flex-col">
                        <p className="font-sans font-semibold text-[20px] leading-[20px]">Instagram Feed Post</p>
                    </div>
                </div>
                <div className="mt-[24px]">
                    <div className="flex flex-col">
                        <p className="font-sans font-normal text-[14px] text-text-grey leading-[20px]">Date</p>
                        <p className="font-sans font-semi-normal text-[14px] text-light-black-[20px] tracking-custom leading-[21px]">SAT,
                            MAR 30</p>
                    </div>
                </div>
                <div className="mt-[24px]">
                    <div className="flex flex-col">
                        <p className="font-sans font-normal text-[14px] text-text-grey leading-[20px]">Unit</p>
                        <p className="font-sans font-semi-normal text-[14px] text-light-black-[20px] tracking-custom leading-[21px]">1</p>
                    </div>
                </div>
                <div className="mt-[24px]">
                    <div className="flex flex-col">
                        <p className="font-sans font-normal text-[14px] text-text-grey leading-[20px]">Amount</p>
                        <p className="font-sans font-semi-normal text-[14px] text-light-black-[20px] tracking-custom leading-[21px]">₦500,000</p>
                    </div>
                </div>
                <div className="mt-[40px]">
                    <button
                        className="auth-button px-[14px] p-[10px] rounded-[12px] border-step-color shadow-custom-bottom"
                        onClick={toggle}>
                        <p className="font-sans font-semi-normal text-[16px] text-white">Go to business</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaymentSuccessfulModal;