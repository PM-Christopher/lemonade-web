"use client"
import React, {useState} from 'react';
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import JobsCard from "@/components/business/JobsCard";
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {useRequest} from "@/hooks/useRequest";
import {formatNumberWithCommas} from "@/lib/formatNumber";
import MainLayout from "@/components/layouts/MainLayout";

const JobsPage = ({params}: { params: { id: number } }) => {
    const router = useRouter()
    const [jobType, setJobType] = useState("in-progress")
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
                return <JobsCard type="listing" jobs={data?.in_progress}/>
            case "completed":
                return <JobsCard type="listing" jobs={data?.completed}/>
            case "sent-offers":
                return <JobsCard type="listing" jobs={data?.sent_offers}/>
            default:
                return <JobsCard type="listing" jobs={data?.in_progress}/>
        }
    }

    const {data, loading} = useRequest(`/user/listing/${params.id}/job-data`)

    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <div
                    className="bg-white flex justify-between p-[12px] px-10 border-b-grey-20 border-t-grey-20 border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer"
                         onClick={() => router.back()}>
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">Jobs</p>
                    </div>
                </div>
                <section className="mt-6 flex flex-col items-center">
                    <div className="flex flex-col laptop:flex-row gap-6 w-full max-w-[1280px]">

                        {/* Stats Card */}
                        <div className="w-full laptop:w-[580px]">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm
                            hover:shadow-md transition-shadow duration-300">

                                {[
                                    {label: "Revenue", value: `N${formatNumberWithCommas(data?.count?.revenue)}`},
                                    {label: "In-progress", value: data?.count?.in_progress},
                                    {label: "Completed", value: data?.count?.completed},
                                    {label: "Requests", value: data?.count?.sent_offers},
                                ].map((item, index, arr) => (
                                    <div key={item.label} className="py-3">
                                        <p className="text-[14px] text-text-grey font-normal">
                                            {item.label}
                                        </p>

                                        <p className="text-[22px] font-semibold tracking-custom leading-[32px] mt-1">
                                            {item.value}
                                        </p>

                                        {/* Premium Divider */}
                                        {index !== arr.length - 1 && (
                                            <div className="my-5 h-px bg-gradient-to-r
                                            from-transparent via-gray-300 to-transparent"></div>
                                        )}
                                    </div>
                                ))}

                            </div>
                        </div>

                        {/* Jobs Section */}
                        <div
                            className="bg-white rounded-2xl border border-gray-200 shadow-sm w-full laptop:w-[684px] flex flex-col overflow-hidden"
                        >
                            {/* Tabs */}
                            <div className="relative border-b border-grey-20 px-6 pt-5 flex-shrink-0">
                                <div className="flex justify-between relative">

                                    {/* Animated Underline */}
                                    <div className="absolute bottom-0 h-[3px] bg-step-color rounded-full transition-all duration-300"
                                        style={{
                                            width: "33.33%",
                                            transform: `translateX(${["in-progress", "completed", "sent-offers"]
                                                .indexOf(jobType) * 100}%)`,
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
                                                className={` h-10 w-full laptop:w-[33%] cursor-pointer  flex items-center justify-center  transition-all duration-200 bg-transparent`}
                                            >
                                                <p
                                                    className={` text-[14px] font-sans leading-[21px] tracking-custom  transition-all duration-200 ${isActive ? "font-semibold text-black" : "text-text-grey hover:text-black"}`}
                                                >
                                                    {tab.label}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-6 overflow-y-auto flex-1">
                                {renderCards()}
                            </div>
                        </div>


                    </div>
                </section>

            </section>
        </MainLayout>
    );
}

export default JobsPage;