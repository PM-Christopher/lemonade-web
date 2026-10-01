import React from "react";
import { ChevronDown, SearchIcon, XIcon } from "lucide-react";
import FlameIcon from "@/icons/flameIcon.svg";
import ThreadCard from "@/components/tribes/ThreadCard";
import TribeDetails from "@/components/tribes/TribeDetails";

interface TribeModalProps {
  toggle: () => void;
  isOpen: boolean;
}

const TribeModal: React.FC<TribeModalProps> = ({ toggle, isOpen }) => {
  return (
    <>
      <div
        className={`bg-opacity-50 fixed top-0 right-0 z-50 h-full transform p-4 transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full w-[1152px] rounded-[12px] bg-white p-[48px] px-[20px]">
          <div className="flex items-center justify-between gap-4 border-b-[1px] pb-5">
            <div className="flex cursor-pointer items-center gap-2">
              <div>
                <p className="font-sans text-[16px] leading-[24px] font-semibold">Tribe name</p>
              </div>
            </div>
            <div>
              <XIcon className="cursor-pointer" onClick={toggle} />
            </div>
          </div>

          <div className={"flex h-full flex-row gap-6 p-2"}>
            <div className={"h-full border-r-[1px]"}>
              <div className={"flex flex-col gap-3 pr-[20px]"}>
                <div className={"flex justify-between gap-[16px]"}>
                  <div className="bg-light_grey bg-light-grey flex h-[40px] w-[430px] items-center gap-3 rounded-[12px] px-[16px]">
                    <div>
                      <SearchIcon className={"w-[12px]"} />
                    </div>
                    <div className="w-full">
                      <input
                        id="search"
                        type="text"
                        className="w-full rounded-xl border-0 bg-transparent text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                        placeholder="Search tribe"
                      />
                    </div>
                  </div>
                  <div
                    className={
                      "bg-mid-grey flex h-[40px] w-[180px] items-center justify-between rounded-[12px] px-[16px] py-[10px]"
                    }
                  >
                    <div className={"flex items-center gap-[8px]"}>
                      <FlameIcon className="h-4 w-4" aria-hidden="true" />
                      <p className={"text-text-grey text-[14px] font-medium"}>Popular</p>
                    </div>
                    <ChevronDown className={"text-text-grey w-[20px]"} />
                  </div>
                </div>
                <ThreadCard />
                <ThreadCard />
              </div>
            </div>
            <TribeDetails />
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className={`fixed inset-0 z-10 transition-all duration-300 ${
            isOpen ? "bg-opacity-50 bg-black backdrop-blur-sm" : "bg-transparent"
          }`}
          onClick={toggle}
        ></div>
      )}
    </>
  );
};

export default TribeModal;
