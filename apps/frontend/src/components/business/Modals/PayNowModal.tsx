import React from 'react';
import CloseIcon from "@/images/icons/close.svg";
import {Button} from "@/components/ui/button";
import {formatNumberWithCommas} from "@/lib/formatNumber";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {useAppDispatch} from "@/redux/hook";
import {makeJobPayment} from "@/features/business/business.slice";

const PayNowModal = ({isOpen, toggleMenu, job}: {isOpen: boolean, toggleMenu: () => void, job: any}) => {
    const dispatch = useAppDispatch();
    const { payLoading } = useSelector((state: RootState) => state.business)
    const router = useRouter()

    const handlePayNow = async () => {
        const { payload } = await dispatch(makeJobPayment({id: job.id, data: {redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/business`}}))

        if (payload.status) {
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: "Redirecting to payment link",
                    type: "success",
                })
            )
            toggleMenu()
            window.location.href = payload.data.payment
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
            <div className="bg-white rounded-lg shadow-lg w-[360px] p-6">
                <div className="flex justify-between items-center">
                    <p className="font-sans font-semibold text-[16px] leading-[27px] tracking-custom">
                        Make Payment
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggleMenu}>
                            <CloseIcon/>
                        </div>
                    </div>
                </div>
                <div className="mt-2 py-[16px] flex flex-col items-center">
                    <div className="p-[31px] px-[102px] gap-[8px] border-[1px] rounded-[8px] bg-light-green-10 border-mid-green border-dashed">
                        <p className="text-[24px] font-semiBold text-mid-green">₦{formatNumberWithCommas(job?.amount)}</p>
                    </div>
                    <p className="font-normal text-[14px] mt-[16px]">
                        Your payment will be held securely in escrow until you mark the service as completed.
                    </p>
                    <div className="mt-[16px] flex justify-center gap-3 w-full">
                        <Button
                            className="bg-gradient-green p-[14px] px-[48px] h-[48px] rounded-[12px] shadow-custom-bottom w-full"
                            onClick={handlePayNow}
                            disabled={payLoading}
                        >
                            {
                                payLoading ? (
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
                                        <p className="font-semi-normal text-[16px]">Pay now</p>
                                    )
                            }
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PayNowModal;