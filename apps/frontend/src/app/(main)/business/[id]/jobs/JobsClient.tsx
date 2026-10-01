"use client";
import React, { useState } from "react";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import JobsCard, { type Job } from "@/components/business/JobsCard";
import { useRouter } from "next/navigation";
import { useBusinessJobDataQuery } from "@/features/business/queries";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import MainLayout from "@/components/layouts/MainLayout";

const JobsClient = ({ id }: { id: number }) => {
  const router = useRouter();
  const [jobType, setJobType] = useState("in-progress");

  const renderCards = () => {
    switch (jobType) {
      case "in-progress":
        return <JobsCard type="listing" jobs={(data?.in_progress ?? []) as Job[]} />;
      case "completed":
        return <JobsCard type="listing" jobs={(data?.completed ?? []) as Job[]} />;
      case "sent-offers":
        return <JobsCard type="listing" jobs={(data?.sent_offers ?? []) as Job[]} />;
      default:
        return <JobsCard type="listing" jobs={(data?.in_progress ?? []) as Job[]} />;
    }
  };

  const { data } = useBusinessJobDataQuery(id);

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="border-b-grey-20 border-t-grey-20 flex items-center justify-between border-t border-b bg-white p-3 px-10">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-xl p-1 pr-4 pl-1"
            onClick={() => router.back()}
          >
            <ChevronLeft />
            <p className="tracking-custom font-sans text-[16px] font-semibold">Jobs</p>
          </div>
        </div>
        <section className="mt-6 flex flex-col items-center">
          <div className="laptop:flex-row flex w-full max-w-[1280px] flex-col gap-6">
            {/* Stats Card */}
            <div className="laptop:w-[580px] w-full">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
                {[
                  {
                    label: "Revenue",
                    value: `N${formatNumberWithCommas(data?.count?.revenue ?? 0)}`,
                  },
                  { label: "In-progress", value: data?.count?.in_progress },
                  { label: "Completed", value: data?.count?.completed },
                  { label: "Requests", value: data?.count?.sent_offers },
                ].map((item, index, arr) => (
                  <div key={item.label} className="py-3">
                    <p className="text-text-grey text-[14px] font-normal">{item.label}</p>

                    <p className="tracking-custom mt-1 text-[22px] leading-[32px] font-semibold">
                      {item.value}
                    </p>

                    {/* Premium Divider */}
                    {index !== arr.length - 1 && (
                      <div className="my-5 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Jobs Section */}
            <div className="laptop:w-[684px] flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              {/* Tabs */}
              <div className="border-grey-20 relative flex-shrink-0 border-b px-6 pt-5">
                <div className="relative flex justify-between">
                  {/* Animated Underline */}
                  <div
                    className="bg-step-color absolute bottom-0 h-[3px] rounded-full transition-all duration-300"
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
                    { key: "sent-offers", label: "Received offers" },
                  ].map((tab) => {
                    const isActive = jobType === tab.key;

                    return (
                      <button
                        key={tab.key}
                        onClick={() => setJobType(tab.key)}
                        className={`laptop:w-[33%] flex h-10 w-full cursor-pointer items-center justify-center bg-transparent transition-all duration-200`}
                      >
                        <p
                          className={`tracking-custom font-sans text-[14px] leading-[21px] transition-all duration-200 ${isActive ? "font-semibold text-black" : "text-text-grey hover:text-black"}`}
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
