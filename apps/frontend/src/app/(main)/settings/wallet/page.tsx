"use client";
import React, {useState} from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import {ChevronRight} from "lucide-react";
import {Button} from "@/components/ui/button";
import ReferralSideMenu from "@/components/settings/ReferralSideMenu";
import AffiliateSideMenu from "@/components/settings/AffiliateSideMenu";
import PayoutModal from "@/components/settings/Modal/PayoutModal";
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {formatNumberWithCommas} from "@/lib/formatNumber";
import MainLayout from "@/components/layouts/MainLayout";
import {TransactionHistorySkeleton, WalletDetailSkeleton} from "@/components/Skeletons";
import RequestPayoutModal from "@/components/settings/Modal/RequestPayoutModal";
import {RootState} from "@/redux/store";
import {useAppDispatch} from "@/redux/hook";
import {useWalletSettingsQuery} from "@/features/settings/queries";
import {useRequestPayoutMutation} from "@/features/settings/mutations";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {ColorRing} from "react-loader-spinner";

function WalletSettingsPage({}) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {user, isLoggedIn} = useSelector((state: RootState) => state.auth)

    const {data, isLoading: loading} = useWalletSettingsQuery({enabled: isLoggedIn});
    const requestPayoutMutation = useRequestPayoutMutation();
    const profileLoading = requestPayoutMutation.isPending;
    const [isRefOpen, setIsRefOpen] = useState(false);
    const [isAfOpen, setIsAfOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isPOpen, setIsPOpen] = useState(false);

    const toggleRefMenu = () => {
        setIsRefOpen(!isRefOpen);
    };

    const toggleAfMenu = () => {
        setIsAfOpen(!isAfOpen);
    };

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const togglePModal = () => {
        setIsPOpen(!isPOpen);
    };

    const handlePayoutRequest = () => {
        if (user?.has_bank_account) {
            // No amount = "pay out everything available", the backend's
            // documented default (RequestWithdrawal action) — matches this
            // button's original intent better than the old hardcoded
            // amount: 100000, which the backend used to ignore outright but
            // now honours literally (a smaller payout than available).
            requestPayoutMutation.mutate({}, {
                onSuccess: () => {
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Your payment is being processed and will be disbursed into the account details provided below",
                            type: "success",
                        })
                    );
                },
                onError: () => {
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Something went wrong, please try again later",
                            type: "error",
                        })
                    );
                },
            });
        } else {
            toggleModal()
        }
    }

    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <ReferralSideMenu toggleMenu={toggleRefMenu} isOpen={isRefOpen}/>
                <AffiliateSideMenu isOpen={isAfOpen} toggleMenu={toggleAfMenu}/>
                <div
                    className="bg-white flex justify-between p-[8px] px-[16px] laptop:px-[64px] border-t-[1px] border-b-[1px] items-center">
                    <div
                        className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer"
                        onClick={() => router.push("/settings")}
                    >
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">
                            Wallet
                        </p>
                    </div>
                </div>

                <section className="mt-4 flex flex-col laptop:flex-row justify-center gap-[20px] px-[10px] laptop:px-0">
                    {
                        loading ?
                            (
                                <WalletDetailSkeleton/>
                            ) :
                            (
                                <div className="flex flex-col w-full laptop:w-[580px]">
                                    <div className="rounded-[12px] p-[16px] flex flex-col bg-white">
                                        <div className="flex flex-col p-[16px] border-b-[1px] border-b-mid-grey">
                                            <p className="font-normal text-[14px] text-text-grey">
                                                Total Amount Earned
                                            </p>
                                            <p className="font-semibold text-[18px] tracking-custom">
                                                N{formatNumberWithCommas(Number(data?.total_amount_earned) || 0)}
                                            </p>
                                        </div>
                                        <div className="flex justify-between p-[16px] border-b-[1px] border-b-mid-grey">
                                            <div className="flex flex-col">
                                                <p className="font-normal text-[14px] text-text-grey">
                                                    Referral earnings
                                                </p>
                                                <p className="font-semibold text-[18px] tracking-custom">
                                                    N{formatNumberWithCommas(Number(data?.referral_earnings) || 0)}
                                                </p>
                                            </div>
                                            <ChevronRight
                                                onClick={toggleRefMenu}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex justify-between p-[16px]">
                                            <div className="flex flex-col">
                                                <p className="font-normal text-[14px] text-text-grey">
                                                    Affiliate earnings
                                                </p>
                                                <p className="font-semibold text-[18px] tracking-custom">
                                                    N{formatNumberWithCommas(Number(data?.affiliate_earnings) || 0)}
                                                </p>
                                            </div>
                                            <ChevronRight
                                                onClick={toggleAfMenu}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    {data?.payout_request && (
                                        <div className="rounded-[12px] p-[16px] flex flex-col bg-light-tint mt-[24px]">
                                            <p className="font-normal text-[16px] text-light-black">
                                                Commission payouts are available when you've earned over
                                                ₦100,000
                                            </p>
                                            <Button
                                                className={`
                                                bg-gradient-green h-[48px] rounded-[12px] w-fit p-[14px] px-[48px] mt-[16px]
                                                ${!profileLoading
                                                    ? "border border-step-color bg-gradient-green shadow-green-inset hover:shadow-green-inset-strong"
                                                    : "bg-mid-green opacity-70 cursor-not-allowed"}
                                                `}
                                                onClick={handlePayoutRequest}
                                                disabled={profileLoading}
                                            >
                                                {profileLoading ? (
                                                    <>
                                                        <svg
                                                            className="animate-spin h-4 w-4 text-white"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                            />
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                            />
                                                        </svg>
                                                        <p className={"font-semi-normal text-[16px]"}>Loading...</p>
                                                    </>
                                                ) : (
                                                    <p className={"font-semi-normal text-[16px]"}>Request pay out</p>
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )
                    }
                    <div>
                        <div className="w-full laptop:min-w-[684px] rounded-[12px] flex flex-col bg-white">
                            <div className="border-b-[1px] p-[16px]">
                                <p className="font-semibold text-[16px]">Payout history</p>
                            </div>
                            {
                                loading ?
                                    (
                                        <TransactionHistorySkeleton count={4}/>
                                    ) :
                                    (
                                        <div className="px-[24px]">
                                            {data?.payout_history?.map((history: any, index: number) => (
                                                <div
                                                    className="pt-[16px] pb-[24px] flex justify-between items-center"
                                                    key={index}
                                                >
                                                    <div className="flex flex-col">
                                                        <p className="font-semi-normal text-[14px]">
                                                            N{formatNumberWithCommas(Number(history?.amount) || 0)}
                                                        </p>
                                                        <p className="font-normal text-[12px] text-text-grey">
                                                            {history?.date}
                                                        </p>
                                                    </div>
                                                    {history?.status === "processing" && (
                                                        <div className="bg-warning py-[4px] px-[8px] rounded-[8px]">
                                                            <p className="font-semi-normal text-[12px] text-warning-bold">
                                                                Processing
                                                            </p>
                                                        </div>
                                                    )}
                                                    {history?.status === "completed" || history?.status === "successful" && (
                                                        <div
                                                            className="bg-light-green-60 py-[4px] px-[8px] rounded-[8px]">
                                                            <p className="font-semi-normal text-[12px] text-light-green-70">
                                                                Completed
                                                            </p>
                                                        </div>
                                                    )}
                                                    {history?.status === "failed" && (
                                                        <div className="bg-red-3 py-[4px] px-[8px] rounded-[8px]">
                                                            <p className="font-semi-normal text-[12px] text-red-1">
                                                                Failed
                                                            </p>
                                                        </div>
                                                    )}
                                                    {history?.status === "pending" && (
                                                        <div className="bg-warning py-[4px] px-[8px] rounded-[8px]">
                                                            <p className="font-semi-normal text-[12px] text-warning-bold">
                                                                Pending
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {/*<div className="pt-[16px] pb-[24px] flex justify-between items-center">*/}
                                            {/*    <div className="flex flex-col">*/}
                                            {/*        <p className="font-semi-normal text-[14px]">N2,000</p>*/}
                                            {/*        <p className="font-normal text-[12px] text-text-grey">23 Mar, 2023 05:00PM</p>*/}
                                            {/*    </div>*/}

                                            {/*</div>*/}
                                            {/*<div className="pt-[16px] pb-[24px] flex justify-between items-center">*/}
                                            {/*    <div className="flex flex-col">*/}
                                            {/*        <p className="font-semi-normal text-[14px]">N2,000</p>*/}
                                            {/*        <p className="font-normal text-[12px] text-text-grey">23 Mar, 2023 05:00PM</p>*/}
                                            {/*    </div>*/}

                                            {/*</div>*/}
                                        </div>
                                    )
                            }
                        </div>
                    </div>
                </section>
                <RequestPayoutModal isOpen={isOpen} toggle={toggleModal}/>
                <PayoutModal isOpen={isPOpen} toggle={togglePModal}/>
            </section>
        </MainLayout>
    );
}

export default WalletSettingsPage;
