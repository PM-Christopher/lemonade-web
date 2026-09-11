import React from 'react';
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import {Button} from "@/components/ui/button";

type PayoutInterface = {
    isOpen: boolean,
    toggle: () => void
}

const PayoutModal:React.FC<PayoutInterface> = ({isOpen, toggle}) => {
    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[480px] p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon/>
                        </div>
                    </div>
                </div>
                <div className="mt-10">
                    <div className="flex flex-col items-center">
                        <div>
                            <Image src={"/images/Payout.png"} alt="payout" width={311} height={160}/>
                        </div>
                        <div className="mt-[24px]">
                            <p className="font-semibold text-[20px] text-center">Payout requested</p>
                            <p className="max-w-[416px] text-center font-normal text-[16px]">Your payment is being
                                processed and will be disbursed into the account details provided below</p>
                        </div>
                        <div className="p-[16px] rounded-[12px] bg-light-tint mt-[24px] w-full">
                            <div className="bg-light-tint-3 p-[8px] rounded-[12px]">
                                <p className="text-center font-normal text-text-grey text-[12px]">Payout amount</p>
                                <p className="text-center font-semibold text-black-light text-[20px]">N2,000</p>
                            </div>
                            <div className="flex justify-between my-[16px]">
                                <p className="font-normal text-[14px]">Account name</p>
                                <p className="font-semi-normal text-[14px]">Christine Joseph</p>
                            </div>
                            <div className="flex justify-between my-[16px]">
                                <p className="font-normal text-[14px]">Bank name</p>
                                <p className="font-semi-normal text-[14px]">United Bank for Africa</p>
                            </div>
                            <div className="flex justify-between my-[16px]">
                                <p className="font-normal text-[14px]">Account number</p>
                                <p className="font-semi-normal text-[14px]">0823212345</p>
                            </div>
                        </div>

                        <Button className="px-[48px] p-[14px] rounded-[12px] border-step-color shadow-custom-bottom mt-[48px] w-full bg-gradient-green h-[48px]">
                            <p>Done</p>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PayoutModal;