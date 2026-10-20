"use client";
import { FallbackImage } from "@/components/global/FallbackImage";
import { images } from "@/lib/images";
import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import ClockIconOrange from "@/images/icons/clockIconOrange.svg";
import { Button, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { formatMinorNaira } from "@/lib/formatNumber";
import { formatStringUCFirst, getInitials } from "@/lib/helper";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";

import ConfirmPaymentModal from "@/components/business/Modals/ConfirmPaymentModal";
import CheckGIcon from "@/images/icons/checkGreenIcon.svg";
import CheckPIcon from "@/images/icons/checkPurpleIcon.svg";
import CloseRedIcon from "@/images/icons/closeRedIcon.svg";
import PayNowModal from "@/components/business/Modals/PayNowModal";
import DisputeJobModal from "@/components/business/Modals/DisputeJobModal";
import SubmitDisputeModal from "@/components/business/Modals/SubmitDisputeModal";
import ReviewModal from "@/components/business/Modals/ReviewModal";
import RequestServiceModal from "@/components/business/Modals/RequestServiceModal";
import { useReviewJobMutation, useMarkJobRequestMutation } from "@/features/business/mutations";
import { useBusinessQuery } from "@/features/business/queries";
import { formatCountry } from "@lemonade/domain";
import ConfirmCompletionModal from "@/components/business/Modals/ConfirmCompletionModal";
import type { ServiceRequestJob } from "@/features/business/api";

type ServiceDetailsInterface = {
  isOpen: boolean;
  toggleMenu: () => void;
  job: ServiceRequestJob;
  loading: boolean;
};

type StatusBadge = { label: string; className: string; icon: React.ReactNode };

const STATUS_BADGES: Record<string, StatusBadge> = {
  PENDING: {
    label: "Awaiting",
    className: "bg-warning text-warning-bold",
    icon: <ClockIconOrange />,
  },
  ACCEPTED: {
    label: "Accepted",
    className: "bg-purple-1 text-blue-accent-1",
    icon: <CheckPIcon />,
  },
  REJECTED: { label: "Rejected", className: "bg-red-accent-1 text-red-1", icon: <CloseRedIcon /> },
  IN_PROGRESS: {
    label: "In progress",
    className: "bg-warning text-warning-bold",
    icon: <ClockIconOrange />,
  },
  IN_DISPUTE: {
    label: "In dispute",
    className: "bg-red-accent-1 text-red-1",
    icon: <CloseRedIcon />,
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-light-green-60 text-light-green-70",
    icon: <CheckGIcon />,
  },
};

const Notice = ({ children }: { children: React.ReactNode }) => (
  <div className="text-body-s w-full rounded-xl bg-purple-50 px-4 py-2 text-center font-medium text-purple-700">
    {children}
  </div>
);

const ServiceDetailsModal: React.FC<ServiceDetailsInterface> = ({ isOpen, toggleMenu, job }) => {
  const [remark, setRemark] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPayNowOpen, setIsPayNowOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);
  const [isDisputeInfoOpen, setIsDisputeInfoOpen] = useState(false);
  const [isDisputeFormOpen, setIsDisputeFormOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const { push } = useNavigation();
  const dispatch = useAppDispatch();
  const markJobRequestMutation = useMarkJobRequestMutation(job.id);
  const reviewJobMutation = useReviewJobMutation(job.id);
  const markLoading = markJobRequestMutation.isPending;

  const isOwner = job.is_owner;
  const status = job.status;
  // The API can send these flags as 0 or 1.
  const paymentRequested = Boolean(job.payment_requested);
  const canSendAnotherQuote = !isOwner && status === "REJECTED";
  // Services to pick from when sending another quote.
  const { data: businessData } = useBusinessQuery(job.business?.id, {
    enabled: isOpen && canSendAnotherQuote,
  });

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
          if (job.business) push(routes.BUSINESS_JOBS(job.business.id));
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

  const badge = STATUS_BADGES[status];
  const person = isOwner ? job.user : null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggleMenu();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{"Service details"}</DialogTitle>
        <div className="laptop:w-160 laptop:px-4 laptop:py-[5vh] w-screen">
          <div className="hide-scrollbar laptop:max-h-[90vh] laptop:rounded-2xl laptop:h-auto relative h-screen w-full overflow-y-auto bg-white shadow-lg">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-white px-6 py-4">
              <div className="flex items-center gap-3">
                <button type="button" aria-label="Close" onClick={toggleMenu}>
                  <CloseIcon className="text-gray-600 transition-colors duration-200 hover:text-black" />
                </button>
                <p className="text-body-xl font-semibold tracking-wide text-black">
                  Service details
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6 px-6 pt-2 pb-6">
              <div
                className="relative flex w-full flex-col items-center justify-center rounded-2xl bg-cover bg-center p-6"
                style={{ backgroundImage: `url(${images.BUSINESS_BG})` }}
              >
                {person ? (
                  <>
                    {person.profile_image ? (
                      <FallbackImage
                        src={person.profile_image}
                        fallbackSrc={images.AVATAR_4}
                        alt="avatar"
                        width={72}
                        height={72}
                        className="h-18 w-18 rounded-xl border border-gray-300 object-cover"
                      />
                    ) : (
                      <div className="text-title-l flex h-18 w-18 items-center justify-center rounded-xl bg-gradient-to-r from-green-400 to-green-600 leading-normal font-bold text-white">
                        {getInitials(person.fullname)}
                      </div>
                    )}
                    <p className="text-body-l mt-3 text-center font-semibold text-black">
                      {person.username}
                    </p>
                  </>
                ) : (
                  <>
                    <FallbackImage
                      src={job.business?.image}
                      fallbackSrc={images.PLACEHOLDER}
                      alt="job logo"
                      width={72}
                      height={72}
                      className="border-step-color h-16 w-16 rounded-xl border object-cover"
                    />
                    <p className="text-body-l mt-3 text-center font-semibold text-black">
                      {job.business?.name}
                    </p>
                    <p className="text-body-s mt-1 text-center text-gray-500">
                      {job.business?.city}, {formatCountry(job.business?.country ?? "")}
                    </p>
                    {(job.business?.service_rate ?? 0) > 0 && (
                      <p className="text-body-l mt-1 text-center font-semibold">
                        {formatMinorNaira(job.business?.service_rate)}/hr
                      </p>
                    )}
                  </>
                )}
              </div>

              {isOwner && status === "ACCEPTED" && (
                <Notice>You&apos;ll get payment notification to begin.</Notice>
              )}
              {isOwner && status === "IN_PROGRESS" && paymentRequested && (
                <Notice>Payment requested. Awaiting confirmation.</Notice>
              )}
              {!isOwner && status === "IN_PROGRESS" && paymentRequested && (
                <Notice>Business owner is requesting payment.</Notice>
              )}
              {status === "COMPLETED" && job.refunded && (
                <Notice>
                  {isOwner ? "Client has been refunded" : "Your payment was refunded"}
                </Notice>
              )}

              {badge && (
                <div>
                  <p className="text-text-grey text-body-s font-normal">Service status</p>
                  <div
                    className={`mt-2 flex w-fit items-center gap-2 rounded-xl p-0.5 px-2 ${badge.className}`}
                  >
                    {badge.icon}
                    <p className="font-semi-normal text-body-s">{badge.label}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-text-grey text-body-s">Amount</p>
                <p className="text-body-xl font-semibold">{formatMinorNaira(job?.amount)}</p>
              </div>

              {Array.isArray(job?.services) && job.services.length > 0 && (
                <div>
                  <p className="text-text-grey text-body-s">Required services</p>
                  <p className="text-body-l mt-1 text-black">
                    {job.services.map((service: string) => formatStringUCFirst(service)).join(", ")}
                  </p>
                </div>
              )}

              {job.additional_info && (
                <div>
                  <p className="text-text-grey text-body-s">Additional information</p>
                  <p className="text-body-l mt-1 text-black">{job.additional_info}</p>
                </div>
              )}

              {job?.remark && status !== "PENDING" && (
                <div className="rounded-2xl bg-gray-100 p-4">
                  <p className="text-body-s font-semibold text-gray-500">Remark</p>
                  <p className="text-body-l mt-1 text-black">{job.remark}</p>
                </div>
              )}

              <div className="laptop:flex-row flex w-full flex-col gap-3">
                {!isOwner && status === "REJECTED" && (
                  <Button
                    className="bg-gradient-green h-12 w-full rounded-xl font-semibold"
                    onClick={() => setIsRequestOpen(true)}
                  >
                    Send another quote
                  </Button>
                )}

                {!isOwner && status === "ACCEPTED" && (
                  <Button
                    className="bg-gradient-green text-light-white h-12 w-full rounded-xl font-semibold"
                    onClick={() => setIsPayNowOpen(true)}
                  >
                    Make payment
                  </Button>
                )}

                {!isOwner && status === "IN_PROGRESS" && (
                  <>
                    <Button
                      className="bg-gradient-green h-12 w-full rounded-xl"
                      onClick={() => setIsCompletionOpen(true)}
                    >
                      <p className="text-light-white text-body-l font-medium">Mark as completed</p>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 w-full rounded-xl border border-gray-300 bg-white font-medium text-black"
                      onClick={() => setIsDisputeInfoOpen(true)}
                    >
                      Dispute
                    </Button>
                  </>
                )}

                {!isOwner && status === "COMPLETED" && (
                  <Button
                    className="bg-gradient-green h-12 w-full rounded-xl font-semibold"
                    onClick={() => setIsReviewOpen(true)}
                  >
                    Rate business
                  </Button>
                )}

                {isOwner && status === "IN_PROGRESS" && !paymentRequested && (
                  <Button
                    className="bg-gradient-green h-12 w-full rounded-xl p-3.5 px-12"
                    onClick={() => setIsConfirmOpen(true)}
                  >
                    <p className="font-semi-normal text-body-l">Request payment</p>
                  </Button>
                )}

                {isOwner && status === "IN_PROGRESS" && paymentRequested && (
                  <Button
                    variant="outline"
                    className="border-light-grey-50 h-12 w-full rounded-xl border bg-white p-3.5 px-12"
                    onClick={() => setIsDisputeInfoOpen(true)}
                  >
                    <p className="font-semi-normal text-black-light text-body-l">Dispute job</p>
                  </Button>
                )}

                {isOwner && status === "PENDING" && (
                  <div className="flex w-full flex-col">
                    <div className="flex w-full flex-col gap-2 rounded-2xl border border-gray-200 p-4">
                      <p className="text-body-s font-semibold">
                        Include a message with your offer response.
                      </p>
                      <div className="flex justify-between">
                        <label htmlFor="job-remark" className="text-text-grey text-meta">
                          Remark
                        </label>
                        <span className="text-text-grey text-meta">100 characters</span>
                      </div>
                      <textarea
                        id="job-remark"
                        maxLength={100}
                        className="text-body-s h-20 w-full resize-none rounded-xl bg-gray-50 p-3"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                      />
                    </div>
                    <div className="mt-4 flex gap-3">
                      <Button
                        className="bg-gradient-green h-12 w-full rounded-2xl font-semibold"
                        onClick={() => markJob("accepted")}
                        disabled={markLoading}
                      >
                        {markLoading ? "Loading..." : "Accept"}
                      </Button>
                      <Button
                        variant="outline"
                        className="hover:text-light-white h-12 w-full rounded-2xl border border-gray-300 bg-white font-semibold text-black"
                        onClick={() => markJob("rejected")}
                        disabled={markLoading}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <ConfirmPaymentModal
            isOpen={isConfirmOpen}
            toggleMenu={() => setIsConfirmOpen(false)}
            job={job}
          />
          <PayNowModal job={job} isOpen={isPayNowOpen} toggleMenu={() => setIsPayNowOpen(false)} />
          <ConfirmCompletionModal
            isOpen={isCompletionOpen}
            toggle={() => setIsCompletionOpen(false)}
            job={job}
          />
          <DisputeJobModal
            isOpen={isDisputeInfoOpen}
            toggle={() => setIsDisputeInfoOpen(false)}
            toggleSubmit={() => setIsDisputeFormOpen(true)}
            isOwner={isOwner}
          />
          <SubmitDisputeModal
            isOpen={isDisputeFormOpen}
            toggle={() => setIsDisputeFormOpen(false)}
            jobId={job.id}
            onSubmitted={toggleMenu}
          />
          <ReviewModal
            isOpen={isReviewOpen}
            toggleMenu={() => setIsReviewOpen(false)}
            submit={(values) => reviewJobMutation.mutateAsync(values)}
          />
          {job.business && canSendAnotherQuote && (
            <RequestServiceModal
              id={job.business.id}
              isOpen={isRequestOpen}
              toggleMenu={() => setIsRequestOpen(false)}
              services={businessData?.business.services}
            />
          )}
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default ServiceDetailsModal;
