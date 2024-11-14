import React from 'react';
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import StrikeLine from "@/images/icons/strikeLine.svg"
import CopyIcon from "@/images/icons/copyIcon.svg"

type AffiliateLinkInterface = {
    isOpen: boolean,
    toggle: () => void
}

const AffiliateLinkModal: React.FC<AffiliateLinkInterface> = ({isOpen, toggle}) => {
    return (
        <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-full laptop:w-[480px] p-6 h-screen laptop:h-full">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon/>
                        </div>
                    </div>
                </div>
                <div className="mt-0 laptop:mt-10 flex flex-col justify-center h-full">
                    <div className="flex justify-center">
                        <Image src={"/images/affliliateLink.png"} alt="affiliate-link" width={200} height={200} />
                    </div>
                    <div className="flex flex-col mt-[24px]">
                        <p className="font-semibold text-[20px] text-center">Linked generated!</p>
                        <p className="font-normal text-[16px] text-center mt-[8px]">You have successfully joined this affiliate program. Share your link and start earning now</p>
                    </div>
                    <div className="p-[16px] rounded-[12px] gap-[16px] bg-light-tint mt-[24px] mb-[28px]">
                        <p className="font-semi-normal text-text-grey text-[14px]">Affiliate link</p>
                        <div className="p-[12px] rounded-[12px] gap-[8px] bg-light-tint-3 mt-[8px] flex items-center">
                            <p className="font-semi-normal text-light-black truncate">https://www.lemonade.com/Event_nameID/ref...</p>
                            <StrikeLine />
                            <CopyIcon />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AffiliateLinkModal;