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
        className={`bg-opacity-50 fixed top-0 right-0 z-50 h-full transform bg-gray-800 transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="laptop:w-[585px] h-full w-screen bg-white pt-6">
          <div className="flex items-center justify-between px-6">
            <div>
              <p className="tracking-custom font-sans text-[16px] leading-[24px] font-semibold">
                Referral History
              </p>
            </div>
            <div>
              <CloseIcon className="cursor-pointer" onClick={toggleMenu} />
            </div>
          </div>

          <div className="mt-4 flex flex-col px-6">
            <div className="flex flex-col pt-4 pb-6">
              <p className="font-semi-normal text-[14px]">N2,000 - Subscription</p>
              <p className="text-text-grey text-[12px] font-normal">23, Mar 2023. 05:00PM</p>
            </div>
            <div className="flex flex-col pt-4 pb-6">
              <p className="font-semi-normal text-[14px]">N2,000 - Subscription</p>
              <p className="text-text-grey text-[12px] font-normal">23, Mar 2023. 05:00PM</p>
            </div>
            <div className="flex flex-col pt-4 pb-6">
              <p className="font-semi-normal text-[14px]">N2,000 - Subscription</p>
              <p className="text-text-grey text-[12px] font-normal">23, Mar 2023. 05:00PM</p>
            </div>
            <div className="flex flex-col pt-4 pb-6">
              <p className="font-semi-normal text-[14px]">N2,000 - Subscription</p>
              <p className="text-text-grey text-[12px] font-normal">23, Mar 2023. 05:00PM</p>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className={`fixed inset-0 z-10 transition-all duration-300 ${
            isOpen ? "bg-opacity-50 bg-black backdrop-blur-sm" : "bg-transparent"
          }`}
          onClick={toggleMenu}
        ></div>
      )}
    </>
  );
};

export default ReferralSideMenu;
