"use client"
import React, {useMemo, useState} from 'react';
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import PricingCard from "@/components/settings/PricingCard";
import {useSelector} from "react-redux";
import {useRequest} from "@/hooks/useRequest";
import MainLayout from "@/components/layouts/MainLayout";
import {useRouter, useSearchParams} from "next/navigation";
import UpgradePlanModal from "@/components/settings/Modal/UpgradePlanModal";
import {useTransactionPolling} from "@/hooks/useTransactionPolling";
import {SubscriptionsSkeleton} from "@/components/Skeletons";
import VerifiedSubscriptionModal from "@/components/settings/Modal/VerifiedSubscriptionModal";
import {useAppDispatch} from "@/redux/hook";
import {changeSubscription} from "@/features/authentication/authSlice";
import {useSubscriptionPlanMutation} from "@/features/authentication/mutations";
import {RootState} from "@/redux/store";

const PricingPage = () => {
    const { subscription, user } = useSelector((state: RootState) => state.auth)
    const router = useRouter()
    const dispatch = useAppDispatch()
    const subscriptionPlanMutation = useSubscriptionPlanMutation()
    const pricing = subscriptionPlanMutation.data
    const searchParams = useSearchParams()
    const trxref = searchParams.get("trxref")
    const {data, loading} = useRequest(`user/subscription`)
    const [isOpen, setIsOpen] = useState(false)
    const [subId, setSubId] = useState<number | null>(null)
    const [subMode, setSubMode] = useState<string>('')
    const [openMem, setOpenMem] = useState<boolean>(false)
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const toggleModal = () => {
        setIsOpen((prev) => !prev);
        if (isOpen) setPaymentSuccess(false);
    };

    const toggleSubId = (sub_id: number) => {
        setSubId(sub_id)
    }

    const toggleSubMode = (mode: string) => {
        setSubMode(mode)
    }

    const toggleVerMembership = () => {
        setOpenMem(!openMem)
    }

    const pollingConfig = useMemo(() => {
        if (!trxref) return null
        return {
            transactionId: trxref,
            isSuccess: (data: any) => data.status === 'successful',
            onSuccess: (data: any) => {
                dispatch(changeSubscription(data.data.history))
                setPaymentSuccess(true);
                toggleVerMembership()
                const cleanUrl = window.location.pathname;
                window.history.replaceState({}, document.title, cleanUrl);
            },
            pollingInterval: 4000
        }
    }, [trxref])

    const {data: verData, loading: verifying} = useTransactionPolling(pollingConfig)

    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <div
                    className="bg-white flex justify-between p-[8px] px-[16px] laptop:px-[64px] border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer"
                         onClick={() => router.back()}>
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">Plan</p>
                    </div>
                </div>

                <section className="mt-[48px] flex flex-col items-center">
                    <div className="flex flex-col laptop:flex-row gap-[48px]">
                        {
                            loading ? (
                                <SubscriptionsSkeleton count={2} dataList={7}/>
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
                            )
                        }
                    </div>
                </section>
            </section>
            {
                pricing && pricing.subscription.has_charge && (
                    <UpgradePlanModal isOpen={isOpen} toggle={toggleModal} sub_id={subId} subMode={subMode} pricing={pricing.subscription.pricing} />
                )
            }
            {
                !verifying && paymentSuccess && (
                    <VerifiedSubscriptionModal isOpen={openMem} toggle={toggleVerMembership} data={verData?.data} />
                )
            }
        </MainLayout>
    );
}

export default PricingPage;