import React, { useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import JobsCard from "@/components/business/JobsCard";
import { useJobsDataQuery } from "@/features/business/queries";
import { JobListSkeleton } from "@/components/Skeletons";

type SideMenuInterface = {
  toggleMenu: () => void;
  isOpen: boolean;
  detailsToggle: () => void;
};
const SideMenu: React.FC<SideMenuInterface> = ({ toggleMenu, isOpen, detailsToggle }) => {
  const [jobType, setJobType] = useState("in-progress");
  const { data: jobData, isLoading: loading } = useJobsDataQuery({ enabled: isOpen });

  const renderCards = () => {
    switch (jobType) {
      case "in-progress":
        return (
          <JobsCard toggleMenu={detailsToggle} type="business" jobs={jobData?.in_progress || []} />
        );
      case "completed":
        return (
          <JobsCard toggleMenu={detailsToggle} type="business" jobs={jobData?.completed || []} />
        );
      case "sent-offers":
        return (
          <JobsCard toggleMenu={detailsToggle} type="business" jobs={jobData?.sent_offers || []} />
        );
      default:
        return (
          <JobsCard toggleMenu={detailsToggle} type="business" jobs={jobData?.in_progress || []} />
        );
    }
  };

  return (
    <>
      <div
        className={`fixed right-0 top-0 z-50 h-full transform bg-gray-800 bg-opacity-50 transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full w-screen bg-white p-[48px] px-[20px] laptop:w-[585px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans text-[16px] font-semibold leading-[24px] tracking-custom">
                Jobs
              </p>
            </div>
            <div>
              <CloseIcon className="cursor-pointer" onClick={toggleMenu} />
            </div>
          </div>
          <div className="relative flex-shrink-0 border-b border-grey-20 pt-5">
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

          <div className="mt-[32px] h-screen p-[16px] px-[32px]">
            {loading ? <JobListSkeleton count={6} /> : renderCards()}
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className={`fixed inset-0 z-10 transition-all duration-300 ${
            isOpen ? "bg-black bg-opacity-50 backdrop-blur-sm" : "bg-transparent"
          }`}
          onClick={toggleMenu}
        ></div>
      )}
    </>
  );
};

export default SideMenu;
