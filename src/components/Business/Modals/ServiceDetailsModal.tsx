import React from 'react';
import CloseIcon from "@/image/icons/close.svg";
import Image from "next/image";
import business_logo from "@/image/business/JobLogo.png";
import medal from "@/image/icons/medal.png";
import ClockIconOrange from "@/image/icons/ClockIconOrange.svg"
import {Button} from "@/components/ui/button";

type ServiceDetailsInterface = {
    isOpen: boolean,
    toggleMenu: () => void
}

const ServiceDetailsModal:React.FC<ServiceDetailsInterface> = ({isOpen, toggleMenu}) => {
    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[640px] p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggleMenu}>
                            <CloseIcon/>
                        </div>
                        <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">Service details</p>
                    </div>
                </div>
                <div className="mt-10">
                    <div className="rounded-[12px] p-[16px] bg-cover bg-center bg-no-repeat"
                         style={{backgroundImage: `url('/images/business-bg.png')`}}>
                        <div className="flex flex-col">
                            <div className="flex justify-center">
                                <Image src={business_logo} alt="logo"
                                       className="rounded-[16px] border-[1px] border-step-color flex justify-center"/>
                            </div>
                            <div className="flex justify-center flex-col mt-[8px]">
                                <p className="text-center font-semibold text-[16px]">Global technology</p>
                                <p className="text-center font-semi-normal text-[14px] text-text-grey">Lagos,
                                    Nigeria</p>
                                <p className="text-center mt-[4px] text-[16px] font-semibold">N2,000/hr</p>
                            </div>
                            <div className="flex justify-center mt-[8px]">
                                <div
                                    className="flex items-center gap-1 bg-mid-grey p-2 rounded-xl justify-center w-fit">
                                    <div>
                                        <Image src={medal} alt="medal" width={16}/>
                                    </div>
                                    <div>
                                        <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-primary-black">4.5</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col mt-[24px]">
                        <p className="font-normal text-[14px] text-text-grey">Service status</p>
                        <div
                            className="p-[2px] px-[8px] rounded-[12px] bg-warning w-fit flex items-center gap-2 mt-[8px]">
                            <ClockIconOrange/>
                            <p className="font-semi-normal text-[14px] text-warning-bold">In progress</p>
                        </div>
                        <p className="font-normal text-[14px] text-text-grey mt-[24px]">Amount</p>
                        <p className="font-semibold text-[18px]">N2,000</p>
                        <p className="font-normal text-[14px] text-text-grey mt-[24px]">Required services</p>
                        <p className="font-normal text-[16px] text-light-black">UI designs, Graphic design, Mock up
                            designs</p>
                        <p className="font-normal text-[14px] text-text-grey mt-[24px]">Additional information</p>
                        <p className="font-normal text-[16px] text-light-black">I want to design a website with 5 internal pages</p>
                        <div className="mt-[40px] flex justify-center gap-3 mb-[10px]">
                            <Button className="bg-gradient-green p-[14px] px-[48px] h-[48px] rounded-[12px] shadow-custom-bottom w-full">
                                <p className="font-semi-normal text-[16px]">Mark as completed</p>
                            </Button>
                            <Button className="bg-white border-[1px] border-light-grey-50 p-[14px] px-[48px] h-[48px] rounded-[12px] shadow-none w-full">
                                <p className="font-semi-normal text-[16px] text-black-light">Dispute</p>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ServiceDetailsModal;