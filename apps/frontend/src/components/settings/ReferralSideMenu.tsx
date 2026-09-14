import React from "react";
import CloseIcon from "@/images/icons/close.svg";

type ReferralSideMenuInterface = {
  isOpen: boolean;
  toggleMenu: () => void;
};

const ReferralSideMenu: React.FC<ReferralSideMenuInterface> = ({ isOpen, toggleMenu }) => {
  return (
    <>
      <div
        className={`fixed right-0 top-0 z-50 h-full transform bg-gray-800 bg-opacity-50 transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full w-screen bg-white pt-[24px] laptop:w-[585px]">
          <div className="flex items-center justify-between px-[24px]">
            <div>
              <p className="font-sans text-[16px] font-semibold leading-[24px] tracking-custom">
                Referral History
              </p>
            </div>
            <div>
              <CloseIcon className="cursor-pointer" onClick={toggleMenu} />
            </div>
          </div>

          <div className="mt-[16px] flex flex-col px-[24px]">
            <div className="flex flex-col pb-[24px] pt-[16px]">
              <p className="text-[14px] font-semi-normal">N2,000 - Subscription</p>
              <p className="text-[12px] font-normal text-text-grey">23, Mar 2023. 05:00PM</p>
            </div>
            <div className="flex flex-col pb-[24px] pt-[16px]">
              <p className="text-[14px] font-semi-normal">N2,000 - Subscription</p>
              <p className="text-[12px] font-normal text-text-grey">23, Mar 2023. 05:00PM</p>
            </div>
            <div className="flex flex-col pb-[24px] pt-[16px]">
              <p className="text-[14px] font-semi-normal">N2,000 - Subscription</p>
              <p className="text-[12px] font-normal text-text-grey">23, Mar 2023. 05:00PM</p>
            </div>
            <div className="flex flex-col pb-[24px] pt-[16px]">
              <p className="text-[14px] font-semi-normal">N2,000 - Subscription</p>
              <p className="text-[12px] font-normal text-text-grey">23, Mar 2023. 05:00PM</p>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className={`fixed inset-0 z-10 transition-all duration-300 ${
            isOpen ? "bg-black bg-opacity-50 backdrop-blur-sm" : "bg-transparent"
          }`}
          onClick={toggleMenu}
        ></div>
      )}
    </>
  );
};

export default ReferralSideMenu;
