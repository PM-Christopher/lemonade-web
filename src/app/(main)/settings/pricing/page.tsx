"use client"
import React from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import PricingCard from "@/components/Settings/PricingCard";
import {useSelector} from "react-redux";
import {useRequest} from "@/hooks/useRequest";
import MainLayout from "@/components/layouts/MainLayout";

const PricingPage = () => {
    const {subscription, user, authToken} = useSelector((state: any) => state.auth)
    const getHeader = () => {
        return {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
    }

    const { data, loading } = useRequest(`subscription`, "GET", {}, true, getHeader())
    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <TopNav/>
                <div
                    className="bg-white flex justify-between p-[8px] px-[64px] border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">Pricing</p>
                    </div>
                </div>

                <section className="min-h-screen mt-[48px] flex flex-col items-center">
                    <div className="flex gap-[48px]">
                        {
                            data?.subscriptions?.map((sub: any, index: any) => (
                                <PricingCard subscription={sub} active={subscription?.title === sub?.title}/>
                            ))
                        }
                    </div>
                </section>
            </section>
        </MainLayout>
    );
}

export default PricingPage;