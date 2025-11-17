import React, {useState} from 'react';
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import medal from "@/images/icons/medal.png";
import ClockIconOrange from "@/images/icons/clockIconOrange.svg"
import {Button} from "@/components/ui/button";
import {formatNumberWithCommas} from "@/lib/formatNumber";
import {formatDecimal, formatStringUCFirst, getInitials} from "@/lib/helper";
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
import {addJob, markJobCompleted, markJobRequest} from "@/features/business/business.slice";
import {formatCountry} from "@/lib/formatCountry";
import LoadingSvg from "@/components/svgs/loading.svg"
import {RootState} from "@/redux/store";
import ConfirmCompletionModal from "@/components/business/Modals/ConfirmCompletionModal";

type ServiceDetailsInterface = {
    isOpen: boolean,
    toggleMenu: () => void,
    job: any,
    loading: boolean
}

const ServiceDetailsModal: React.FC<ServiceDetailsInterface> = ({isOpen, toggleMenu, job, loading}) => {
    const [remark, setRemark] = useState("")
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [isPayNowOpen, setIsPayNowOpen] = useState(false)
    const [isCompletionOpen, setIsCompletionOpen] = useState(false)
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { markLoading } = useSelector((state: RootState) => state.business)

    const toggleConfirmPayment = () => {
        setIsConfirmOpen(!isConfirmOpen)
    }

    const togglePayNow = () => {
        setIsPayNowOpen(!isPayNowOpen)
    }

    const toggleCompletion = () => {
        setIsCompletionOpen(!isCompletionOpen)
    }

    const markJob = async (option: string) => {
        const {payload} = await dispatch(markJobRequest({id: job.id, data: {status: option, remark}}))

        if (payload.status) {
            dispatch(updateToastifyReducer({
                show: true,
                message: payload?.message,
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
    }

    const markCompleted = async () => {
        toggleCompletion()
    }

    const requestStatus = () => {
        switch (job?.status) {
            case "PENDING":
                return (
                    <div>
                        <p className="font-normal text-[14px] text-text-grey">Service status</p>
                        <div
                            className="p-[2px] px-[8px] rounded-[12px] bg-warning w-fit flex items-center gap-2 mt-[8px]">
                            <ClockIconOrange/>
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
                            <CheckPIcon/>
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

    const navigateDispute = () => {
        router.push(`/business/${job?.business_id}?modal=disputeOpen`)
    }

    return (
        <div
            className={`fixed inset-0 bg-gray-900 bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto ${
                isOpen ? "flex" : "hidden"
            }`}
        >
            <div className="w-full laptop:w-[640px] px-4 py-[5vh]">
                <div
                    className="bg-white rounded-2xl shadow-lg w-full max-h-[90vh] overflow-y-auto hide-scrollbar relative">

                    {/* Header */}
                    <div
                        className="sticky top-0 bg-white z-10 flex justify-between items-center px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="cursor-pointer" onClick={toggleMenu}>
                                <CloseIcon className="text-gray-600 hover:text-black transition-colors duration-200"/>
                            </div>
                            <p className="text-[18px] font-semibold text-black tracking-wide">
                                Service Details
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6 flex flex-col gap-6">
                        {/* User or Job Image Card */}
                        <div
                            className="rounded-2xl w-full p-6 bg-cover bg-center flex flex-col items-center justify-center relative shadow-sm hover:shadow-md transition-shadow duration-300"
                            style={{backgroundImage: `url('/images/business-bg.png')`}}
                        >
                            {job?.status === "PENDING" || job?.status === "ACCEPTED" ? (
                                <>
                                    {job?.user?.avatar ? (
                                        <Image
                                            src={job.user.avatar}
                                            alt="avatar"
                                            width={72}
                                            height={72}
                                            className="rounded-xl border border-gray-300 object-cover"
                                        />
                                    ) : (
                                        <div
                                            className="w-[72px] h-[72px] rounded-xl bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white text-[24px] font-bold">
                                            {getInitials(job?.user?.fullname)}
                                        </div>
                                    )}
                                    <p className="mt-3 text-center font-semibold text-[16px] text-black">
                                        {job?.user?.username}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <Image
                                        src={job?.image}
                                        alt="job logo"
                                        width={72}
                                        height={72}
                                        className="rounded-xl border border-step-color object-cover h-[64px]"
                                    />
                                    <p className="mt-3 text-center font-semibold text-[16px] text-black">
                                        {job?.name}
                                    </p>
                                    <p className="text-center text-[14px] text-gray-500 mt-1">
                                        {job?.city}, {formatCountry(job?.country)}
                                    </p>
                                    {job?.service_rate > 0 && (
                                        <p className="text-center text-[16px] font-semibold mt-1">
                                            N{formatNumberWithCommas(job?.service_rate)}/hr
                                        </p>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Payment Requested */}
                        {job?.payment_requested && job?.isOwner && job?.status === "ACCEPTED" ? (
                            <div
                                className="w-full py-2 px-4 bg-purple-50 rounded-xl text-center text-purple-700 font-medium">
                                Payment requested. Awaiting confirmation
                            </div>
                        ) : null}

                        {/* Request Status */}
                        {requestStatus()}

                        {/* Amount */}
                        <div>
                            <p className="text-[14px] text-gray-500">Amount</p>
                            <p className="text-[18px] font-semibold">N{formatNumberWithCommas(job?.amount)}</p>
                        </div>

                        {/* Required Services */}
                        <div>
                            <p className="text-[14px] text-gray-500">Required Services</p>
                            <p className="text-[16px] text-black mt-1">
                                {job?.services?.map((service: string, index: number) => (
                                    <span key={index}>
                {formatStringUCFirst(service)}
                                        {index < job?.services?.length - 1 && ", "}
              </span>
                                ))}
                            </p>
                        </div>

                        {/* Additional Info */}
                        {job?.additional_information && (
                            <div>
                                <p className="text-[14px] text-gray-500">Additional Information</p>
                                <p className="text-[16px] text-black mt-1">{job?.additional_information}</p>
                            </div>
                        )}

                        {/* Remark */}
                        {job?.remark && job?.status === "ACCEPTED" && (
                            <div className="bg-gray-100 p-4 rounded-2xl">
                                <p className="text-[14px] text-gray-500 font-semibold">Remark</p>
                                <p className="text-[16px] text-black mt-1">{job?.remark}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col laptop:flex-row gap-3 mt-6 w-full">
                            {/* Owner vs User Actions */}
                            {!job?.isOwner && job?.status === "IN_PROGRESS" && (
                                <>
                                    <Button
                                        className={`w-full h-[48px] rounded-2xl shadow-md bg-gradient-green`}
                                        onClick={markCompleted}
                                    >
                                        <p className="font-medium text-[16px] text-light-white">Mark as Completed</p>
                                    </Button>
                                    <Button
                                        className="bg-white border border-gray-300 w-full h-[48px] rounded-2xl font-medium text-black"
                                        onClick={navigateDispute}
                                    >
                                        Dispute
                                    </Button>
                                </>
                            )}

                            {!job?.isOwner && job?.status === "ACCEPTED" && job?.payment_requested && (
                                <Button
                                    className="bg-gradient-green w-full h-[48px] rounded-2xl font-semibold shadow-md text-light-white"
                                    onClick={togglePayNow}
                                >
                                    Make Payment
                                </Button>
                            )}

                            {
                                job?.isOwner && job?.status === "ACCEPTED" && (
                                    job?.payment_made ? (
                                            <div className="mt-[40px] flex justify-center gap-3 mb-[10px] w-full laptop:w-[544px]">
                                                <Button className="bg-white border-[1px] border-light-grey-50 p-[14px] px-[48px] h-[48px] rounded-[12px] shadow-none w-full">
                                                    <p className="font-semi-normal text-[16px] text-black-light">Dispute Job</p></Button>
                                            </div>
                                        ) :
                                        (
                                            <div
                                                className="mt-[40px] flex justify-center gap-3 mb-[10px] w-full laptop:w-[544px]">
                                                <Button
                                                    className="bg-gradient-green p-[14px] px-[48px] h-[48px] rounded-[12px] shadow-custom-bottom w-full"
                                                    onClick={toggleConfirmPayment}><p
                                                    className="font-semi-normal text-[16px]">Request payment</p>
                                                </Button>
                                            </div>
                                        )
                                )
                            }

                            {job?.isOwner && job?.status === "PENDING" && (
                                <div className={"flex flex-col w-full"}>
                                    <div className="w-full p-4 border border-gray-200 rounded-2xl flex flex-col gap-2">
                                        <p className="text-[14px] font-semibold">Include a message with your offer
                                            response</p>
                                        <textarea
                                            className="w-full h-[80px] p-3 rounded-xl bg-gray-50 resize-none text-[14px]"
                                            placeholder="Write your remark..."
                                            value={remark}
                                            onChange={(e) => setRemark(e.target.value)}
                                        />
                                    </div>
                                    {
                                        markLoading ? (
                                            <div
                                                className={"flex gap-[8px] bg-gradient-green w-full h-[48px] rounded-2xl font-semibold shadow-md justify-center items-center mt-4"}>
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
                                            <div className="flex gap-3 mt-4">
                                                <Button
                                                    className="bg-gradient-green w-full h-[48px] rounded-2xl font-semibold shadow-md"
                                                    onClick={() => markJob("accepted")}
                                                    disabled={markLoading}
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    className="bg-white border border-gray-300 w-full h-[48px] rounded-2xl font-semibold text-black hover:text-light-white"
                                                    onClick={() => markJob("rejected")}
                                                    disabled={markLoading}
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        )
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Nested Modals */}
                <ConfirmPaymentModal isOpen={isConfirmOpen} toggleMenu={toggleConfirmPayment} sMenu={toggleMenu} job={job}/>
                <PayNowModal job={job} isOpen={isPayNowOpen} toggleMenu={togglePayNow}/>
                <ConfirmCompletionModal isOpen={isCompletionOpen} toggle={toggleCompletion} job={job} />
            </div>
        </div>


    );
}

export default ServiceDetailsModal;