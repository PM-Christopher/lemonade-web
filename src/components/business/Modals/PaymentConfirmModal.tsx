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
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[480px] p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggleMenu}>
                            <CloseIcon/>
                        </div>
                    </div>
                </div>
                <div className="mt-10 flex flex-col">
                    <div className="flex flex-col items-center">
                        <Image src={"/images/jobVerified.png"} alt="promote" width={160} height={160}/>
                    </div>
                    <div className="px-[10px]">
                        <div className="mt-[24px] flex flex-col items-center">
                            <p className="font-semiBold text-[20px] text-center text-light-green">Payment successful</p>
                            <p className="font-normal text-[14px] text-center">Your payment has been successfully received and held securely until service completion.</p>
                        </div>
                        <div className="mt-[24px]">
                            <p className="font-semiBold text-[20px]">N{formatNumberWithCommas(job?.amount)}</p>
                        </div>
                        <div className="flex flex-col mt-[24px]">
                            <p className="text-[14px] font-normal text-text-grey">Business name</p>
                            <p className="text-[14px] font-semi-normal text-light-black">
                                {job?.name}
                            </p>
                        </div>

                        <div className="flex flex-col mt-[16px]">
                            <p className="text-[14px] font-normal text-text-grey">Services rendered</p>
                            <p className="text-[14px] font-semi-normal text-light-black">
                                {job?.services?.length}
                            </p>
                        </div>

                        <div className="flex flex-col mt-[16px]">
                            <p className="text-[14px] font-normal text-text-grey">Payment date</p>
                            <p className="text-[14px] font-semi-normal text-light-black">
                                {job?.updated_at}
                            </p>
                        </div>
                    </div>

                    <Button className="bg-gradient-green w-full h-[48px] mt-[24px]"
                            onClick={backToBusiness}
                            type="button">
                        <p className="text-white">View service</p>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default PaymentConfirmModal;