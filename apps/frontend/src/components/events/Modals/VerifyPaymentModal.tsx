import React from 'react';
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import moment from "moment"

type VPInterface = {
    toggle: () => void,
    toggleMore: () => void,
    isOpen: boolean,
    event: any
}

const VerifyPaymentModal: React.FC<VPInterface> = ({toggle, isOpen, event, toggleMore}) => {
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
                        <Image src={"/images/tickets.png"} alt="promotion_payment" width={160} height={160}/>
                    </div>
                </div>
                <div className="mt-[24px]">
                    <div className="flex flex-col">
                        <p className="font-sans font-semibold text-[20px] leading-[28px] text-center text-light-green">Payment
                            successful!</p>
                        <p className="font-sans font-normal text-[14px] leading-[24px] tracking-custom text-center text-light-black">
                            Tickets have been sent to the email addresses of all the attending guests.
                        </p>
                    </div>
                </div>
                <div className="mt-[24px]">
                    <div className="flex flex-col">
                        <p className="font-sans font-semibold text-[20px] leading-[20px]">{event?.data?.event?.event_name}</p>
                    </div>
                </div>
                <div className="mt-[24px]">
                    <div className="flex flex-col">
                        <p className="font-sans font-normal text-[14px] text-text-grey leading-[20px]">Date</p>
                        <p className="font-sans font-semi-normal text-[14px] text-light-black-[20px] tracking-custom leading-[21px]">
                            {moment(event?.data?.event?.start_date).format("ddd, MMM DD").toUpperCase()}
                        </p>
                    </div>
                </div>
                <div className="mt-[24px]">
                    <div className="flex flex-col">
                        <p className="font-sans font-normal text-[14px] text-text-grey leading-[20px]">Time</p>
                        <p className="font-sans font-semi-normal text-[14px] text-light-black-[20px] tracking-custom leading-[21px]">
                            {moment(event?.data?.event?.start_date).format("h A").toUpperCase()}
                        </p>
                    </div>
                </div>
                {/*<div className="mt-[24px]">*/}
                {/*    <div className="flex flex-col">*/}
                {/*        <p className="font-sans font-normal text-[14px] text-text-grey leading-[20px]">Ticket Type</p>*/}
                {/*        <p className="font-sans font-semi-normal text-[14px] text-light-black-[20px] tracking-custom leading-[21px]">1</p>*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<div className="mt-[24px]">*/}
                {/*    <div className="flex flex-col">*/}
                {/*        <p className="font-sans font-normal text-[14px] text-text-grey leading-[20px]">Ticket ID</p>*/}
                {/*        <p className="font-sans font-semi-normal text-[14px] text-light-black-[20px] tracking-custom leading-[21px]">₦500,000</p>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="mt-[40px] flex gap-[4px]">
                    <button
                        className="w-full px-[14px] p-[10px] rounded-[12px] border-[1px] border-light-grey-50"
                        onClick={toggle}>
                        <p className="font-sans font-semi-normal text-[16px] text-black-light">More events</p>
                    </button>
                    <button
                        className="auth-button px-[14px] p-[10px] rounded-[12px] border-step-color shadow-custom-bottom"
                        onClick={toggleMore}>
                        <p className="font-sans font-semi-normal text-[16px] text-white">My tickets</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VerifyPaymentModal;