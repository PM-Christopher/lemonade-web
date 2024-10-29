import React from 'react';
import CloseIcon from "@/images/icons/close.svg";

const BoostDetailsModal = ({ boost, isOpen, toggleMenu }: {boost: any, isOpen: boolean, toggleMenu: () => void}) => {
    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[480px]">
                <div className="flex justify-between items-center p-[4px] px-[16px] mt-[16px]">
                    <p className="font-semiBold text-[16px]">Boosting details</p>
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggleMenu}>
                            <CloseIcon/>
                        </div>
                    </div>
                </div>
                <div className="mt-[16px] flex flex-col">
                    <div className="flex flex-col p-[16px]">
                        <div className="flex justify-between items-center">
                            <p className="font-normal text-[14px] text-text-grey">Package</p>
                            <p className="font-semi-normal text-[14px]">Featured</p>
                        </div>
                        <div className="flex justify-between items-center  mt-[24px]">
                            <p className="font-normal text-[14px] text-text-grey">Duration</p>
                            <p className="font-semi-normal text-[14px]">{boost?.duration} days</p>
                        </div>
                        <div className="flex justify-between items-center mt-[24px]">
                            <p className="font-normal text-[14px] text-text-grey">Start date</p>
                            <p className="font-semi-normal text-[14px]">{boost?.full_start_date}</p>
                        </div>
                        <div className="flex justify-between items-center mt-[24px]">
                            <p className="font-normal text-[14px] text-text-grey">End date</p>
                            <p className="font-semi-normal text-[14px]">{boost?.full_end_date}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BoostDetailsModal;