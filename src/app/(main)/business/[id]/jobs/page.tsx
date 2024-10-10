"use client"
import React, {useState} from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/image/icons/chevron-left.svg";
import ChevronRight from "@/image/icons/ChevronRight.svg";
import JobsCard from "@/components/Business/JobsCard";
import ServiceDetailsModal from "@/components/Business/Modals/ServiceDetailsModal";

const JobsPage = () => {

    const [isOpen, setIsOpen] = useState(false)

    const detailsToggle = () => {
        setIsOpen(!isOpen)
    }
    return (
        <section className="bg-light_grey pb-10">
            <TopNav/>
            <div className="bg-white flex justify-between p-[12px] px-10 border-b-grey-20 border-t-grey-20 border-t-[1px] border-b-[1px] items-center">
                <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                    <ChevronLeft/>
                    <p className="font-sans font-semibold text-[16px] tracking-custom">Jobs</p>
                </div>
            </div>
            <section className="min-h-screen mt-4 flex flex-col items-center">
                <div className="flex gap-4">
                    <div>
                        <div className="w-[580px] p-[16px] bg-white rounded-[12px]">
                            <div className="flex flex-col">
                                <p className="font-sans font-normal text-text-grey text-[14px]">Revenue</p>
                                <p className="font-sans font-semibold text-[18px] tracking-custom leading-[27px]">N322,000</p>
                                <div className="border-t-mid-grey border-t-[1px] my-[16px]"></div>
                                <p className="font-sans font-normal text-text-grey text-[14px]">In-progress</p>
                                <p className="font-sans font-semibold text-[18px] tracking-custom leading-[27px]">5</p>
                                <div className="border-t-mid-grey border-t-[1px] my-[16px]"></div>
                                <p className="font-sans font-normal text-text-grey text-[14px]">Completed</p>
                                <p className="font-sans font-semibold text-[18px] tracking-custom leading-[27px]">4</p>
                                <div className="border-t-mid-grey border-t-[1px] my-[16px]"></div>
                                <p className="font-sans font-normal text-text-grey text-[14px]">Requests</p>
                                <p className="font-sans font-semibold text-[18px] tracking-custom leading-[27px]">4</p>
                                <div className="border-t-mid-grey border-t-[1px] my-[16px]"></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="bg-white rounded-[12px] h-screen">
                            <div
                                className="w-[684px] border-b-grey-20 border-b-[1px] pt-4 px-[32px] flex justify-between">
                                <div className="h-10 w-[276.5px] border-b-step-color border-b-2">
                                    <p className="text-center font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">In-progress</p>
                                </div>
                                <div className="h-10 w-[276.5px]">
                                    <p className="text-center font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">Completed</p>
                                </div>
                                <div className="h-10 w-[276.5px]">
                                    <p className="text-center font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">Sent offers</p>
                                </div>
                            </div>
                            <div className="p-[16px] px-[32px]">
                                <JobsCard toggle={detailsToggle} />
                                <JobsCard toggle={detailsToggle} />
                                <JobsCard toggle={detailsToggle} />
                                <JobsCard toggle={detailsToggle} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ServiceDetailsModal isOpen={isOpen} toggleMenu={detailsToggle} />
        </section>
    );
}

export default JobsPage;