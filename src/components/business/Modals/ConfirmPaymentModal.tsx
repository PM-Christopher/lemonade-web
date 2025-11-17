"use client"
import React from 'react';
import CloseIcon from "@/images/icons/close.svg";
import {axiosInstance} from "@/lib/axiosInstane";
import {useSelector} from "react-redux";
import {Button} from "@/components/ui/button";
import {useAppDispatch} from "@/redux/hook";
import {useRouter} from "next/navigation";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {requestJobPayment} from "@/features/business/business.slice";
import {RootState} from "@/redux/store";
const ConfirmPaymentModal = ({isOpen, toggleMenu, job, sMenu}: {isOpen: boolean, toggleMenu: () => void, sMenu: () => void, job: any}) => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { requestPLoading } = useSelector((state: RootState) => state.business)

    const handleRequestPayment = async () => {
        const { payload } = await dispatch(requestJobPayment({id: job?.id}))
        console.log({payload})
        if (payload.status) {
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: payload?.message,
                    type: "success",
                })
            )
            toggleMenu()
            sMenu()
            router.push(`/business/${job?.business_id}/jobs`)
        } else {
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: "Something went wrong",
                    type: "error",
                })
            )
        }
    }

    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[360px] px-6 pt-4">
                <div className="flex justify-between items-center">
                    <p className="font-sans font-semibold text-[16px] leading-[27px] tracking-custom">
                        Request payment
                    </p>
                    <div className="cursor-pointer" onClick={toggleMenu}>
                        <CloseIcon/>
                    </div>
                </div>
                <div className="mt-10 pb-[10px] flex flex-col items-center">
                    <p className="font-normal text-[14px] w-[328px]">
                        To ensure a smooth process, please mark the job as completed only after it's finished. Your
                        payment will be released only when the client confirms completion. You may dispute delayed
                        payments.
                    </p>
                    <div className="mt-[40px] flex justify-center gap-3 w-full">
                        <Button
                            className={`p-[14px] px-[48px] h-[48px] rounded-[12px] w-full ${requestPLoading ? "bg-light-green-20" : "bg-gradient-green"} shadow-custom-bottom`}
                            onClick={handleRequestPayment}
                            disabled={requestPLoading}
                        >
                            {
                                requestPLoading ? (
                                    <div className={'flex gap-2'}>
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
                                        <p className="font-semi-normal text-[16px] text-light-white">Loading...</p>
                                    </div>
                                ) : (
                                    <p className="font-semi-normal text-[16px]">Request payment</p>
                                )
                            }
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmPaymentModal;