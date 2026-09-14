"use client";
import React from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import MasterCardIcon from "@/images/icons/masterCardIcon.svg";
import { useRequest } from "@/hooks/useRequest";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { BillingHistorySkeleton } from "@/components/Skeletons";

const BillingHistoryPage = () => {
  const router = useRouter();
  const { subscription } = useSelector((state: any) => state.auth);

  const { data, loading } = useRequest(`user/profile/subscription/billing-history`);

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="flex items-center justify-between border-b-[1px] border-t-[1px] bg-white p-[8px] px-[16px] laptop:px-[64px]">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-[12px] p-[4px] pl-[4px] pr-[16px]"
            onClick={() => router.push("/settings")}
          >
            <ChevronLeft />
            <p className="font-sans text-[16px] font-semibold tracking-custom">Account settings</p>
          </div>
        </div>
        <section className="mt-6 flex flex-col items-center">
          {loading ? (
            <BillingHistorySkeleton count={4} />
          ) : (
            <div className="flex w-full flex-col gap-10 laptop:w-[640px]">
              {/* Current Plan */}
              <div className="sm:flex-row sm:items-center flex flex-col items-start justify-between gap-6 rounded-2xl border-b-4 border-b-step-color bg-green-tint p-6">
                <div className="flex flex-col gap-2">
                  <p className="text-base font-semibold text-mid-green">{data?.plan.title}</p>
                  <p className="text-2xl font-bold text-black-light">₦{data?.plan.plan_price}</p>
                  <div className="rounded-lg bg-light-green-50 px-3 py-2">
                    <p className="text-sm font-medium text-light-black">
                      Renews {data?.plan?.next_billing_date}
                    </p>
                  </div>
                </div>

                {subscription?.plan_price !== "0 NGN/month" && (
                  <button className="text-sm font-medium text-red-1 transition-all hover:underline">
                    Cancel renewal
                  </button>
                )}
              </div>

              {/* Payment Info */}
              {/*<div className="flex flex-col gap-4">*/}
              {/*    <p className="text-black-light font-semibold text-sm uppercase tracking-wide">*/}
              {/*        Payment Info*/}
              {/*    </p>*/}
              {/*    <div*/}
              {/*        className="flex items-center gap-3 bg-light-green-10 w-fit px-2 py-1 rounded-lg">*/}
              {/*        <div className="flex items-center gap-2 bg-light-green-50 px-3 py-2 rounded-xl">*/}
              {/*            <MasterCardIcon className="w-[33px] h-[24px]"/>*/}
              {/*            <p className="font-semibold text-sm">***7829</p>*/}
              {/*        </div>*/}
              {/*        <button*/}
              {/*            className="text-light-tint-2 font-medium text-sm hover:underline transition-all">*/}
              {/*            Update payment*/}
              {/*        </button>*/}
              {/*    </div>*/}
              {/*</div>*/}

              {/* Payment History */}
              <div className="flex flex-col gap-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-black-light">
                  Payment History
                </p>

                {data?.histories?.length ? (
                  <div className="divide-light-green-20 border-light-green-20 flex flex-col divide-y overflow-hidden rounded-xl border">
                    {data.histories.map((history: any, index: number) => (
                      <div
                        key={index}
                        className="hover:bg-light-green-5 flex flex-col items-start justify-between bg-white px-4 py-3 transition-colors laptop:flex-row laptop:items-center"
                      >
                        <p className="text-base font-semibold text-black-light">
                          Lemonade-{history.title}
                        </p>
                        <p className="text-center text-sm font-medium text-light-black">
                          {history?.created_at}
                        </p>
                        <p className="text-base font-semibold text-light-black">
                          ₦{history?.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-light-tint-2">No payment history available.</p>
                )}
              </div>
            </div>
          )}
        </section>
      </section>
    </MainLayout>
  );
};

export default BillingHistoryPage;
