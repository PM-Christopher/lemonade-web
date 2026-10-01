"use client";
import React, { useState } from "react";
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
        <div className="laptop:px-16 flex items-center justify-between border-t border-b bg-white p-2 px-4">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-xl p-1 pr-4 pl-1"
            onClick={() => router.back()}
          >
            <ChevronLeft />
            <p className="tracking-custom font-sans text-[16px] font-semibold">
              Cancel subscription
            </p>
          </div>
        </div>
        <section className="mt-12 flex flex-col items-center">{renderSection()}</section>
      </section>
    </MainLayout>
  );
};

export default CancelSubscriptionPage;
