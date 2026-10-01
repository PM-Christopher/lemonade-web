"use client";
import React from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import MasterCardIcon from "@/images/icons/masterCardIcon.svg";
import { useBillingHistoryQuery } from "@/features/authentication/queries";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { BillingHistorySkeleton } from "@/components/Skeletons";

const BillingHistoryClient = () => {
  const router = useRouter();
  const { subscription } = useSelector((state: any) => state.auth);

  const { data, isLoading: loading } = useBillingHistoryQuery();

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="laptop:px-[64px] flex items-center justify-between border-t-[1px] border-b-[1px] bg-white p-[8px] px-[16px]">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-[12px] p-[4px] pr-[16px] pl-[4px]"
            onClick={() => router.push("/settings")}
          >
            <ChevronLeft />
            <p className="tracking-custom font-sans text-[16px] font-semibold">Account settings</p>
          </div>
        </div>
        <section className="mt-6 flex flex-col items-center">
          {loading ? (
            <BillingHistorySkeleton count={4} />
          ) : (
            <div className="laptop:w-[640px] flex w-full flex-col gap-10">
              {/* Current Plan */}
              <div className="border-b-step-color bg-green-tint flex flex-col items-start justify-between gap-6 rounded-2xl border-b-4 p-6 sm:flex-row sm:items-center">
                <div className="flex flex-col gap-2">
                  <p className="text-mid-green text-base font-semibold">{data?.plan.title}</p>
                  <p className="text-black-light text-2xl font-bold">₦{data?.plan.plan_price}</p>
                  <div className="bg-light-green-50 rounded-lg px-3 py-2">
                    <p className="text-light-black text-sm font-medium">
                      Renews {data?.plan?.next_billing_date}
                    </p>
                  </div>
                </div>

                {subscription?.plan_price !== "0 NGN/month" && (
                  <button className="text-red-1 text-sm font-medium transition-all hover:underline">
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
                <p className="text-black-light text-sm font-semibold tracking-wide uppercase">
                  Payment History
                </p>

                {data?.histories?.length ? (
                  <div className="divide-light-green-20 border-light-green-20 flex flex-col divide-y overflow-hidden rounded-xl border">
                    {data.histories.map((history: any, index: number) => (
                      <div
                        key={index}
                        className="hover:bg-light-green-5 laptop:flex-row laptop:items-center flex flex-col items-start justify-between bg-white px-4 py-3 transition-colors"
                      >
                        <p className="text-black-light text-base font-semibold">
                          Lemonade-{history.title}
                        </p>
                        <p className="text-light-black text-center text-sm font-medium">
                          {history?.created_at}
                        </p>
                        <p className="text-light-black text-base font-semibold">
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
          )}
        </section>
      </section>
    </MainLayout>
  );
};

export default BillingHistoryClient;
