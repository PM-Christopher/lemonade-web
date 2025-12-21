import React from 'react';
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import StrikeLine from "@/images/icons/strikeLine.svg"
import CopyIcon from "@/images/icons/copyIcon.svg"

type AffiliateLinkInterface = {
    isOpen: boolean,
    toggle: () => void
    item: string
}

const AffiliateLinkModal: React.FC<AffiliateLinkInterface> = ({isOpen, toggle, item}) => {
    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? "flex" : "hidden"} items-center justify-center`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
                onClick={toggle}
            />

            {/* Centering wrapper with top/bottom padding */}
            <div className="relative w-[480px] px-4 sm:px-6 py-6 sm:py-10 flex items-center justify-center">
                {/* Modal */}
                <div
                    className="
        relative w-full sm:max-w-[520px]
        bg-white shadow-2xl rounded-2xl
        p-4 sm:p-6
        max-h-[calc(100vh-48px)] sm:max-h-[calc(100vh-80px)]
        overflow-y-auto
        animate-in fade-in zoom-in-95
      "
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-700"/>

                        <button
                            type="button"
                            onClick={toggle}
                            className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition"
                            aria-label="Close"
                        >
                            <CloseIcon/>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="mt-3 sm:mt-6">
                        <div className="flex justify-center">
                            <div className="relative w-[160px] h-[160px] sm:w-[200px] sm:h-[200px]">
                                <Image
                                    src="/images/affliliateLink.png"
                                    alt="affiliate-link"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="font-semibold text-[18px] sm:text-[20px]">Link generated!</p>
                            <p className="mt-2 text-[14px] sm:text-[16px] text-text-grey">
                                You have successfully joined this affiliate program. Share your link and start earning
                                now.
                            </p>
                        </div>

                        <div className="mt-6 mb-2 rounded-2xl bg-light-tint p-4">
                            <p className="font-semi-normal text-text-grey text-[13px] sm:text-[14px]">Affiliate link</p>

                            <div className="mt-2 flex items-center gap-2 rounded-2xl bg-light-tint-3 p-3">
                                <p className="min-w-0 flex-1 truncate font-semi-normal text-light-black">
                                    {
                                        process.env.NEXT_PUBLIC_BASE_URL+"/"+item
                                    }
                                </p>

                                <div className="shrink-0 flex items-center gap-2">
                                    <StrikeLine/>
                                    <button
                                        type="button"
                                        onClick={() => navigator.clipboard.writeText(item)}
                                        className="p-2 rounded-xl hover:bg-black/5 active:bg-black/10 transition"
                                        aria-label="Copy affiliate link"
                                    >
                                        <CopyIcon/>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={toggle}
                            className="mt-4 w-full rounded-2xl bg-light-green-10 text-light-green py-3 font-semi-normal hover:bg-light-green-20 transition"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>


    );
}

export default AffiliateLinkModal;