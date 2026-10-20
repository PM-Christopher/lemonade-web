"use client";
import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useMemo, useState } from "react";
import ChevronRight from "@/images/icons/chevronRight.svg";
import PromotionsSubMenu from "@/components/events/views/Agent/Promotions";
import FindEventSubMenu from "@/components/events/views/Agent/FindEvent";

import { useAffiliateEventsQuery, useAffiliateDataQuery } from "@/features/events/queries";
import { AffiliateDataSkeleton } from "@/components/Skeletons";

function AgentSectionView({}) {
  const { push } = useNavigation();
  const [view, setView] = useState("promotions");
  const { data: affiliateEventsData, isLoading: affiliateLoading } = useAffiliateEventsQuery();
  const affiliate_events = affiliateEventsData?.events ?? [];
  const { data: affiliate_data, isLoading: affiliateDataLoading } = useAffiliateDataQuery();

  const findEvents = affiliate_data?.[0]?.find_events ?? [];

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
        return (
          <PromotionsSubMenu
            events={affiliate_events}
            loading={affiliateLoading}
            onFindEvents={() => setView("find_event")}
          />
        );
      case "find_event":
        return <FindEventSubMenu initialEvents={findEvents} loading={affiliateDataLoading} />;
      default:
        return (
          <PromotionsSubMenu
            events={affiliate_events}
            loading={affiliateLoading}
            onFindEvents={() => setView("find_event")}
          />
        );
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
              <aside className="laptop:w-105 w-full xl:w-137.5">
                <div className="h-fit rounded-2xl bg-white p-5 sm:p-6">
                  <p className="text-text-grey text-meta sm:text-body-s mb-4 font-sans leading-normal">
                    All Time Commission
                  </p>

                  {affiliateDataLoading ? (
                    <AffiliateDataSkeleton />
                  ) : (
                    <>
                      <p className="tracking-custom text-title-r sm:text-title-l font-sans leading-tight font-semibold sm:leading-normal">
                        ₦{total_commission?.toLocaleString() ?? 0}
                      </p>

                      <div className="border-mid-grey/70 my-5 border-t" />

                      <p className="text-text-grey text-meta sm:text-body-s font-sans leading-normal">
                        Total Tickets Sold
                      </p>
                      <p className="tracking-custom text-body-xl sm:text-title-r mt-1 font-sans leading-tight font-semibold sm:leading-normal">
                        {tickets_sold?.toLocaleString() ?? 0}
                      </p>

                      <div className="border-mid-grey/70 my-5 border-t" />

                      <button
                        type="button"
                        className="group -ml-3 inline-flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-gray-50"
                        onClick={() => push(routes.SETTINGS_WALLET)}
                      >
                        <span className="font-semi-normal tracking-custom text-light-green text-body-s sm:text-body-l font-sans">
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
                <div className="rounded-2xl bg-white p-5 sm:p-6">
                  {/* Tabs */}
                  <div className="border-mid-grey mb-4 flex w-full border-b">
                    {[
                      { key: "promotions", label: "Promotions" },
                      { key: "find_event", label: "Find events" },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setView(tab.key)}
                        className={`tracking-custom text-meta sm:text-body-s -mb-px flex-1 border-b-2 px-4 py-3 text-center font-sans leading-normal whitespace-nowrap transition ${
                          view === tab.key
                            ? "border-step-color text-black-light font-semibold"
                            : "text-text-grey border-transparent"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
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
