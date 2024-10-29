"use client"
import React from 'react';
import CloseIcon from "@/images/icons/close.svg";
import {axiosInstance} from "@/lib/axiosInstane";
import {useSelector} from "react-redux";
import {Button} from "@/components/ui/button";
import {useAppDispatch} from "@/redux/hook";
import {useRouter} from "next/navigation";
import {updateToastifyReducer} from "@/redux/toastifySlice";
const ConfirmPaymentModal = ({isOpen, toggleMenu, job, sMenu}: {isOpen: boolean, toggleMenu: () => void, sMenu: () => void, job: any}) => {
    const {authToken} = useSelector((state: any) => state.auth)
    const dispatch = useAppDispatch()
    const router = useRouter()
    const getHeader = () => {
        return {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
    }

    const handleRequestPayment = async () => {
        const { data } = await axiosInstance.patch(`listing/jobs/${job?.id}/request-payment`, {}, getHeader())
        if (data.status) {
            updateToastifyReducer({
                show: true,
                message: data?.message,
                type: "success",
            })
            toggleMenu()
            sMenu()
            router.push(`/business/${job?.business_id}/jobs`)
        } else {
            updateToastifyReducer({
                show: true,
                message: "Something went wrong",
                type: "error",
            })
        }
    }

    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[360px] p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggleMenu}>
                            <CloseIcon/>
                        </div>
                        <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">Service
                            details</p>
                    </div>
                </div>
                <div className="mt-10 py-[16px] flex flex-col items-center">
                    <p className="font-normal text-[14px] w-[328px]">
                        To ensure a smooth process, please mark the job as completed only after it's finished. Your
                        payment will be released only when the client confirms completion. You may dispute delayed
                        payments.
                    </p>
                    <div className="mt-[40px] flex justify-center gap-3 w-full">
                        <Button
                            className="bg-gradient-green p-[14px] px-[48px] h-[48px] rounded-[12px] shadow-custom-bottom w-full"
                            onClick={handleRequestPayment}
                        >
                            <p className="font-semi-normal text-[16px]">Request payment</p>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmPaymentModal;