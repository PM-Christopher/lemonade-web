import React from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/image/icons/chevron-left.svg";
import PricingCard from "@/components/Settings/PricingCard";
import {Button} from "@/components/ui/button";

const PricingPage = () => {
    return (
        <section className="bg-light_grey pb-10">
            <TopNav/>
            <div className="bg-white flex justify-between p-[8px] px-[64px] border-t-[1px] border-b-[1px] items-center">
                <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                    <ChevronLeft/>
                    <p className="font-sans font-semibold text-[16px] tracking-custom">Pricing</p>
                </div>
            </div>

            <section className="min-h-screen mt-[48px] flex flex-col items-center">
                <div className="flex gap-[48px]">
                    <PricingCard active={false}/>
                    <PricingCard active={true}/>
                </div>
            </section>
        </section>
    );
}

export default PricingPage;