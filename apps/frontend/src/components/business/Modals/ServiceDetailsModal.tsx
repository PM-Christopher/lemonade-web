"use client";
import React, { useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import medal from "@/images/icons/medal.png";
import ClockIconOrange from "@/images/icons/clockIconOrange.svg";
import { Button, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { formatDecimal, formatStringUCFirst, getInitials } from "@/lib/helper";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useRouter } from "next/navigation";
import ConfirmPaymentModal from "@/components/business/Modals/ConfirmPaymentModal";
import CheckGIcon from "@/images/icons/checkGreenIcon.svg";
import CheckPIcon from "@/images/icons/checkPurpleIcon.svg";
import CloseRedIcon from "@/images/icons/closeRedIcon.svg";
import PayNowModal from "@/components/business/Modals/PayNowModal";
import { useMarkJobRequestMutation } from "@/features/business/mutations";
import { formatCountry } from "@lemonade/domain";
import LoadingSvg from "@/components/svgs/loading.svg";
import ConfirmCompletionModal from "@/components/business/Modals/ConfirmCompletionModal";

type ServiceDetailsInterface = {
  isOpen: boolean;
  toggleMenu: () => void;
  job: any;
  loading: boolean;
};

const ServiceDetailsModal: React.FC<ServiceDetailsInterface> = ({
  isOpen,
  toggleMenu,
  job,
  loading,
}) => {
  const [remark, setRemark] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPayNowOpen, setIsPayNowOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const markJobRequestMutation = useMarkJobRequestMutation(job?.id);
  const markLoading = markJobRequestMutation.isPending;

  const toggleConfirmPayment = () => {
    setIsConfirmOpen(!isConfirmOpen);
  };

  const togglePayNow = () => {
    setIsPayNowOpen(!isPayNowOpen);
  };

  const toggleCompletion = () => {
    setIsCompletionOpen(!isCompletionOpen);
  };

  const markJob = (option: string) => {
    markJobRequestMutation.mutate(
      { status: option, remark },
      {
        onSuccess: (result) => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: result?.message,
              type: "success",
            }),
          );
          toggleMenu();
          router.push(`/business/${job?.business_id}/jobs`);
        },
        onError: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Something went wrong. Please try again",
              type: "error",
            }),
          );
        },
      },
    );
  };

  const markCompleted = async () => {
    toggleCompletion();
  };

  const requestStatus = () => {
    switch (job?.status) {
      case "PENDING":
        return (
          <div>
            <p className="text-text-grey text-[14px] font-normal">Service status</p>
            <div className="bg-warning mt-[8px] flex w-fit items-center gap-2 rounded-[12px] p-[2px] px-[8px]">
              <ClockIconOrange />
              <p className="font-semi-normal text-warning-bold text-[14px]">Awaiting</p>
            </div>
          </div>
        );
      case "ACCEPTED":
        return (
          <div>
            <p className="text-text-grey text-[14px] font-normal">Service status</p>
            <div className="bg-purple-1 mt-[8px] flex w-fit items-center gap-2 rounded-[12px] p-[2px] px-[8px]">
              <CheckPIcon />
              <p className="font-semi-normal text-blue-accent-1 text-[14px]">Accepted</p>
            </div>
          </div>
        );
      case "REJECTED":
        return (
          <div>
            <p className="text-text-grey text-[14px] font-normal">Service status</p>
            <div className="bg-red-accent-1 mt-[8px] flex w-fit items-center gap-2 rounded-[12px] p-[2px] px-[8px]">
              <CloseRedIcon />
              <p className="font-semi-normal text-red-1 text-[14px]">Rejected</p>
            </div>
          </div>
        );
      case "IN_PROGRESS":
        return (
          <div>
            <p className="text-text-grey text-[14px] font-normal">Service status</p>
            <div className="bg-warning mt-[8px] flex w-fit items-center gap-2 rounded-[12px] p-[2px] px-[8px]">
              <ClockIconOrange />
              <p className="font-semi-normal text-warning-bold text-[14px]">In progress</p>
            </div>
          </div>
        );
      case "COMPLETED":
        return (
          <div>
            <p className="text-text-grey text-[14px] font-normal">Service status</p>
            <div className="bg-light-green-60 mt-[8px] flex w-fit items-center gap-2 rounded-[12px] p-[2px] px-[8px]">
              <CheckGIcon />
              <p className="font-semi-normal text-light-green-70 text-[14px]">Completed</p>
            </div>
          </div>
        );
      default:
        break;
    }
  };

  const navigateDispute = () => {
    router.push(`/business/${job?.business_id}?modal=disputeOpen`);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggleMenu();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{"Service Details"}</DialogTitle>
        <div className="laptop:w-[640px] w-full px-4 py-[5vh]">
          <div className="hide-scrollbar relative max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white shadow-lg">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="cursor-pointer" onClick={toggleMenu}>
                  <CloseIcon className="text-gray-600 transition-colors duration-200 hover:text-black" />
                </div>
                <p className="text-[18px] font-semibold tracking-wide text-black">
                  Service Details
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-6 px-6 py-6">
              {/* User or Job Image Card */}
              <div
                className="relative flex w-full flex-col items-center justify-center rounded-2xl bg-cover bg-center p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
                style={{ backgroundImage: `url('/images/business-bg.png')` }}
              >
                {job?.status === "PENDING" || job?.status === "ACCEPTED" ? (
                  <>
                    {job?.user?.avatar ? (
                      <Image
                        src={job?.user?.avatar}
                        alt="avatar"
                        width={72}
                        height={72}
                        className="rounded-xl border border-gray-300 object-cover"
                      />
                    ) : (
                      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-xl bg-gradient-to-r from-green-400 to-green-600 text-[24px] font-bold text-white">
                        {getInitials(job?.user?.fullname)}
                      </div>
                    )}
                    <p className="mt-3 text-center text-[16px] font-semibold text-black">
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
                      className="border-step-color h-[64px] rounded-xl border object-cover"
                    />
                    <p className="mt-3 text-center text-[16px] font-semibold text-black">
                      {job?.name}
                    </p>
                    <p className="mt-1 text-center text-[14px] text-gray-500">
                      {job?.city}, {formatCountry(job?.country)}
                    </p>
                    {job?.service_rate > 0 && (
                      <p className="mt-1 text-center text-[16px] font-semibold">
                        N{formatNumberWithCommas(job?.service_rate)}/hr
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Payment Requested */}
              {job?.payment_requested && job?.isOwner && job?.status === "ACCEPTED" ? (
                <div className="w-full rounded-xl bg-purple-50 px-4 py-2 text-center font-medium text-purple-700">
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
              {Array.isArray(job?.services) && job.services.length > 0 && (
                <div>
                  <p className="text-[14px] text-gray-500">Required Services</p>
                  <p className="mt-1 text-[16px] text-black">
                    {job.services.map((service: string, index: number) => (
                      <span key={index}>
                        {formatStringUCFirst(service)}
                        {index < job.services.length - 1 && ", "}
                      </span>
                    ))}
                  </p>
                </div>
              )}

              {/* Additional Info */}
              {job?.additional_information && (
                <div>
                  <p className="text-[14px] text-gray-500">Additional Information</p>
                  <p className="mt-1 text-[16px] text-black">{job?.additional_information}</p>
                </div>
              )}

              {/* Remark */}
              {job?.remark && job?.status === "ACCEPTED" && (
                <div className="rounded-2xl bg-gray-100 p-4">
                  <p className="text-[14px] font-semibold text-gray-500">Remark</p>
                  <p className="mt-1 text-[16px] text-black">{job?.remark}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="laptop:flex-row mt-6 flex w-full flex-col gap-3">
                {/* Owner vs User Actions */}
                {!job?.isOwner && job?.status === "IN_PROGRESS" && (
                  <>
                    <Button
                      className={`bg-gradient-green h-[48px] w-full rounded-2xl shadow-md`}
                      onClick={markCompleted}
                    >
                      <p className="text-light-white text-[16px] font-medium">Mark as Completed</p>
                    </Button>
                    <Button
                      className="h-[48px] w-full rounded-2xl border border-gray-300 bg-white font-medium text-black"
                      onClick={navigateDispute}
                    >
                      Dispute
                    </Button>
                  </>
                )}

                {!job?.isOwner && job?.status === "ACCEPTED" && job?.payment_requested && (
                  <Button
                    className="bg-gradient-green text-light-white h-[48px] w-full rounded-2xl font-semibold shadow-md"
                    onClick={togglePayNow}
                  >
                    Make Payment
                  </Button>
                )}

                {job?.isOwner &&
                  job?.status === "ACCEPTED" &&
                  (job?.payment_made ? (
                    <div className="laptop:w-[544px] mt-[40px] mb-[10px] flex w-full justify-center gap-3">
                      <Button className="border-light-grey-50 h-[48px] w-full rounded-[12px] border-[1px] bg-white p-[14px] px-[48px] shadow-none">
                        <p className="font-semi-normal text-black-light text-[16px]">Dispute Job</p>
                      </Button>
                    </div>
                  ) : (
                    <div className="laptop:w-[544px] mt-[40px] mb-[10px] flex w-full justify-center gap-3">
                      <Button
                        className="bg-gradient-green shadow-custom-bottom h-[48px] w-full rounded-[12px] p-[14px] px-[48px]"
                        onClick={toggleConfirmPayment}
                      >
                        <p className="font-semi-normal text-[16px]">Request payment</p>
                      </Button>
                    </div>
                  ))}

                {job?.isOwner && job?.status === "PENDING" && (
                  <div className={"flex w-full flex-col"}>
                    <div className="flex w-full flex-col gap-2 rounded-2xl border border-gray-200 p-4">
                      <p className="text-[14px] font-semibold">
                        Include a message with your offer response
                      </p>
                      <textarea
                        className="h-[80px] w-full resize-none rounded-xl bg-gray-50 p-3 text-[14px]"
                        placeholder="Write your remark..."
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                      />
                    </div>
                    {markLoading ? (
                      <div
                        className={
                          "bg-gradient-green mt-4 flex h-[48px] w-full items-center justify-center gap-[8px] rounded-2xl font-semibold shadow-md"
                        }
                      >
                        <svg
                          className="h-4 w-4 animate-spin text-white"
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
                        <p className="font-semi-normal text-light-white text-[16px]">Loading...</p>
                      </div>
                    ) : (
                      <div className="mt-4 flex gap-3">
                        <Button
                          className="bg-gradient-green h-[48px] w-full rounded-2xl font-semibold shadow-md"
                          onClick={() => markJob("accepted")}
                          disabled={markLoading}
                        >
                          Accept
                        </Button>
                        <Button
                          className="hover:text-light-white h-[48px] w-full rounded-2xl border border-gray-300 bg-white font-semibold text-black"
                          onClick={() => markJob("rejected")}
                          disabled={markLoading}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {job && (
            <>
              {/* Nested Modals */}
              <ConfirmPaymentModal
                isOpen={isConfirmOpen}
                toggleMenu={toggleConfirmPayment}
                sMenu={toggleMenu}
                job={job}
              />
              <PayNowModal job={job} isOpen={isPayNowOpen} toggleMenu={togglePayNow} />
              <ConfirmCompletionModal
                isOpen={isCompletionOpen}
                toggle={toggleCompletion}
                job={job}
              />
            </>
          )}
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default ServiceDetailsModal;
