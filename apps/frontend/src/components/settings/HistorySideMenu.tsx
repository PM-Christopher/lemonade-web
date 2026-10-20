import React from "react";
import dayjs from "dayjs";
import CloseIcon from "@/images/icons/close.svg";

type HistorySideMenuInterface = {
  title: string;
  isOpen: boolean;
  toggleMenu: () => void;
  children: React.ReactNode;
};

// Slide-in panel shared by the wallet's history lists.
const HistorySideMenu: React.FC<HistorySideMenuInterface> = ({
  title,
  isOpen,
  toggleMenu,
  children,
}) => (
  <>
    <div
      className={`fixed top-0 right-0 z-50 h-full transform bg-gray-800/50 transition-transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="laptop:w-146.25 h-full w-screen overflow-y-auto bg-white pt-6">
        <div className="flex items-center justify-between px-6">
          <p className="tracking-custom text-body-l font-sans font-semibold">{title}</p>
          <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggleMenu}>
            <CloseIcon />
          </button>
        </div>
        <div className="mt-4 flex flex-col px-6">{children}</div>
      </div>
    </div>
    {isOpen && (
      <div className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm" onClick={toggleMenu} />
    )}
  </>
);

export default HistorySideMenu;

// "23, Mar 2023. 05:00PM", as in the design.
export const formatHistoryDate = (value: string) =>
  dayjs(value).isValid() ? dayjs(value).format("D, MMM YYYY. hh:mmA") : value;
