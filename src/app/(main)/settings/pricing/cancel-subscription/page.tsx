"use client"
import React, {useState} from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import CancelSection from "@/components/Settings/Sections/CancelSection";
import ReasonSection from "@/components/Settings/Sections/ReasonSection";
import MainLayout from "@/components/layouts/MainLayout";

const CancelSubscriptionPage = () => {
    const [section, setSection] = useState("cancel")

    const renderSection  = () => {
        switch (section) {
            case "cancel":
                return <CancelSection />
            case "reason":
                return <ReasonSection />
            default:
                return <CancelSection />
        }
    }
    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <TopNav/>
                <div
                    className="bg-white flex justify-between p-[8px] px-[64px] border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">Cancel subscription</p>
                    </div>
                </div>
                <section className="min-h-screen mt-[48px] flex flex-col items-center">
                    {renderSection()}
                </section>
            </section>
        </MainLayout>
    );
}

export default CancelSubscriptionPage;