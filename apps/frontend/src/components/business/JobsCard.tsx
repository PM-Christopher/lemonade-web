"use client";
import { FallbackImage } from "@/components/global/FallbackImage";
import { images } from "@/lib/images";
import React, { useState } from "react";
import Image from "next/image";
import ChevronRight from "@/images/icons/chevronRight.svg";
import { formatCountry } from "@lemonade/domain";
import { formatStringUCFirst } from "@/lib/helper";
import { formatMinorNaira } from "@/lib/formatNumber";
import { useAppDispatch } from "@/redux/hook";
import { useSelector } from "react-redux";
import { useGetJobMutation } from "@/features/business/mutations";
import { setSelectedJob } from "@/redux/tempSlice";
import { RootState } from "@/redux/store";
import dynamic from "next/dynamic";
import type { ServiceRequestJob } from "@/features/business/api";
import { useOpenJobFromLink } from "@/features/business/useOpenJobFromLink";

// Off the initial bundle — only needed once a job row is clicked
// (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const ServiceDetailsModal = dynamic(
  () => import("@/components/business/Modals/ServiceDetailsModal"),
  { ssr: false },
);

// A short hint on the row so the next step is clear without opening the job.
const rowHint = (job: ServiceRequestJob): string | null => {
  if (job.status === "ACCEPTED") return job.is_owner ? "Awaiting payment" : "Pay to start";
  if (job.status === "IN_DISPUTE") return "In dispute";
  if (job.status === "COMPLETED" && !job.is_owner) return "Rate business";
  return null;
};

type JobCardInterface = {
  jobs: ServiceRequestJob[];
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

  // A notification link such as .../jobs?job=... opens that job for the owner.
  useOpenJobFromLink("listing", () => setIsOpen(true), type === "listing");

  const fetchJob = (job: ServiceRequestJob) => {
    const businessType = job.is_owner ? "listing" : "business";
    getJobMutation.mutate(
      { id: job.id, type: businessType },
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
            {jobs?.map((job, index) => (
              <div
                key={index}
                className="cursor-pointer rounded-2xl bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
                onClick={() => fetchJob(job)}
              >
                {/* Top Row: Logo + Name */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <FallbackImage
                      src={job.business?.image}
                      fallbackSrc={images.PLACEHOLDER}
                      alt="logo"
                      width={48}
                      height={48}
                      className="border-step-color h-10 w-10 rounded-xl border object-cover"
                    />
                    <div className="flex flex-col">
                      <p className="text-body-s font-semibold text-black">{job.business?.name}</p>
                      <p className="text-text-grey text-meta mt-1 leading-normal">
                        {job.business?.city}, {formatCountry(job.business?.country ?? "")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {rowHint(job) && (
                      <span className="bg-warning text-warning-bold text-meta rounded-full px-2 py-0.5 leading-normal font-medium">
                        {rowHint(job)}
                      </span>
                    )}
                    <ChevronRight className="text-text-grey" />
                  </div>
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
                                <p className="text-text-grey text-meta leading-normal font-medium">
                                  {formatStringUCFirst(job.services[0])}
                                </p>
                              </div>
                            )}
                            {job.services.length > 1 && (
                              <div className="bg-grey-20 rounded-full px-3 py-1">
                                <p className="text-text-grey text-meta leading-normal font-medium">
                                  +{job.services.length - 1}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <p className="text-body-s font-semibold text-black">
                    {formatMinorNaira(job?.amount)}
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
        <div className="mt-37.5 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Image src={images.JOB_EMPTY} alt="empty_jobs" width={160} height={141} />
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
