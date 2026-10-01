"use client";
import React, { useMemo, useState } from "react";
import ChevronRight from "@/images/icons/chevronRight.svg";
import PromotionsSubMenu from "@/components/events/views/Agent/Promotions";
import FindEventSubMenu from "@/components/events/views/Agent/FindEvent";
import { useRouter } from "next/navigation";
import { useAffiliateEventsQuery, useAffiliateDataQuery } from "@/features/events/queries";
import { AffiliateDataSkeleton } from "@/components/Skeletons";

function AgentSectionView({}) {
  const router = useRouter();
  const [view, setView] = useState("promotions");
  const { data: affiliateEventsData, isLoading: affiliateLoading } = useAffiliateEventsQuery();
  const affiliate_events = affiliateEventsData?.events ?? [];
  const { data: affiliate_data, isLoading: affiliateDataLoading } = useAffiliateDataQuery();

  const { total_commission, tickets_sold } = useMemo(() => {
    // See features/events/api.ts's file-level note: this really is an
    // array with one entry, not a list to sum over.
    const total_commission = affiliate_data?.[0]?.total_commission;
    const tickets_sold = affiliate_data?.[0]?.tickets_sold;

    return { total_commission, tickets_sold };
  }, [affiliate_data]);

  const renderView = () => {
    switch (view) {
      case "promotions":
        return <PromotionsSubMenu events={affiliate_events} loading={affiliateLoading} />;
      case "find_event":
        return <FindEventSubMenu />;
      default:
        return <PromotionsSubMenu events={affiliate_events} loading={affiliateLoading} />;
    }
  };
  return (
    <section className="mt-6">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <section className="laptop:px-0 mt-6 px-4 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            {/* lg = laptop */}
            <div className="laptop:flex-row laptop:items-stretch flex flex-col gap-6">
              {/* Left card */}
              <aside className="laptop:w-[420px] w-full xl:w-[550px]">
                <div className="h-fit rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
                  <p className="text-text-grey mb-4 font-sans text-[13px] sm:text-[14px]">
                    All time commission
                  </p>

                  {affiliateDataLoading ? (
                    <AffiliateDataSkeleton />
                  ) : (
                    <>
                      <p className="tracking-custom font-sans text-[22px] leading-tight font-semibold sm:text-[26px]">
                        ₦{total_commission?.toLocaleString() ?? 0}
                      </p>

                      <div className="border-mid-grey/70 my-5 border-t" />

                      <p className="text-text-grey font-sans text-[13px] sm:text-[14px]">
                        Total Tickets Sold
                      </p>
                      <p className="tracking-custom mt-1 font-sans text-[18px] leading-tight font-semibold sm:text-[20px]">
                        {tickets_sold?.toLocaleString() ?? 0}
                      </p>

                      <div className="border-mid-grey/70 my-5 border-t" />

                      <button
                        type="button"
                        className="group -ml-3 inline-flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-gray-50"
                        onClick={() => router.push("/settings/wallet")}
                      >
                        <span className="font-semi-normal tracking-custom text-light-green font-sans text-[15px] sm:text-[16px]">
                          Go to Wallet
                        </span>
                        <span className="transition-transform group-hover:translate-x-0.5">
                          <ChevronRight />
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </aside>

              {/* Right card */}
              <main className="w-full min-w-0">
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
                  {/* Tabs */}
                  <div className="mb-4 flex w-full gap-2 overflow-x-auto rounded-xl bg-gray-50 p-1">
                    <button
                      type="button"
                      onClick={() => setView("promotions")}
                      className={`tracking-custom flex-1 rounded-lg px-4 py-2 text-center font-sans text-[13px] whitespace-nowrap transition sm:text-[14px] ${
                        view === "promotions"
                          ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Promotions
                    </button>

                    <button
                      type="button"
                      onClick={() => setView("find_event")}
                      className={`tracking-custom flex-1 rounded-lg px-4 py-2 text-center font-sans text-[13px] whitespace-nowrap transition sm:text-[14px] ${
                        view === "find_event"
                          ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
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
