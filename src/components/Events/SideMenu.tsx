import React, {useState} from 'react';
import CloseIcon from "@/image/icons/close.svg";
import SideMenuEventCard from "@/components/Events/SideMenuEventCard";

type SideMenuInterface = {
    toggleMenu: () => void,
    isOpen: boolean
}

const SideMenu: React.FC<SideMenuInterface> = ({toggleMenu, isOpen}) => {
    return (
        <>
            <div
                className={`fixed top-0 right-0 z-50 bg-gray-800 bg-opacity-50 h-full transform transition-transform ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="w-[585px] h-full bg-white p-[48px] px-[20px]">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-sans font-semibold text-[16px] leading-[24px] tracking-custom">My tickets</p>
                        </div>
                        <div>
                            <CloseIcon className="cursor-pointer" onClick={toggleMenu} />
                        </div>
                    </div>
                    <div className="flex justify-between mt-[10px] border-b-[1px] border-b-light-grey-50">
                        <div className="h-10 w-[276.5px] py-[8px] px-[16px] border-b-step-color border-b-2">
                            <p className="text-center font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">Upcoming events</p>
                        </div>
                        <div className="h-10 w-[276.5px] py-[8px] px-[16px]">
                            <p className="text-center font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">Past events</p>
                        </div>
                    </div>
                    <SideMenuEventCard />
                    <SideMenuEventCard />
                    <SideMenuEventCard />
                    <SideMenuEventCard />
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

export default SideMenu;