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
                return <FindEventSubMenu />;
            default:
                return <PromotionsSubMenu events={affiliate_events} loading={affiliateLoading}/>;
        }
    };
    return (
        <section className="mt-6">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                <section className="mt-6 px-4 sm:px-6 laptop:px-0">
                    <div className="mx-auto w-full max-w-6xl">
                        {/* lg = laptop */}
                        <div className="flex flex-col gap-6 laptop:flex-row laptop:items-stretch">
                            {/* Left card */}
                            <aside className="w-full laptop:w-[420px] xl:w-[550px]">
                                <div className="h-fit rounded-2xl bg-white p-5 sm:p-6 shadow-sm ring-1 ring-black/5">
                                    <p className="font-sans text-[13px] sm:text-[14px] text-text-grey mb-4">
                                        All time commission
                                    </p>

                                    {affiliateDataLoading ? (
                                        <AffiliateDataSkeleton/>
                                    ) : (
                                        <>
                                            <p className="font-sans font-semibold text-[22px] sm:text-[26px] leading-tight tracking-custom">
                                                ₦{total_commission?.toLocaleString() ?? 0}
                                            </p>

                                            <div className="my-5 border-t border-mid-grey/70"/>

                                            <p className="font-sans text-[13px] sm:text-[14px] text-text-grey">
                                                Total Tickets Sold
                                            </p>
                                            <p className="font-sans font-semibold text-[18px] sm:text-[20px] leading-tight tracking-custom mt-1">
                                                {tickets_sold?.toLocaleString() ?? 0}
                                            </p>

                                            <div className="my-5 border-t border-mid-grey/70"/>

                                            <button
                                                type="button"
                                                className="group inline-flex items-center gap-2 rounded-xl px-3 py-2 -ml-3 hover:bg-gray-50 transition"
                                                onClick={() => router.push("/settings/wallet")}
                                            >
                                                <span
                                                    className="font-sans font-semi-normal text-[15px] sm:text-[16px] text-light-green tracking-custom">
                                                    Go to Wallet
                                                </span>
                                                <span className="transition-transform group-hover:translate-x-0.5">
                                                    <ChevronRight/>
                                                </span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </aside>

                            {/* Right card */}
                            <main className="w-full min-w-0">
                                <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm ring-1 ring-black/5">
                                    {/* Tabs */}
                                    <div className="mb-4 flex w-full gap-2 overflow-x-auto rounded-xl bg-gray-50 p-1">
                                        <button
                                            type="button"
                                            onClick={() => setView("promotions")}
                                            className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-center font-sans text-[13px] sm:text-[14px] tracking-custom transition ${
                                                view === "promotions"
                                                    ? "bg-white shadow-sm text-gray-900 ring-1 ring-black/5"
                                                    : "text-gray-600 hover:text-gray-900"
                                            }`}
                                        >
                                            Promotions
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setView("find_event")}
                                            className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-center font-sans text-[13px] sm:text-[14px] tracking-custom transition ${
                                                view === "find_event"
                                                    ? "bg-white shadow-sm text-gray-900 ring-1 ring-black/5"
                                                    : "text-gray-600 hover:text-gray-900"
                                            }`}
                                        >
                                            Find events
                                        </button>
                                    </div>

                                    <div className="min-w-0">{renderView()}</div>
                                </div>
                            </main>
                        </div>
                    </div>
                </section>

            </div>
        </section>

    );
}

export default AgentSectionView;
