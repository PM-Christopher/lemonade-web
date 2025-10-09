import React from 'react';
import CloseIcon from "@/images/icons/close.svg";
import ChevronRightFilled from "@/images/icons/chevronRightFilled.svg";

type PDInterface = {
    toggle: () => void,
    isOpen: boolean,
    promotion: any
}

const PromotionDetailsModal: React.FC<PDInterface> = ({toggle, isOpen, promotion}) => {
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
                <div className="mt-[24px]">
                    <div className="flex flex-col">
                        <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">
                            {promotion?.name}
                        </p>
                        {
                            promotion?.status === 'active' ? (
                                <div className="bg-light-green-60 p-[4px] px-[8px] w-fit rounded-[8px]">
                                    <p className="font-sans font-normal text-[14px] leading-[24px] tracking-custom text-light-green-70">Active</p>
                                </div>
                            ) : (
                                <div className="bg-warning p-[4px] px-[8px] w-fit rounded-[8px]">
                                    <p className="font-sans font-normal text-[14px] leading-[24px] tracking-custom text-warning-bold">Pending</p>
                                </div>
                            )
                        }
                        <div className="bg-green-tint p-[16px] rounded-[12px] mt-[16px]">
                            <p className="font-sans font-semibold text-[14px] leading-[24px] tracking-custom text-mid-green text-center">Scheduled
                                for {promotion?.promotion_date}</p>
                        </div>
                        <div className="bg-mid-grey p-[24px] rounded-[12px] mt-[16px]">
                            <p className="font-sans font-semibold text-[16px]">BREAKDOWN</p>
                            <div className="flex flex-col mt-[12px]">
                                {
                                    promotion?.breakdown.length > 0 && promotion?.breakdown.map((item:any, index: number) => (
                                        <div className="flex gap-[8px] items-center my-[10px]" key={index}>
                                            <ChevronRightFilled/>
                                            <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom text-black-light">
                                                {item}
                                            </p>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PromotionDetailsModal;