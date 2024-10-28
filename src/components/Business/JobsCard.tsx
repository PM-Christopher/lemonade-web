import React, {useState} from 'react';
import Image from "next/image";
import business_logo from "@/image/business/JobLogo.png";
import ChevronRight from "@/image/icons/ChevronRight.svg";
import {formatCountry} from "@/lib/formatCountry";
import {formatStringUCFirst} from "@/lib/helper";
import {formatNumberWithCommas} from "@/lib/formatNumber";
import ServiceDetailsModal from "@/components/Business/Modals/ServiceDetailsModal";
import {useAppDispatch} from "@/redux/hook";
import {useSelector} from "react-redux";
import {getJob} from "@/features/business/business.slice";
import JobEmpty from "@/image/JobEmpty.png"

type JobCardInterface = {
    jobs: any,
    type: string,
    toggleMenu?: () => void
}

const JobsCard: React.FC<JobCardInterface> = ({ jobs, type, toggleMenu }) => {
    const dispatch = useAppDispatch()
    const [isOpen, setIsOpen] = useState(false)
    const {authToken} = useSelector((state: any) => state.auth)
    const [fetchedJob, setFetchedJob] = useState(null);

    const detailsToggle = () => {
        setIsOpen(!isOpen)
    }

    const fetchJob = (id: number) => {
        dispatch(getJob({id, token: authToken, type})).then((res) => {
            if (res.payload.status) {
                setFetchedJob(res.payload.data.job)
                if (type === "listing") {
                    detailsToggle()
                } else {
                    if (toggleMenu) {
                        toggleMenu()
                    }
                }
            }
        })
    }

    return (
        <>
            {
                jobs?.length > 0 ? (
                    jobs?.map((job: any, index: any) => (
                        <div key={index}>
                            <div className="flex flex-col cursor-pointer" onClick={() => {
                                fetchJob(job?.id)
                            }}>
                                <div className="flex justify-between">
                                    <div className="flex gap-[8px]">
                                        <Image src={job?.image} alt="logo" width={40} height={40}
                                               className="rounded-[16px] border-[1px] border-step-color"/>
                                        <div className="flex flex-col">
                                            <p className="font-semi-normal text-[14px]">{job?.name}</p>
                                            <p className="font-normal text-[12px] text-text-grey">{job?.city}, {formatCountry(job?.country)}</p>
                                        </div>
                                    </div>
                                    <ChevronRight onClick={() => {
                                        fetchJob(job?.id)
                                    }} className="cursor-pointer"/>
                                </div>
                                <div className="flex justify-between mt-[12px] items-center">
                                    <div className="flex gap-2">
                                        <div className="p-[2px] px-[8px] bg-grey-20 rounded-[12px]">
                                            <p className="font-semi-normal text-[14px] text-text-grey">
                                                {formatStringUCFirst(job?.services[0])}
                                            </p>
                                        </div>
                                        {
                                            job?.services.length > 1 && (
                                                <div className="p-[2px] px-[8px] bg-grey-20 rounded-[12px]">
                                                    <p className="font-semi-normal text-[14px] text-text-grey">
                                                        +{job?.services.length -1}
                                                    </p>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <p className="font-semibold text-[14px]">
                                        N{formatNumberWithCommas(job?.amount)}
                                    </p>
                                </div>
                            </div>
                            <div className="border-b-[1px] border-b-mid-grey p-0 my-[16px]"></div>
                        </div>
                    ))
                    ) : (
                        <div className="flex justify-center items-center mt-[150px]">
                            <div className="flex flex-col items-center">
                                <Image src={JobEmpty} alt="empty_jobs" />
                                <p>No jobs yet</p>
                            </div>
                        </div>
                )
            }
            {
                type === "listing" && (
                    <ServiceDetailsModal job={fetchedJob} isOpen={isOpen} toggleMenu={detailsToggle} />
                )
            }
        </>
    );
}

export default JobsCard;