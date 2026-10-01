"use client";
import React, { useState } from "react";
import Image from "next/image";
import ChevronRight from "@/images/icons/chevronRight.svg";
import { formatCountry } from "@lemonade/domain";
import { formatStringUCFirst } from "@/lib/helper";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { useAppDispatch } from "@/redux/hook";
import { useSelector } from "react-redux";
import { useGetJobMutation } from "@/features/business/mutations";
import { setSelectedJob } from "@/redux/tempSlice";
import JobEmpty from "@/image/JobEmpty.png";
import { RootState } from "@/redux/store";
import dynamic from "next/dynamic";

// Off the initial bundle — only needed once a job row is clicked
// (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const ServiceDetailsModal = dynamic(
  () => import("@/components/business/Modals/ServiceDetailsModal"),
  { ssr: false },
);

type JobCardInterface = {
  jobs: any;
  type: string;
  toggleMenu?: () => void;
};

const JobsCard: React.FC<JobCardInterface> = ({ jobs, type, toggleMenu }) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { selectedJob: job } = useSelector((state: RootState) => state.temp);
  const getJobMutation = useGetJobMutation();
  const jobLoading = getJobMutation.isPending;

  const detailsToggle = () => {
    setIsOpen(!isOpen);
  };

  const fetchJob = (id: number, job: any) => {
    const businessType = job?.isOwner ? "listing" : "business";
    getJobMutation.mutate(
      { id, type: businessType },
      {
        onSuccess: (payload) => {
          dispatch(setSelectedJob(payload.job));
          if (type === "listing") {
            detailsToggle();
          } else {
            if (toggleMenu) {
              toggleMenu();
            }
          }
        },
      },
    );
  };

  return (
    <>
      {jobs?.length > 0 ? (
        <div className="hide-scrollbar flex flex-col overflow-y-auto pb-24">
          <div className="flex w-full flex-col gap-4">
            {jobs?.map((job: any, index: number) => (
              <div
                key={index}
                className="cursor-pointer rounded-2xl bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
                onClick={() => fetchJob(job?.id, job)}
              >
                {/* Top Row: Logo + Name */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={job?.image}
                      alt="logo"
                      width={48}
                      height={48}
                      className="border-step-color h-[40px] w-[40px] rounded-xl border object-cover"
                    />
                    <div className="flex flex-col">
                      <p className="text-[15px] font-semibold text-black">{job?.name}</p>
                      <p className="text-text-grey mt-1 text-[13px]">
                        {job?.city}, {formatCountry(job?.country)}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="text-text-grey" />
                </div>

                {/* Bottom Row: Services + Amount */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(job?.services) && (
                      <>
                        {job.services.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {job.services[0] && (
                              <div className="bg-grey-20 max-w-max rounded-full px-3 py-1">
                                <p className="text-text-grey text-[13px] font-medium">
                                  {formatStringUCFirst(job.services[0])}
                                </p>
                              </div>
                            )}
                            {job.services.length > 1 && (
                              <div className="bg-grey-20 rounded-full px-3 py-1">
                                <p className="text-text-grey text-[13px] font-medium">
                                  +{job.services.length - 1}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <p className="text-[15px] font-semibold text-black">
                    N{formatNumberWithCommas(job?.amount)}
                  </p>
                </div>

                {/* Divider */}
                {index !== jobs?.length - 1 && (
                  <div className="my-4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-[150px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Image src={"/images/jobEmpty.png"} alt="empty_jobs" width={160} height={141} />
            <p>No jobs yet</p>
          </div>
        </div>
      )}
      {job && (
        <ServiceDetailsModal
          job={job}
          isOpen={isOpen}
          toggleMenu={detailsToggle}
          loading={jobLoading}
        />
      )}
    </>
  );
};

export default JobsCard;
