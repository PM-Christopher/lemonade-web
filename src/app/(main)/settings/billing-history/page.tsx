"use client"
import React from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import MasterCardIcon from "@/images/icons/masterCardIcon.svg"
import {useRequest} from "@/hooks/useRequest";
import {useSelector} from "react-redux";
import {useRouter} from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";

const BillingHistoryPage = () => {
    const router = useRouter()
    const { authToken } = useSelector((state: any) => state.auth)
    const getHeader = () => {
        return {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
    }

    const { data, loading } = useRequest(`profile/subscription/billing-history`, "GET", {}, true, getHeader())
    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <TopNav/>
                <div
                    className="bg-white flex justify-between p-[8px] px-[64px] border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer"
                         onClick={() => router.push("/settings")}>
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">Account settings</p>
                    </div>
                </div>
                <section className="min-h-screen mt-4 flex flex-col items-center">
                    <div className="flex flex-col items-center">
                        <div
                            className="w-[640px] rounded-[12px] p-[32px] px-[24px] flex justify-between gap-4 bg-green-tint border-b-[5px] border-b-step-color">
                            <div className="flex flex-col gap-[9px]">
                                <p className="text-mid-green font-semibold text-[16px]">{data?.plan.title}</p>
                                <p className="font-bold text-[24px] text-black-light">N{data?.plan.plan_price}</p>
                                <div className="p-[8px] rounded-[8px] bg-light-green-50">
                                    <p className="font-semi-normal text-[14px] ">Renews {data?.plan?.next_billing_date}</p>
                                </div>
                            </div>
                            <p className="font-semi-normal text-[16px] text-red-1">Cancel renewal</p>
                        </div>

                        <div className="w-[640px] mt-[40px]">
                            <p className="text-[14px] font-semibold text-black-light">Payment info</p>
                            <div
                                className="flex gap-[12px] mt-[16px] items-center bg-light-green-10 w-fit pt-[4px] pr-[8px] pb-[4px] pl-[4px] rounded-[8px]">
                                <div className="flex p-[8px] gap-[8px] rounded-[12px] bg-light-green-50">
                                    <MasterCardIcon className="w-[33px] h-[24px]"/>
                                    <p className="font-semibold text-[14px]">***7829</p>
                                </div>
                                <p className="font-semi-normal text-[16px] text-light-tint-2">Update payment</p>
                            </div>
                        </div>

                        <div className="w-[640px] mt-[40px]">
                            <p className="text-[14px] font-semibold text-black-light">Payment history</p>
                            {
                                data?.histories?.map((history: any, index: number) => (
                                    <div
                                        className="flex justify-between p-[16px] px-[12px] border-t-[1px] border-b-[1px] mt-[16px]" key={index}>
                                        <p className="font-semibold text-[16px]">Lemonade-{history.title}</p>
                                        <p className="font-normal text-[16px] text-center text-light-black">{history?.created_at}</p>
                                        <p className="font-normal text-[16px] text-light-black text-right">N{history?.amount}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </section>
            </section>
        </MainLayout>
    );
}

export default BillingHistoryPage;