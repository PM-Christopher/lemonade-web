"use client";
import React, { useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import JobsCard from "@/components/business/JobsCard";
import { useRouter } from "next/navigation";
import { useRequest } from "@/hooks/useRequest";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import MainLayout from "@/components/layouts/MainLayout";

const JobsPage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const [jobType, setJobType] = useState("in-progress");

  const renderCards = () => {
    switch (jobType) {
      case "in-progress":
        return <JobsCard type="listing" jobs={data?.in_progress} />;
      case "completed":
        return <JobsCard type="listing" jobs={data?.completed} />;
      case "sent-offers":
        return <JobsCard type="listing" jobs={data?.sent_offers} />;
      default:
        return <JobsCard type="listing" jobs={data?.in_progress} />;
    }
  };

  const { data, loading } = useRequest(`/user/listing/${params.id}/job-data`);

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="flex items-center justify-between border-b-[1px] border-t-[1px] border-b-grey-20 border-t-grey-20 bg-white p-[12px] px-10">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-[12px] p-[4px] pl-[4px] pr-[16px]"
            onClick={() => router.back()}
          >
            <ChevronLeft />
            <p className="font-sans text-[16px] font-semibold tracking-custom">Jobs</p>
          </div>
        </div>
        <section className="mt-6 flex flex-col items-center">
          <div className="flex w-full max-w-[1280px] flex-col gap-6 laptop:flex-row">
            {/* Stats Card */}
            <div className="w-full laptop:w-[580px]">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
                {[
                  { label: "Revenue", value: `N${formatNumberWithCommas(data?.count?.revenue)}` },
                  { label: "In-progress", value: data?.count?.in_progress },
                  { label: "Completed", value: data?.count?.completed },
                  { label: "Requests", value: data?.count?.sent_offers },
                ].map((item, index, arr) => (
                  <div key={item.label} className="py-3">
                    <p className="text-[14px] font-normal text-text-grey">{item.label}</p>

                    <p className="mt-1 text-[22px] font-semibold leading-[32px] tracking-custom">
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
            <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm laptop:w-[684px]">
              {/* Tabs */}
              <div className="relative flex-shrink-0 border-b border-grey-20 px-6 pt-5">
                <div className="relative flex justify-between">
                  {/* Animated Underline */}
                  <div
                    className="absolute bottom-0 h-[3px] rounded-full bg-step-color transition-all duration-300"
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
                        className={`flex h-10 w-full cursor-pointer items-center justify-center bg-transparent transition-all duration-200 laptop:w-[33%]`}
                      >
                        <p
                          className={`font-sans text-[14px] leading-[21px] tracking-custom transition-all duration-200 ${isActive ? "font-semibold text-black" : "text-text-grey hover:text-black"}`}
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

export default JobsPage;
