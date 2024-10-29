import React from 'react';
import CloseIcon from "@/images/icons/close.svg";
import {ChevronRight} from "lucide-react";
import {useRouter} from "next/navigation";

type ReferralHistoryInterface = {
    toggle: () => void,
    isOpen: boolean
}

const ReferralHistory: React.FC<ReferralHistoryInterface> = ({isOpen, toggle}) => {
    const router = useRouter()
    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[640px] p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon className="w-[11.25px]"/>
                        </div>
                        <p className="font-semibold text-[16px]">Referral activity</p>
                    </div>
                </div>
                <div className="mt-[24px]">
                    <div className="flex flex-col border-[2px] border-mid-grey p-[16px] rounded-[12px]">
                        <div className="flex flex-col p-[16px] border-b-[1px] border-b-mid-grey">
                            <p className="font-normal text-[14px] text-text-grey">Total Amount Earned</p>
                            <p className="font-semibold text-[18px] tracking-custom">N22,000</p>
                        </div>
                        <div className="flex flex-col p-[16px] border-b-[1px] border-b-mid-grey">
                            <p className="font-normal text-[14px] text-text-grey">Total referrals</p>
                            <p className="font-semibold text-[18px] tracking-custom">300</p>
                        </div>
                        <div className="flex flex-col p-[16px] border-b-[1px] border-b-mid-grey">
                            <p className="font-normal text-[14px] text-text-grey">Total subscribed referrals</p>
                            <p className="font-semibold text-[18px] tracking-custom">300</p>
                        </div>
                        <div className="flex p-[12px] px-[16px] gap-[8px] items-center cursor-pointer" onClick={() => router.push("/settings/wallet")}>
                            <p className="font-semi-normal text-[16px] text-light-green">Go to wallet</p>
                            <ChevronRight />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReferralHistory;