import React from 'react';
import Image from "next/image";
import business_logo from "@/image/business/JobLogo.png";
import ChevronRight from "@/image/icons/ChevronRight.svg";

type JobCardInterface = {
    toggle: () => void
}

const JobsCard: React.FC<JobCardInterface> = ({toggle}) => {
    return (
        <>
            <div className="flex flex-col cursor-pointer" onClick={toggle}>
                <div className="flex justify-between">
                    <div className="flex gap-[8px]">
                        <Image src={business_logo} alt="logo"
                               className="rounded-[16px] border-[1px] border-step-color"/>
                        <div className="flex flex-col">
                            <p className="font-semi-normal text-[14px]">Product designer</p>
                            <p className="font-normal text-[12px] text-text-grey">Lagos, NG</p>
                        </div>
                    </div>
                    <ChevronRight onClick={toggle} className="cursor-pointer"/>
                </div>
                <div className="flex justify-between mt-[12px] items-center">
                    <div className="flex gap-2">
                        <div className="p-[2px] px-[8px] bg-grey-20 rounded-[12px]">
                            <p className="font-semi-normal text-[14px] text-text-grey">UI designs</p>
                        </div>
                        <div className="p-[2px] px-[8px] bg-grey-20 rounded-[12px]">
                            <p className="font-semi-normal text-[14px] text-text-grey">+3</p>
                        </div>
                    </div>
                    <p className="font-semibold text-[14px]">N22,000</p>
                </div>
            </div>
            <div className="border-b-[1px] border-b-mid-grey p-0 my-[16px]"></div>
        </>
    );
}

export default JobsCard;