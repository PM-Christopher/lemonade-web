"use client";
import React, { useCallback, useMemo, useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import PricingCard from "@/components/settings/PricingCard";
import { useSelector } from "react-redux";
import { useSubscriptionPlansQuery } from "@/features/authentication/queries";
import MainLayout from "@/components/layouts/MainLayout";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useTransactionPolling } from "@/hooks/useTransactionPolling";
import { SubscriptionsSkeleton } from "@/components/Skeletons";
import { useAppDispatch } from "@/redux/hook";
import { changeSubscription } from "@/features/authentication/authSlice";
import { useSubscriptionPlanMutation } from "@/features/authentication/mutations";
import { RootState } from "@/redux/store";

// Off the initial bundle — both are only needed once a plan-change is
// triggered or a payment completes (docs/ARCHITECTURE.md Phase 6,
// "lazy-load heavy leaf UI").
const UpgradePlanModal = dynamic(
  () => import("@/components/settings/Modal/UpgradePlanModal"),
  {
    ssr: false,
  },
);
const VerifiedSubscriptionModal = dynamic(
  () => import("@/components/settings/Modal/VerifiedSubscriptionModal"),
  { ssr: false },
);

const PlanClient = () => {
  const { subscription, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const subscriptionPlanMutation = useSubscriptionPlanMutation();
  const pricing = subscriptionPlanMutation.data;
  const searchParams = useSearchParams();
  const trxref = searchParams.get("trxref");
  const { data, isLoading: loading } = useSubscriptionPlansQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [subId, setSubId] = useState<number | null>(null);
  const [subMode, setSubMode] = useState<string>("");
  const [openMem, setOpenMem] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
    if (isOpen) setPaymentSuccess(false);
  };

  const toggleSubId = (sub_id: number) => {
    setSubId(sub_id);
  };

  const toggleSubMode = (mode: string) => {
    setSubMode(mode);
  };

  const toggleVerMembership = useCallback(() => {
    setOpenMem((prev) => !prev);
  }, []);

  const pollingConfig = useMemo(() => {
    if (!trxref) return null;
    return {
      transactionId: trxref,
      isSuccess: (data: any) => data.status === "successful",
      onSuccess: (data: any) => {
        dispatch(changeSubscription(data.data.history));
        setPaymentSuccess(true);
        toggleVerMembership();
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      },
      pollingInterval: 4000,
    };
  }, [trxref, dispatch, toggleVerMembership]);

  const { data: verData, loading: verifying } =
    useTransactionPolling(pollingConfig);

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="flex items-center justify-between border-b-[1px] border-t-[1px] bg-white p-[8px] px-[16px] laptop:px-[64px]">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-[12px] p-[4px] pl-[4px] pr-[16px]"
            onClick={() => router.back()}
          >
            <ChevronLeft />
            <p className="font-sans text-[16px] font-semibold tracking-custom">
              Plan
            </p>
          </div>
        </div>

        <section className="mt-[48px] flex flex-col items-center">
          <div className="flex flex-col gap-[48px] laptop:flex-row">
            {loading ? (
              <SubscriptionsSkeleton count={2} dataList={7} />
            ) : (
              data?.subscriptions?.map((sub: any, index: number) => (
                <PricingCard
                  key={index}
                  toggle={toggleModal}
                  subscription={sub}
                  active={subscription?.title === sub?.title}
                  setSubId={toggleSubId}
                  toggleSubMode={toggleSubMode}
                  fetchPlan={(id) => subscriptionPlanMutation.mutate(id)}
                />
              ))
            )}
          </div>
        </section>
      </section>
      {pricing && pricing.subscription.has_charge && (
        <UpgradePlanModal
          isOpen={isOpen}
          toggle={toggleModal}
          sub_id={subId}
          subMode={subMode}
          pricing={pricing.subscription.pricing}
        />
      )}
      {!verifying && paymentSuccess && (
        <VerifiedSubscriptionModal
          isOpen={openMem}
          toggle={toggleVerMembership}
          data={verData?.data}
        />
      )}
    </MainLayout>
  );
};

export default PlanClient;
