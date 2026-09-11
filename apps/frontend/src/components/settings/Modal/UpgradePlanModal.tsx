import React, {useState} from 'react';
import CloseIcon from "@/images/icons/close.svg";
import {FormikButton} from "@/components/global/FormikButton";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {membershipPlans} from "../../../../pageData";
import {formatNumberWithCommas} from "@/lib/formatNumber";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {useAppDispatch} from "@/redux/hook";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {changePlan} from "@/features/authentication/authSlice";
import {useFormik} from "formik";
import {login} from "@/features/authentication/authApi";
import * as yup from "yup";

interface UpgradePlanProps {
    isOpen: boolean;
    toggle: () => void;
    sub_id: number|null;
    subMode: string|null;
    pricing: any[]
}

const UpgradePlanModal = ({isOpen, toggle, sub_id, subMode, pricing}: UpgradePlanProps) => {
    const [selected, setSelected] = useState<number|null>(null);
    const dispatch = useAppDispatch()
    const [subType, setSubType] = useState<string|null>("")
    const { upgradeLoading } = useSelector((state: RootState) => state.auth)

    const handleSelectedPlan = (membership: { id: number; type: string }) => {
        setSelected(prevSelected =>
            prevSelected === membership.id ? null : membership.id
        );

        setSubType(prevSelected =>
            selected === membership.id ? null : membership.type
        );
    };


    const handleSubUpgrade = async () => {
        if (!selected) {
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: "Please select a plan",
                    type: "error",
                })
            )
            return
        }
        const data = {
            reason: "upgrading",
            subscription_id: sub_id,
            type: subType,
            mode: subMode,
            redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/plan`
        }

        const { payload } = await dispatch(changePlan({ data }))
        if (payload.status) {
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: "Redirecting to payment gateway",
                    type: "success",
                })
            )
            toggle()
            if (payload.data.payment) {
                window.location.href = payload.data.payment;
            } else {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "Something went wrong. Please try again!!!",
                        type: "error",
                    })
                )
            }
        }
    }

    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${
                isOpen ? "flex" : "hidden"
            }`}
        >
            <form>
                <div className="bg-white rounded-lg shadow-lg w-[640px] p-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="cursor-pointer" onClick={toggle}>
                                <CloseIcon />
                            </div>
                            <p className="font-sans font-semibold text-[18p] leading-[27px] tracking-custom">
                                Membership
                            </p>
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={handleSubUpgrade}
                                disabled={!selected || upgradeLoading}
                                className={`
                                    flex items-center justify-center gap-2 w-fit h-[39px] px-4 py-2 
                                    rounded-xl font-sans text-white font-medium text-[16px] transition-all duration-300 
                                    ${selected && !upgradeLoading
                                    ? "border border-step-color bg-gradient-green shadow-green-inset hover:shadow-green-inset-strong"
                                    : "bg-mid-green opacity-70 cursor-not-allowed"}`}
                            >
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
                                        <span>Loading...</span>
                                    </>
                                ) : (
                                    <span>Pay now</span>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="mt-10">
                        <div className={'flex flex-col gap-[16px]'}>
                            {
                                pricing?.map((membership: any) => (
                                    <div className={`rounded-[12px] p-[16px] cursor-pointer ${selected === membership.id ? "border-[1px] border-step-color bg-light-green-10" : "bg-mid-grey"}`} key={membership.id} onClick={() => handleSelectedPlan(membership)}>
                                        <div className={"flex justify-between items-center"}>
                                            <p className={'text-[16px] font-semiBold text-black-light'}>{membership.title}</p>
                                            <p className={'text-[16px] font-semiBold text-black-light'}>₦{formatNumberWithCommas(membership.amount)}/{membership.pay_by}</p>
                                        </div>
                                        <p className={'font-normal text-[14px] text-text-grey'}>Billed {membership.type}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default UpgradePlanModal;