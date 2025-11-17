import React from 'react';
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {formatNumberWithCommas} from "@/lib/formatNumber";
import {useRouter} from "next/navigation";

const PaymentConfirmModal = ({isOpen, job, toggleMenu}: {isOpen: boolean, toggleMenu: () => void, job: any}) => {
    const router = useRouter()
    const backToBusiness = () => {
        toggleMenu()
        const currentPath = window.location.pathname;
        router.push(currentPath);
    }
    return (
        <div
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 
        ${isOpen ? "flex" : "hidden"} items-center justify-center p-4`}
        >
            <div
                className="
            bg-white rounded-2xl shadow-xl
            w-full max-w-[480px]
            p-6 animate-[fadeIn_0.25s_ease-out]
            max-h-[90vh] overflow-y-auto hide-scrollbar
        "
            >
                {/* Close Button */}
                <div className="flex justify-end">
                    <button
                        onClick={toggleMenu}
                        className="p-2 rounded-lg hover:bg-gray-100 transition"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Icon */}
                <div className="flex justify-center mt-4">
                    <Image
                        src={"/images/jobVerified.png"}
                        alt="Payment Verified"
                        width={160}
                        height={160}
                    />
                </div>

                {/* Title & Description */}
                <div className="mt-6 text-center px-4">
                    <p className="font-semibold text-[22px] text-light-green">
                        Payment successful
                    </p>
                    <p className="text-[14px] text-text-grey mt-2">
                        Your payment has been securely received and held until the service is completed.
                    </p>
                </div>

                {/* Amount */}
                <div className="mt-6">
                    <p className="text-[14px] text-text-grey">Amount paid</p>
                    <p className="text-[22px] font-semibold mt-1">
                        N{formatNumberWithCommas(job?.amount)}
                    </p>
                </div>

                {/* Business Name */}
                <div className="mt-5">
                    <p className="text-[14px] text-text-grey">Business name</p>
                    <p className="text-[16px] font-medium text-light-black">
                        {job?.name}
                    </p>
                </div>

                {/* Services Rendered */}
                <div className="mt-5">
                    <p className="text-[14px] text-text-grey">Services rendered</p>
                    <p className="text-[16px] font-medium text-light-black">
                        {job?.services?.length}
                    </p>
                </div>

                {/* Payment Date */}
                <div className="mt-5">
                    <p className="text-[14px] text-text-grey">Payment date</p>
                    <p className="text-[16px] font-medium text-light-black">
                        {job?.updated_at}
                    </p>
                </div>

                {/* Button */}
                <Button
                    className="
                bg-gradient-green w-full h-[48px]
                mt-8 rounded-xl shadow-md
                hover:shadow-lg transition
            "
                    onClick={backToBusiness}
                    type="button"
                >
                    <p className="text-white text-[16px] font-medium">View service</p>
                </Button>
            </div>
        </div>

    );
}

export default PaymentConfirmModal;