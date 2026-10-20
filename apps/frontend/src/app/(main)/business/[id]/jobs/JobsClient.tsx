"use client";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useState } from "react";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import ChevronRight from "@/images/icons/chevronRight.svg";
import JobsCard from "@/components/business/JobsCard";

import { useBusinessJobDataQuery } from "@/features/business/queries";
import { useUserProfileQuery } from "@/features/settings/queries";
import { formatMinorNaira } from "@/lib/formatNumber";
import MainLayout from "@/components/layouts/MainLayout";
import HowItWorksModal from "@/components/business/Modals/HowItWorksModal";
import InfoIcon from "@/images/icons/infoIcon.svg";

const JobsClient = ({ id }: { id: number }) => {
  const { back } = useNavigation();
  const [jobType, setJobType] = useState("in-progress");
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  const renderCards = () => {
    switch (jobType) {
      case "in-progress":
        return <JobsCard type="listing" jobs={data?.in_progress ?? []} />;
      case "completed":
        return <JobsCard type="listing" jobs={data?.completed ?? []} />;
      case "sent-offers":
        return <JobsCard type="listing" jobs={data?.sent_offers ?? []} />;
      default:
        return <JobsCard type="listing" jobs={data?.in_progress ?? []} />;
    }
  };

  const { data } = useBusinessJobDataQuery(id);
  const { data: profile } = useUserProfileQuery();

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="flex items-center justify-between bg-white p-3 px-10">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-xl p-1 pr-4 pl-1"
            onClick={() => back()}
          >
            <ChevronLeft />
            <p className="tracking-custom text-body-l font-sans font-semibold">Jobs</p>
          </div>
          <button
            type="button"
            aria-label="How it works"
            className="cursor-pointer"
            onClick={() => setHowItWorksOpen(true)}
          >
            <InfoIcon />
          </button>
        </div>
        <HowItWorksModal
          isOpen={howItWorksOpen}
          onClose={() => setHowItWorksOpen(false)}
          variant="owner"
          serviceFeePercent={profile?.subscriptions?.benefits.service_commission}
        />
        <section className="mt-6 flex flex-col items-center">
          <div className="laptop:flex-row laptop:px-6 flex w-full max-w-320 flex-col gap-6 px-4">
            {/* Stats Card */}
            <div className="laptop:w-145 w-full">
              <div className="laptop:p-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                {[
                  { label: "Revenue", value: formatMinorNaira(data?.count?.revenue), tab: null },
                  { label: "In-progress", value: data?.count?.in_progress, tab: "in-progress" },
                  { label: "Completed", value: data?.count?.completed, tab: "completed" },
                  { label: "Requests", value: data?.count?.sent_offers, tab: "sent-offers" },
                ].map((item, index, arr) => (
                  <div key={item.label}>
                    <button
                      type="button"
                      disabled={item.tab === null}
                      onClick={() => item.tab && setJobType(item.tab)}
                      className="laptop:cursor-default laptop:py-3 flex w-full items-center justify-between py-2 text-left"
                    >
                      <span>
                        <span className="text-text-grey text-body-s block font-normal">
                          {item.label}
                        </span>
                        <span className="tracking-custom text-title-r mt-1 block leading-8 font-semibold">
                          {item.value}
                        </span>
                      </span>
                      {item.tab && <ChevronRight className="text-text-grey laptop:hidden" />}
                    </button>
                    {index !== arr.length - 1 && (
                      <div className="laptop:my-5 my-2 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Jobs Section */}
            <div className="laptop:w-171 flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              {/* Tabs */}
              <div className="border-grey-20 relative flex-shrink-0 border-b px-6 pt-5">
                <div className="relative flex justify-between">
                  {/* Animated Underline */}
                  <div
                    className="bg-step-color absolute bottom-0 h-0.75 rounded-full transition-all duration-300"
                    style={{
                      width: "33.33%",
                      transform: `translateX(${
                        ["in-progress", "completed", "sent-offers"].indexOf(jobType) * 100
                      }%)`,
                    }}
                  />

                  {[
                    { key: "in-progress", label: "In-progress" },
                    { key: "completed", label: "Completed" },
                    { key: "sent-offers", label: "Sent offers" },
                  ].map((tab) => {
                    const isActive = jobType === tab.key;

                    return (
                      <button
                        key={tab.key}
                        onClick={() => setJobType(tab.key)}
                        className={`laptop:w-[33%] flex h-10 w-full cursor-pointer items-center justify-center bg-transparent transition-all duration-200`}
                      >
                        <p
                          className={`tracking-custom text-body-s font-sans transition-all duration-200 ${isActive ? "font-semibold text-black" : "text-text-grey hover:text-black"}`}
                        >
                          {tab.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">{renderCards()}</div>
            </div>
          </div>
        </section>
      </section>
    </MainLayout>
  );
};

export default JobsClient;
