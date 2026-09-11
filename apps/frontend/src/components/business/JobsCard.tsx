"use client"
import React, {useState} from 'react';
import Image from "next/image";
import ChevronRight from "@/images/icons/chevronRight.svg";
import {formatCountry} from "@/lib/formatCountry";
import {formatStringUCFirst} from "@/lib/helper";
import {formatNumberWithCommas} from "@/lib/formatNumber";
import ServiceDetailsModal from "@/components/business/Modals/ServiceDetailsModal";
import {useAppDispatch} from "@/redux/hook";
import {useSelector} from "react-redux";
import {getJob} from "@/features/business/business.slice";
import JobEmpty from "@/image/JobEmpty.png"
import {RootState} from "@/redux/store";

type JobCardInterface = {
    jobs: any,
    type: string,
    toggleMenu?: () => void
}

const JobsCard: React.FC<JobCardInterface> = ({ jobs, type, toggleMenu }) => {
    const dispatch = useAppDispatch()
    const [isOpen, setIsOpen] = useState(false)
    const { job, jobLoading } = useSelector((state: RootState) => state.business)


    const detailsToggle = () => {
        setIsOpen(!isOpen)
    }

    const fetchJob = async (id: number, job: any) => {
        const businessType = job?.isOwner ? "listing" : "business"
        const { payload } = await dispatch(getJob({id, type: businessType}))
        if (payload.status) {
            if (type === "listing") {
                detailsToggle()
            } else {
                if (toggleMenu) {
                    toggleMenu()
                }
            }
        }
    }

    return (
        <>
            {
                jobs?.length > 0 ? (
                    <div className="flex flex-col overflow-y-auto hide-scrollbar pb-24">
                        <div className="flex flex-col w-full gap-4">
                            {jobs?.map((job: any, index: number) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4 cursor-pointer"
                                    onClick={() => fetchJob(job?.id, job)}
                                >
                                    {/* Top Row: Logo + Name */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-3 items-center">
                                            <Image
                                                src={job?.image}
                                                alt="logo"
                                                width={48}
                                                height={48}
                                                className="rounded-xl border border-step-color object-cover w-[40px] h-[40px]"
                                            />
                                            <div className="flex flex-col">
                                                <p className="text-[15px] font-semibold text-black">{job?.name}</p>
                                                <p className="text-[13px] text-text-grey mt-1">
                                                    {job?.city}, {formatCountry(job?.country)}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="text-text-grey" />
                                    </div>

                                    {/* Bottom Row: Services + Amount */}
                                    <div className="flex justify-between items-center mt-4">
                                        <div className="flex gap-2 flex-wrap">
                                            {Array.isArray(job?.services) && (
                                                <>
                                                    {job.services.length > 0 && (
                                                        <div className="flex gap-2 flex-wrap">
                                                            {job.services[0] && (
                                                                <div className="px-3 py-1 bg-grey-20 rounded-full max-w-max">
                                                                    <p className="text-[13px] text-text-grey font-medium">
                                                                        {formatStringUCFirst(job.services[0])}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {job.services.length > 1 && (
                                                                <div className="px-3 py-1 bg-grey-20 rounded-full">
                                                                    <p className="text-[13px] text-text-grey font-medium">
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
                        <div className="flex justify-center items-center mt-[150px]">
                            <div className="flex flex-col items-center">
                                <Image src={"/images/jobEmpty.png"} alt="empty_jobs" width={160} height={141} />
                                <p>No jobs yet</p>
                            </div>
                        </div>
                )
            }
            {
                job && (
                    <ServiceDetailsModal
                        job={job}
                        isOpen={isOpen}
                        toggleMenu={detailsToggle}
                        loading={jobLoading}
                    />
                )
            }
        </>
    );
}

export default JobsCard;