import React, {useState} from 'react';
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import medal from "@/images/icons/medal.png";
import ClockIconOrange from "@/images/icons/clockIconOrange.svg"
import {Button} from "@/components/ui/button";
import {formatNumberWithCommas} from "@/lib/formatNumber";
import {formatDecimal, formatStringUCFirst} from "@/lib/helper";
import {axiosInstance} from "@/lib/axiosInstane";
import {useSelector} from "react-redux";
import {useAppDispatch} from "@/redux/hook";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {useRouter} from "next/navigation";
import ConfirmPaymentModal from "@/components/business/Modals/ConfirmPaymentModal";
import CheckGIcon from "@/images/icons/checkGreenIcon.svg"
import CheckPIcon from "@/images/icons/checkPurpleIcon.svg"
import CloseRedIcon from "@/images/icons/closeRedIcon.svg"
import PayNowModal from "@/components/business/Modals/PayNowModal";
import {addJob} from "@/features/business/business.slice";
import {formatCountry} from "@/lib/formatCountry";

type ServiceDetailsInterface = {
    isOpen: boolean,
    toggleMenu: () => void,
    job: any
}

const ServiceDetailsModal:React.FC<ServiceDetailsInterface> = ({isOpen, toggleMenu, job}) => {
    const [remark, setRemark] = useState("")
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [isPayNowOpen, setIsPayNowOpen] = useState(false)
    const router = useRouter()
    const dispatch = useAppDispatch()
    const {authToken} = useSelector((state: any) => state.auth)
    const getHeader = () => {
        return {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
    }
    const markJob = async (option: string) => {
        const {data} = await axiosInstance.post(`listing/jobs/${job?.id}/mark-job`, {status: option, remark}, getHeader())
        if (data.status) {
            dispatch(updateToastifyReducer({
                show: true,
                message: data?.message,
                type: "success",
            }))
            toggleMenu()
            router.push(`/business/${job?.business_id}/jobs`)
        } else {
            dispatch(updateToastifyReducer({
                show: true,
                message: 'Something went wrong. Please try again',
                type: "error",
            }))
        }
        console.log({data})
    }

    const toggleConfirmPayment = () => {
        setIsConfirmOpen(!isConfirmOpen)
    }

    const togglePayNow = () => {
        setIsPayNowOpen(!isPayNowOpen)
    }

    const markCompleted = async () => {
        const { data } = await axiosInstance.post(`business/jobs/${job?.id}/mark-completed`, {}, getHeader())
        if (data.status) {
            dispatch(addJob({job: data.data.job}))
            dispatch(updateToastifyReducer({
                show: true,
                message: data?.message,
                type: "success",
            }))
            toggleMenu()
        } else {
            dispatch(updateToastifyReducer({
                show: true,
                message: 'Something went wrong. Please try again',
                type: "error",
            }))
        }
    }

    const requestStatus = () => {
        switch (job?.status) {
            case "PENDING":
                return (
                    <div>
                        <p className="font-normal text-[14px] text-text-grey">Service status</p>
                        <div
                            className="p-[2px] px-[8px] rounded-[12px] bg-warning w-fit flex items-center gap-2 mt-[8px]">
                            <ClockIconOrange />
                            <p className="font-semi-normal text-[14px] text-warning-bold">Awaiting</p>
                        </div>
                    </div>
                )
            case "ACCEPTED":
                return (
                    <div>
                        <p className="font-normal text-[14px] text-text-grey">Service status</p>
                        <div
                            className="p-[2px] px-[8px] rounded-[12px] bg-purple-1 w-fit flex items-center gap-2 mt-[8px]">
                            <CheckPIcon />
                            <p className="font-semi-normal text-[14px] text-blue-accent-1">Accepted</p>
                        </div>
                    </div>
                )
            case "REJECTED":
                return (
                    <div>
                        <p className="font-normal text-[14px] text-text-grey">Service status</p>
                        <div
                            className="p-[2px] px-[8px] rounded-[12px] bg-red-accent-1 w-fit flex items-center gap-2 mt-[8px]">
                            <CloseRedIcon/>
                            <p className="font-semi-normal text-[14px] text-red-1">Rejected</p>
                        </div>
                    </div>
                )
            case "IN_PROGRESS":
                return (
                    <div>
                        <p className="font-normal text-[14px] text-text-grey">Service status</p>
                        <div
                            className="p-[2px] px-[8px] rounded-[12px] bg-warning w-fit flex items-center gap-2 mt-[8px]">
                            <ClockIconOrange/>
                            <p className="font-semi-normal text-[14px] text-warning-bold">In progress</p>
                        </div>
                    </div>
                )
            case "COMPLETED":
                return (
                    <div>
                        <p className="font-normal text-[14px] text-text-grey">Service status</p>
                        <div
                            className="p-[2px] px-[8px] rounded-[12px] bg-light-green-60 w-fit flex items-center gap-2 mt-[8px]">
                            <CheckGIcon/>
                            <p className="font-semi-normal text-[14px] text-light-green-70">Completed</p>
                        </div>
                    </div>
                )
            default:
                break
        }
    }
    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto ${isOpen ? "flex" : "hidden"} `}
        >
            <div className="w-full laptop:w-[640px] px-4 py-[5vh]">
                <div className="bg-white rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto p-6 hide-scrollbar">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="cursor-pointer" onClick={toggleMenu}>
                                <CloseIcon/>
                            </div>
                            <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">Service details</p>
                        </div>
                    </div>
                    <div className="mt-10 p-4">
                        {
                            job?.status === "PENDING" ? (
                                <div className="rounded-[12px] w-full  laptop:w-[544px] p-[16px] bg-cover bg-center bg-no-repeat"
                                     style={{backgroundImage: `url('/images/business-bg.png')`}}>
                                    <div className="flex flex-col">
                                        <div className="flex justify-center">
                                            <Image src={job?.user?.avatar} alt="logo" width={64} height={64}
                                                   className="rounded-[16px] border-[1px] border-grey-90 flex justify-center h-[64px]"/>
                                        </div>
                                        <div className="flex justify-center flex-col mt-[8px]">
                                            <p className="text-center font-semibold text-[16px]">
                                                {job?.user?.username}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-[12px] p-[16px] bg-cover bg-center bg-no-repeat"
                                     style={{backgroundImage: `url('/images/business-bg.png')`}}>
                                    <div className="flex flex-col">
                                        <div className="flex justify-center">
                                            <Image src={job?.image} alt="logo" width={64} height={64}
                                                   className="rounded-[16px] border-[1px] border-step-color flex justify-center"/>
                                        </div>
                                        <div className="flex justify-center flex-col mt-[8px]">
                                            <p className="text-center font-semibold text-[16px]">{job?.name}</p>
                                            <p className="text-center font-semi-normal text-[14px] text-text-grey">
                                                {job?.city},{formatCountry(job?.country)}
                                            </p>
                                            {
                                                job?.service_rate > 0 && (
                                                    <p className="text-center mt-[4px] text-[16px] font-semibold">
                                                        N{formatNumberWithCommas(job?.service_rate)}/hr
                                                    </p>
                                                )
                                            }
                                        </div>
                                        <div className="flex justify-center mt-[8px]">
                                            <div
                                                className="flex items-center gap-1 bg-mid-grey p-2 rounded-xl justify-center w-fit">
                                                <div>
                                                    <Image src={medal} alt="medal" width={16}/>
                                                </div>
                                                <div>
                                                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-primary-black">
                                                        {formatDecimal(job?.rating, 1)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        <div className="flex flex-col mt-[24px]">
                            {
                                job?.payment_requested ? (
                                    <div className="w-full p-[8px] px-[16px] h-[40px] bg-purple-1 rounded-[8px] my-[24px]">
                                        <p className="font-semi-normal text-[14px] text-center">Payment requested. Awaiting confirmation</p>
                                    </div>
                                ) : (<></>)
                            }

                            {
                                requestStatus()
                            }

                            <p className="font-normal text-[14px] text-text-grey mt-[24px]">Amount</p>
                            <p className="font-semibold text-[18px]">N{formatNumberWithCommas(job?.amount)}</p>
                            <p className="font-normal text-[14px] text-text-grey mt-[24px]">Required services</p>
                            <p className="font-normal text-[16px] text-light-black">
                                {
                                    job?.services?.map((service: string, index: number) => (
                                        <span key={index}>
                                            {formatStringUCFirst(service)}
                                            {index < job?.services?.length - 1 && ', '}
                                        </span>
                                    ))
                                }
                            </p>
                            <p className="font-normal text-[14px] text-text-grey mt-[24px]">Additional information</p>
                            <p className="font-normal text-[16px] text-light-black">
                                {job?.additional_information}
                            </p>

                            {
                                job?.remark && job?.status === "ACCEPTED"  && (
                                    <div className="bg-light_grey rounded-[16px] p-[16px] w-full mt-[24px]">
                                        <p className="font-semiBold text-[14px] text-text-grey">
                                            Remark
                                        </p>
                                        <p className="font-normal text-[16px] text-light-black">
                                            {job?.remark}
                                        </p>
                                    </div>
                                )
                            }

                            {
                                !job?.isOwner && (
                                    job?.status === "ACCEPTED" && (
                                        <div className="mt-[40px] flex justify-center gap-3 mb-[10px] w-full laptop:w-[544px]">
                                            <Button
                                                className="bg-gradient-green p-[14px] px-[48px] h-[48px] rounded-[12px] shadow-custom-bottom w-full"
                                                onClick={togglePayNow}
                                            >
                                                <p className="font-semi-normal text-[16px]">Make payment</p>
                                            </Button>
                                        </div>
                                    )
                                )
                            }

                            {
                                !job?.isOwner && (
                                    job?.status === "IN_PROGRESS" && (
                                        <div className="mt-[40px] flex flex-col laptop:flex-row justify-center gap-3 mb-[10px] w-full laptop:w-[544px]">
                                            <Button
                                                className="bg-gradient-green p-[14px] px-[48px] h-[48px] rounded-[12px] shadow-custom-bottom w-full"
                                                onClick={() => markCompleted()}
                                            >
                                                <p className="font-semi-normal text-[16px]">Mark as completed</p>
                                            </Button>
                                            <Button
                                                className="bg-white border-[1px] border-light-grey-50 p-[14px] px-[48px] h-[48px] rounded-[12px] shadow-none w-full"
                                            >
                                                <p className="font-semi-normal text-[16px] text-black-light">Dispute</p>
                                            </Button>
                                        </div>
                                    )
                                )
                            }

                            {
                                job?.isOwner && (
                                    job?.status === "PENDING" ? (
                                        <>
                                            <div
                                                className="p-[16px] mt-[24px] w-[544px] h-[160px] rounded-[16px] border-[1px] border-grey-80 gap-[16px]">
                                                <p className="font-semiBold text-[14px]">Include a message with your offer
                                                    response.</p>
                                                <div className="flex justify-between">
                                                    <p className="font-normal text-[14px] text-text-grey">Remark</p>
                                                    <p className="font-normal text-[12px] text-text-grey">100 characters</p>
                                                </div>
                                                <textarea
                                                    className="h-[74px] bg-light_grey rounded-[12px] w-full resize-none p-4"></textarea>
                                            </div>
                                            <div className="mt-[40px] flex justify-center gap-3 mb-[10px] w-[544px]">
                                                <Button
                                                    className="bg-gradient-green p-[14px] px-[48px] h-[48px] rounded-[12px] shadow-custom-bottom w-full"
                                                    onClick={() => markJob("accepted")}
                                                >
                                                    <p className="font-semi-normal text-[16px]">Accept</p>
                                                </Button>
                                                <Button
                                                    className="bg-white border-[1px] border-light-grey-50 p-[14px] px-[48px] h-[48px] rounded-[12px] shadow-none w-full"
                                                    onClick={() => markJob("rejected")}
                                                >
                                                    <p className="font-semi-normal text-[16px] text-black-light">Reject</p>
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        job?.payment_made ? (
                                            <div className="mt-[40px] flex justify-center gap-3 mb-[10px] w-full laptop:w-[544px]">
                                                <Button
                                                    className="bg-white border-[1px] border-light-grey-50 p-[14px] px-[48px] h-[48px] rounded-[12px] shadow-none w-full"
                                                >
                                                    <p className="font-semi-normal text-[16px] text-black-light">Dispute Job</p>
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="mt-[40px] flex justify-center gap-3 mb-[10px] w-full laptop:w-[544px]">
                                                <Button
                                                    className="bg-gradient-green p-[14px] px-[48px] h-[48px] rounded-[12px] shadow-custom-bottom w-full"
                                                    onClick={toggleConfirmPayment}
                                                >
                                                    <p className="font-semi-normal text-[16px]">Request payment</p>
                                                </Button>
                                            </div>
                                        )
                                    )
                                )
                            }
                        </div>
                    </div>
                </div>
                <ConfirmPaymentModal isOpen={isConfirmOpen} toggleMenu={toggleConfirmPayment} sMenu={toggleMenu} job={job} />
                <PayNowModal job={job} isOpen={isPayNowOpen} toggleMenu={togglePayNow} />
            </div>
        </div>
    );
}

export default ServiceDetailsModal;