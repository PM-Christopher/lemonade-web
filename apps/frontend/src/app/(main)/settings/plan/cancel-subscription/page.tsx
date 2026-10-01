"use client";
import React, { useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import CancelSection from "@/components/settings/Sections/CancelSection";
import ReasonSection from "@/components/settings/Sections/ReasonSection";
import MainLayout from "@/components/layouts/MainLayout";
import { useRouter } from "next/navigation";

const CancelSubscriptionPage = () => {
  const [section, setSection] = useState("reason");
  const router = useRouter();

  const toggleSection = (secName: string) => {
    setSection(secName);
  };

  const renderSection = () => {
    switch (section) {
      case "cancel":
        return <CancelSection />;
      case "reason":
        return <ReasonSection toggle={toggleSection} />;
      default:
        return <CancelSection />;
    }
  };
  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="laptop:px-[64px] flex items-center justify-between border-t-[1px] border-b-[1px] bg-white p-[8px] px-[16px]">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-[12px] p-[4px] pr-[16px] pl-[4px]"
            onClick={() => router.back()}
          >
            <ChevronLeft />
            <p className="tracking-custom font-sans text-[16px] font-semibold">
              Cancel subscription
            </p>
          </div>
        </div>
        <section className="mt-[48px] flex flex-col items-center">{renderSection()}</section>
      </section>
    </MainLayout>
  );
};

export default CancelSubscriptionPage;
