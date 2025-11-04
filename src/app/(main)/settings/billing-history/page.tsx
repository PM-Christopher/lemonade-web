"use client";
import React from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import MasterCardIcon from "@/images/icons/masterCardIcon.svg";
import { useRequest } from "@/hooks/useRequest";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import {BillingHistorySkeleton} from "@/components/Skeletons";

const BillingHistoryPage = () => {
  const router = useRouter();
  const { authToken, user, subscription } = useSelector(
    (state: any) => state.auth
  );
  const getHeader = () => {
    return {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  };

  const { data, loading } = useRequest(
    `profile/subscription/billing-history`,
  );

    console.log(loading)
  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="bg-white flex justify-between p-[8px] px-[16px] laptop:px-[64px] border-t-[1px] border-b-[1px] items-center">
          <div
            className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer"
            onClick={() => router.push("/settings")}
          >
            <ChevronLeft />
            <p className="font-sans font-semibold text-[16px] tracking-custom">
              Account settings
            </p>
          </div>
        </div>
          <section className="mt-6 flex flex-col items-center">
              {
                  loading ? (
                      <BillingHistorySkeleton count={4} />
                  ) : (
                      <div className="w-full laptop:w-[640px] flex flex-col gap-10">
                          {/* Current Plan */}
                          <div className="rounded-2xl bg-green-tint border-b-4 border-b-step-color p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                              <div className="flex flex-col gap-2">
                                  <p className="text-mid-green font-semibold text-base">
                                      {data?.plan.title}
                                  </p>
                                  <p className="text-black-light font-bold text-2xl">
                                      ₦{data?.plan.plan_price}
                                  </p>
                                  <div className="bg-light-green-50 px-3 py-2 rounded-lg">
                                      <p className="text-sm font-medium text-light-black">
                                          Renews {data?.plan?.next_billing_date}
                                      </p>
                                  </div>
                              </div>

                              {subscription?.plan_price !== "0 NGN/month" && (
                                  <button className="text-red-1 font-medium text-sm hover:underline transition-all">
                                      Cancel renewal
                                  </button>
                              )}
                          </div>

                          {/* Payment Info */}
                          <div className="flex flex-col gap-4">
                              <p className="text-black-light font-semibold text-sm uppercase tracking-wide">
                                  Payment Info
                              </p>
                              <div className="flex items-center gap-3 bg-light-green-10 w-fit px-2 py-1 rounded-lg">
                                  <div className="flex items-center gap-2 bg-light-green-50 px-3 py-2 rounded-xl">
                                      <MasterCardIcon className="w-[33px] h-[24px]" />
                                      <p className="font-semibold text-sm">***7829</p>
                                  </div>
                                  <button className="text-light-tint-2 font-medium text-sm hover:underline transition-all">
                                      Update payment
                                  </button>
                              </div>
                          </div>

                          {/* Payment History */}
                          <div className="flex flex-col gap-4">
                              <p className="text-black-light font-semibold text-sm uppercase tracking-wide">
                                  Payment History
                              </p>

                              {data?.histories?.length ? (
                                  <div className="flex flex-col divide-y divide-light-green-20 border border-light-green-20 rounded-xl overflow-hidden">
                                      {data.histories.map((history: any, index: number) => (
                                          <div
                                              key={index}
                                              className="flex flex-col laptop:flex-row justify-between items-start laptop:items-center px-4 py-3 bg-white hover:bg-light-green-5 transition-colors"
                                          >
                                              <p className="font-semibold text-base text-black-light">
                                                  Lemonade-{history.title}
                                              </p>
                                              <p className="font-medium text-sm text-light-black text-center">
                                                  {history?.created_at}
                                              </p>
                                              <p className="font-semibold text-base text-light-black">
                                                  ₦{history?.amount}
                                              </p>
                                          </div>
                                      ))}
                                  </div>
                              ) : (
                                  <p className="text-light-tint-2 text-sm">No payment history available.</p>
                              )}
                          </div>
                      </div>
                  )
              }
          </section>

      </section>
    </MainLayout>
  );
};

export default BillingHistoryPage;
