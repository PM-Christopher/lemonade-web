"use client"
import React, {useState} from 'react';
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import CancelSection from "@/components/settings/Sections/CancelSection";
import ReasonSection from "@/components/settings/Sections/ReasonSection";
import MainLayout from "@/components/layouts/MainLayout";
import {useRouter} from "next/navigation";

const CancelSubscriptionPage = () => {
    const [section, setSection] = useState("reason")
    const router = useRouter()

    const toggleSection = (secName: string) => {
        setSection(secName)
    }

    const renderSection  = () => {
        switch (section) {
            case "cancel":
                return <CancelSection />
            case "reason":
                return <ReasonSection toggle={toggleSection} />
            default:
                return <CancelSection />
        }
    }
    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <div
                    className="bg-white flex justify-between p-[8px] px-[16px] laptop:px-[64px] border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer" onClick={() => router.back()}>
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">Cancel subscription</p>
                    </div>
                </div>
                <section className="mt-[48px] flex flex-col items-center">
                    {renderSection()}
                </section>
            </section>
        </MainLayout>
    );
}

export default CancelSubscriptionPage;