import React from 'react';
import {Button} from "@/components/ui/button";
import {useSelector} from "react-redux";
import CheckIcon from "@/images/icons/checkGreenIcon.svg";
import PadlockIcon from "@/images/icons/padlockFilledIcon.svg";
import {RootState} from "@/redux/store";
import {clearReason} from "@/features/authentication/authSlice";
import {useChangePlanMutation} from "@/features/authentication/mutations";
import {useAppDispatch} from "@/redux/hook";
import {cancelReason} from "../../../../pageData";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {useRouter} from "next/navigation";

const CancelSection = ({}) => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { plan, subscription, downgradeData } = useSelector((state: RootState) => state.auth)
    const changePlanMutation = useChangePlanMutation()
    const upgradeLoading = changePlanMutation.isPending

    const downgradePlan = async () => {
        const findReason = cancelReason.find(item => item.value === downgradeData?.reason);
        if (!findReason) {
            throw new Error("Reason not found");
        }

        const data = {
            reason: findReason.label,
            subscription_id: downgradeData?.sub_id,
            type: "monthly",
            mode: "downgrade",
            redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/plan`
        };
        changePlanMutation.mutate(data, {
            onSuccess: () => {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "Successful",
                        type: "success",
                    })
                )
                dispatch(clearReason())
                router.push("/settings/plan")
            },
            onError: (error: any) => {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: error?.message || "An error occurred.",
                        type: "error",
                    })
                )
            },
        })
    }

    return (
        <div className="w-full laptop:w-[640px] rounded-[12px] p-[24px] flex flex-col bg-white gap-4">
            <div>
                <p className="font-semibold text-[20px]">We are sorry to see you go</p>
                <p className="font-normal text-[14px] text-light-black">You will lose the following plan
                    benefits if you downgrade</p>
            </div>
            <div className="bg-mid-grey p-[24px] rounded-[12px] flex flex-col gap-[16px]">
                <div className="flex justify-between items-center">
                    <p className="font-semi-normal text-[14px] text-black-light">Verification badge</p>
                    {
                        subscription?.benefits?.ver_badge ? (
                            <CheckIcon />
                        ) : (
                            <PadlockIcon/>
                        )
                    }
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-semi-normal text-[14px] text-black-light">Tribe creation</p>
                    {
                        subscription?.benefits?.forum_creation ? (
                            <CheckIcon />
                        ) : (
                            <PadlockIcon/>
                        )
                    }
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-semi-normal text-[14px] text-black-light">Lemon ID</p>
                    {
                        subscription?.benefits?.lemon_id ? (
                            <CheckIcon />
                        ) : (
                            <PadlockIcon/>
                        )
                    }
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-semi-normal text-[14px] text-black-light">Event creation</p>
                    {
                        subscription?.benefits?.event_creation === 0 ? (
                            <p className="font-semi-normal text-[14px] text-text-grey">Unlimited</p>
                        ) : (
                            <p className="font-semi-normal text-[14px] text-text-grey">{subscription?.benefits?.event_creation} monthly</p>
                        )
                    }
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-semi-normal text-[14px] text-black-light">Ticket sales commission</p>
                    {
                        subscription?.benefits?.sales_commission === 0 ? (
                            <p className="font-semi-normal text-[14px] text-text-grey">None</p>
                        ) : (
                            <p className="font-semi-normal text-[14px] text-text-grey">{subscription?.benefits?.sales_commission}%</p>
                        )
                    }
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-semi-normal text-[14px] text-black-light">Service commission</p>
                    {
                        subscription?.benefits?.service_commission === 0 ? (
                            <p className="font-semi-normal text-[14px] text-text-grey">None</p>
                        ) : (
                            <p className="font-semi-normal text-[14px] text-text-grey">{subscription?.benefits?.service_commission}%</p>
                        )
                    }
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-semi-normal text-[14px] text-black-light">Connection range</p>
                    <p className="font-semi-normal text-[14px] text-text-grey">{subscription?.benefits?.connection_range}</p>
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-semi-normal text-[14px] text-black-light">Offline benefits</p>
                    {
                        subscription?.benefits?.offline_benefits ? (
                            <CheckIcon />
                        ) : (
                            <PadlockIcon/>
                        )
                    }
                </div>
            </div>
            <div className="flex flex-col laptop:flex-row justify-between gap-[16px] mt-[24px]">
                <Button
                    className={`
                    h-[48px] rounded-[12px] w-full
                    ${!upgradeLoading
                        ? "border border-step-color bg-gradient-green shadow-green-inset hover:shadow-green-inset-strong"
                        : "bg-mid-green opacity-70 cursor-not-allowed"}
                    `} onClick={downgradePlan}>
                    {upgradeLoading ? (
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
                            <p className="font-semi-normal text-[16px]">Loading...</p>
                        </>
                    ) : (
                        <p className="font-semi-normal text-[16px]">Continue to downgrade</p>
                    )}
                </Button>
                <Button className="bg-white hover:bg-white shadow-none h-[48px] border-[1px] rounded-[12px] w-full">
                    <p className="font-semi-normal text-[16px] text-black-light">Keep my current plan</p>
                </Button>
            </div>
        </div>
    );
}

export default CancelSection;