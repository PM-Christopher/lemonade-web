"use client"
import React from 'react';
import CloseIcon from "@/images/icons/close.svg";
import {formatNumberWithCommas} from "@/lib/formatNumber";
import {Button} from "@/components/ui/button";
import {useAppDispatch} from "@/redux/hook";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {addJob, markJobCompleted} from "@/features/business/business.slice";
import {updateToastifyReducer} from "@/redux/toastifySlice";

interface ConfirmCompletionModalProps {
    isOpen: boolean;
    toggle: () => void;
    job: any
}
const ConfirmCompletionModal: React.FC<ConfirmCompletionModalProps> = ({isOpen, toggle, job}) => {
    const dispatch = useAppDispatch()
    const { completedLoading } = useSelector((state: RootState) => state.business)

    const markCompleted = async () => {
        const { payload } = await dispatch(markJobCompleted({id: job?.id}))
        if (payload?.status) {
            dispatch(addJob({job: payload?.data?.job}))
            dispatch(updateToastifyReducer({
                show: true,
                message: payload?.message,
                type: "success",
            }))
            toggle()
        } else {
            dispatch(updateToastifyReducer({
                show: true,
                message: 'Something went wrong. Please try again',
                type: "error",
            }))
        }
    }

    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[360px] p-6">
                <div className="flex justify-between items-center">
                    <p className="font-sans font-semibold text-[16px] leading-[27px] tracking-custom">
                        Confirm completion
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={ toggle }>
                            <CloseIcon/>
                        </div>
                    </div>
                </div>
                <div className="mt-2 w-[328px] flex flex-col items-center">
                    <p className="font-normal text-[14px] mt-[16px]">
                        Are you sure this service has been completed? If so, the payment will be released to the vendor and the order will be marked as completed.
                    </p>
                    <div className="mt-[16px] flex justify-center gap-3 w-full">
                        <Button
                            className="bg-gradient-green p-[14px] px-[48px] h-[48px] rounded-[12px] shadow-custom-bottom w-full"
                            onClick={markCompleted}
                            disabled={completedLoading}
                        >
                            {
                                completedLoading ? (
                                    <>
                                        <div
                                            className={"flex gap-[8px] w-full rounded-2xl shadow-md justify-center items-center"}>
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
                                            <p className="font-medium text-[16px] text-light-white">Loading...</p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="font-medium text-[16px] text-light-white">Confirm</p>
                                )
                            }
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmCompletionModal;