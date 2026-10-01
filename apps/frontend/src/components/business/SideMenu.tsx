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
        className={`bg-opacity-50 fixed top-0 right-0 z-50 h-full transform bg-gray-800 transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="laptop:w-[585px] h-full w-screen bg-white p-[48px] px-[20px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="tracking-custom font-sans text-[16px] leading-[24px] font-semibold">
                Jobs
              </p>
            </div>
            <div>
              <CloseIcon className="cursor-pointer" onClick={toggleMenu} />
            </div>
          </div>
          <div className="border-grey-20 relative flex-shrink-0 border-b pt-5">
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

          <div className="mt-[32px] h-screen p-[16px] px-[32px]">
            {loading ? <JobListSkeleton count={6} /> : renderCards()}
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className={`fixed inset-0 z-10 transition-all duration-300 ${
            isOpen ? "bg-opacity-50 bg-black backdrop-blur-sm" : "bg-transparent"
          }`}
          onClick={toggleMenu}
        ></div>
      )}
    </>
  );
};

export default SideMenu;
