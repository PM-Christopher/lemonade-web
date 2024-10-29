import React from 'react';
import CloseIcon from "@/images/icons/close.svg";

type ReferralSideMenuInterface = {
    isOpen: boolean,
    toggleMenu: () => void
}

const ReferralSideMenu: React.FC<ReferralSideMenuInterface> = ({isOpen, toggleMenu}) => {
    return (
        <>
            <div
                className={`fixed top-0 right-0 z-50 bg-gray-800 bg-opacity-50 h-full transform transition-transform ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="w-[585px] h-full bg-white pt-[24px]">
                    <div className="flex justify-between items-center px-[24px]">
                        <div>
                            <p className="font-sans font-semibold text-[16px] leading-[24px] tracking-custom">Referral History</p>
                        </div>
                        <div>
                            <CloseIcon className="cursor-pointer" onClick={toggleMenu} />
                        </div>
                    </div>

                    <div className="flex flex-col mt-[16px] px-[24px]">
                        <div className="flex flex-col pt-[16px] pb-[24px]">
                            <p className="font-semi-normal text-[14px]">N2,000 - Subscription</p>
                            <p className="font-normal text-[12px] text-text-grey">23, Mar 2023. 05:00PM</p>
                        </div>
                        <div className="flex flex-col pt-[16px] pb-[24px]">
                            <p className="font-semi-normal text-[14px]">N2,000 - Subscription</p>
                            <p className="font-normal text-[12px] text-text-grey">23, Mar 2023. 05:00PM</p>
                        </div>
                        <div className="flex flex-col pt-[16px] pb-[24px]">
                            <p className="font-semi-normal text-[14px]">N2,000 - Subscription</p>
                            <p className="font-normal text-[12px] text-text-grey">23, Mar 2023. 05:00PM</p>
                        </div>
                        <div className="flex flex-col pt-[16px] pb-[24px]">
                            <p className="font-semi-normal text-[14px]">N2,000 - Subscription</p>
                            <p className="font-normal text-[12px] text-text-grey">23, Mar 2023. 05:00PM</p>
                        </div>
                    </div>
                </div>
            </div>
            {
                isOpen && (
                    <div
                        className={`fixed z-10 inset-0 transition-all duration-300 ${
                            isOpen ? 'bg-black bg-opacity-50 backdrop-blur-sm' : 'bg-transparent'
                        }`}
                        onClick={toggleMenu}
                    ></div>
                )
            }
        </>
    );
}

export default ReferralSideMenu;