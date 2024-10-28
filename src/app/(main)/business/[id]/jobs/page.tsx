"use client"
import React, {useState} from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/image/icons/chevron-left.svg";
import ChevronRight from "@/image/icons/ChevronRight.svg";
import JobsCard from "@/components/Business/JobsCard";
import ServiceDetailsModal from "@/components/Business/Modals/ServiceDetailsModal";
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {useRequest} from "@/hooks/useRequest";
import {formatNumberWithCommas} from "@/lib/formatNumber";

const JobsPage = ({params}: {params: {id: number}}) => {
    const router = useRouter()
    const [jobType, setJobType] = useState("in-progress")
    const [jobs, setJobs] = useState([])

    const {authToken} = useSelector((state: any) => state.auth)
    const getHeader = () => {
        return {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
    }

    const renderCards = () => {
        switch (jobType) {
            case "in-progress":
                return <JobsCard type="listing" jobs={data?.in_progress} />
            case "completed":
                return <JobsCard type="listing" jobs={data?.completed} />
            case "sent-offers":
                return <JobsCard type="listing" jobs={data?.sent_offers} />
            default:
                return <JobsCard type="listing" jobs={data?.in_progress} />
        }
    }

    const { data, loading } = useRequest(`/listing/${params.id}/job-data`, "GET", {}, true, getHeader())

    return (
        <section className="bg-light_grey pb-10">
            <TopNav/>
            <div className="bg-white flex justify-between p-[12px] px-10 border-b-grey-20 border-t-grey-20 border-t-[1px] border-b-[1px] items-center">
                <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                    <ChevronLeft/>
                    <p className="font-sans font-semibold text-[16px] tracking-custom">Jobs</p>
                </div>
            </div>
            <section className="min-h-screen mt-4 flex flex-col items-center">
                <div className="flex gap-4">
                    <div>
                        <div className="w-[580px] p-[16px] bg-white rounded-[12px]">
                            <div className="flex flex-col">
                                <p className="font-sans font-normal text-text-grey text-[14px]">Revenue</p>
                                <p className="font-sans font-semibold text-[18px] tracking-custom leading-[27px]">
                                    N{formatNumberWithCommas(data?.count?.revenue)}</p>
                                <div className="border-t-mid-grey border-t-[1px] my-[16px]"></div>
                                <p className="font-sans font-normal text-text-grey text-[14px]">In-progress</p>
                                <p className="font-sans font-semibold text-[18px] tracking-custom leading-[27px]">
                                    {data?.count?.in_progress}
                                </p>
                                <div className="border-t-mid-grey border-t-[1px] my-[16px]"></div>
                                <p className="font-sans font-normal text-text-grey text-[14px]">Completed</p>
                                <p className="font-sans font-semibold text-[18px] tracking-custom leading-[27px]">
                                    {data?.count?.completed}
                                </p>
                                <div className="border-t-mid-grey border-t-[1px] my-[16px]"></div>
                                <p className="font-sans font-normal text-text-grey text-[14px]">Requests</p>
                                <p className="font-sans font-semibold text-[18px] tracking-custom leading-[27px]">
                                    {data?.count?.sent_offers}
                                </p>
                                <div className="border-t-mid-grey border-t-[1px] my-[16px]"></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="bg-white rounded-[12px] h-screen">
                            <div
                                className="w-[684px] border-b-grey-20 border-b-[1px] pt-4 px-[32px] flex justify-between">
                                <div className={`h-10 w-[276.5px] cursor-pointer ${jobType === 'in-progress' && "border-b-step-color border-b-2"}`}>
                                    <p className="text-center font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom" onClick={() => setJobType("in-progress")} >In-progress</p>
                                </div>
                                <div className={`h-10 w-[276.5px] cursor-pointer ${jobType === 'completed' && "border-b-step-color border-b-2"}`}>
                                    <p className="text-center font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom" onClick={() => setJobType("completed")}>Completed</p>
                                </div>
                                <div className={`h-10 w-[276.5px] cursor-pointer ${jobType === 'sent-offers' && "border-b-step-color border-b-2"}`}>
                                    <p className="text-center font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom" onClick={() => setJobType("sent-offers")}>Sent offers</p>
                                </div>
                            </div>
                            <div className="p-[16px] px-[32px]">
                                {
                                    renderCards()
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
}

export default JobsPage;