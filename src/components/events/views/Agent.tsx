"use client";
import React, {useEffect, useMemo, useState} from "react";
import ChevronRight from "@/images/icons/chevronRight.svg";
import PromotionsSubMenu from "@/components/events/views/Agent/Promotions";
import FindEventSubMenu from "@/components/events/views/Agent/FindEvent";
import {useSelector} from "react-redux";
import {useRequest} from "@/hooks/useRequest";
import {useRouter} from "next/navigation";
import {RootState} from "@/redux/store";
import {useAppDispatch} from "@/redux/hook";
import {getAffiliateData, getAffiliateEvents} from "@/features/events/event.slice";
import {AffiliateDataSkeleton} from "@/components/Skeletons";

function AgentSectionView({}) {
    const router = useRouter();
    const [view, setView] = useState("promotions");
    const {
        affiliate_events,
        affiliate_data,
        affiliateLoading,
        affiliateDataLoading
    } = useSelector((state: RootState) => state.event)
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getAffiliateEvents())
        dispatch(getAffiliateData())
    }, []);

    const {total_commission, tickets_sold} = useMemo(() => {
        const total_commission = affiliate_data?.reduce?.(
            (acc: any, cur: any) => acc + Number(cur.total_commission),
            0
        );

        const tickets_sold = affiliate_data?.reduce?.(
            (acc: any, cur: any) => acc + Number(cur.tickets_sold),
            0
        );

        return {total_commission, tickets_sold};
    }, [affiliate_data]);

    const renderView = () => {
        switch (view) {
            case "promotions":
                return <PromotionsSubMenu events={affiliate_events} loading={affiliateLoading}/>;
            case "find_event":
                return <FindEventSubMenu data={affiliate_events} loading={affiliateLoading}/>;
            default:
                return <PromotionsSubMenu events={affiliate_events} loading={affiliateLoading}/>;
        }
    };
    return (
        <section className="mt-4 flex flex-col laptop:items-center">
            <div className="flex flex-col laptop:flex-row gap-[24px]">
                <div className="w-full laptop:w-[550px] p-[16px] bg-white rounded-[12px] h-full">
                    <div className="">
                        <div className="flex flex-col">
                            <p className="font-sans font-normal text-text-grey text-[14px] mb-4">
                                All time commission
                            </p>
                            {
                                affiliateDataLoading ? (
                                    < AffiliateDataSkeleton />
                                ) : (
                                    <>
                                        <p className="font-sans font-semibold text-[18px] tracking-custom leading-[27px]">
                                            ₦{total_commission?.toLocaleString() ?? 0}
                                        </p>
                                        <div className="border-t-mid-grey border-t-[1px] my-[16px]"></div>
                                        <p className="font-sans font-normal text-text-grey text-[14px]">
                                            Total Tickets Sold
                                        </p>
                                        <p className="font-sans font-semibold text-[18px] tracking-custom leading-[27px]">
                                            {tickets_sold?.toLocaleString() ?? 0}
                                        </p>
                                        <div className="border-t-mid-grey border-t-[1px] my-[16px]"></div>
                                        <div
                                            className="flex gap-2 items-center cursor-pointer"
                                            onClick={() => router.push("/settings/wallet")}
                                        >
                                            <p className="font-sans font-semi-normal text-[16px] text-light-green tracking-custom leading-[27px]">
                                                Go to Wallet
                                            </p>
                                            <ChevronRight/>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="w-screen laptop:w-full">
                    <div className="p-[16px] bg-white rounded-[12px]">
                        <div className="flex justify-between mt-[10px] border-b-[1px] border-b-mid-grey mb-[10px]">
                            <div
                                className={`h-10 w-full laptop:w-[276.5px] py-[8px] px-[16px] cursor-pointer ${
                                    view === "promotions" && "border-b-step-color border-b-2"
                                }`}
                                onClick={() => setView("promotions")}
                            >
                                <p className="text-center font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">
                                    Promotions
                                </p>
                            </div>
                            <div
                                className={`h-10 w-full laptop:w-[276.5px] py-[8px] px-[16px] cursor-pointer ${
                                    view === "find_event" && "border-b-step-color border-b-2"
                                }`}
                                onClick={() => setView("find_event")}
                            >
                                <p className="text-center font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">
                                    Find events
                                </p>
                            </div>
                        </div>
                        {renderView()}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AgentSectionView;
