"use client"
import React, {useState} from 'react';
import ChevronRight from "@/image/icons/ChevronRight.svg"
import SideMenuEventCard from "@/components/Events/SideMenuEventCard";
import PromotionsSubMenu from "@/components/Events/views/Agent/Promotions";
import FindEventSubMenu from "@/components/Events/views/Agent/FindEvent";

function AgentSectionView({}) {
    const [view, setView] = useState("promotions")
    const renderView = () => {
        switch (view) {
            case "promotions":
                return <PromotionsSubMenu />
            case "find_event":
                return <FindEventSubMenu />
            default:
                return <PromotionsSubMenu />
        }
    }
    return (
        <section className="min-h-screen mt-4 flex flex-col items-center">
            <div className="flex gap-[24px]">
                <div>
                    <div className="w-[550px] p-[16px] bg-white rounded-[12px]">
                        <div className="flex flex-col">
                            <p className="font-sans font-normal text-text-grey text-[14px]">All time commission</p>
                            <p className="font-sans font-semibold text-[18px] tracking-custom leading-[27px]">3000</p>
                            <div className="border-t-mid-grey border-t-[1px] my-[16px]"></div>
                            <p className="font-sans font-normal text-text-grey text-[14px]">Total Tickets Sold</p>
                            <p className="font-sans font-semibold text-[18px] tracking-custom leading-[27px]">1,222,000</p>
                            <div className="border-t-mid-grey border-t-[1px] my-[16px]"></div>
                            <div className="flex gap-2 items-center cursor-pointer">
                                <p className="font-sans font-semi-normal text-[16px] text-light-green tracking-custom leading-[27px]">Go
                                    to Wallet</p>
                                <ChevronRight />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="p-[16px] bg-white rounded-[12px]">
                        <div className="flex justify-between mt-[10px] border-b-[1px] border-b-mid-grey mb-[10px]">
                            <div className={`h-10 w-[276.5px] py-[8px] px-[16px] cursor-pointer ${view === "promotions" && "border-b-step-color border-b-2"}`} onClick={() => setView("promotions")}>
                                <p className="text-center font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">Promotions</p>
                            </div>
                            <div className={`h-10 w-[276.5px] py-[8px] px-[16px] cursor-pointer ${view === "find_event" && "border-b-step-color border-b-2"}`} onClick={() => setView("find_event")}>
                                <p className="text-center font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">Find events</p>
                            </div>
                        </div>
                        {renderView()}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AgentSectionView;