"use client";
import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/redux/hook";
import { useRouter } from "next/navigation";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useRequestJobPaymentMutation } from "@/features/business/mutations";
const ConfirmPaymentModal = ({
  isOpen,
  toggleMenu,
  job,
  sMenu,
}: {
  isOpen: boolean;
  toggleMenu: () => void;
  sMenu: () => void;
  job: any;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const requestJobPaymentMutation = useRequestJobPaymentMutation(job?.id);
  const requestPLoading = requestJobPaymentMutation.isPending;

  const handleRequestPayment = () => {
    requestJobPaymentMutation.mutate(undefined, {
      onSuccess: (result) => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: result?.message,
            type: "success",
          }),
        );
        toggleMenu();
        sMenu();
        router.push(`/business/${job?.business_id}/jobs`);
      },
      onError: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Something went wrong",
            type: "error",
          }),
        );
      },
    });
  };

  return (
    <div
      className={`fixed inset-0 z-50 items-center justify-center bg-gray-800 bg-opacity-50 ${isOpen ? "flex" : "hidden"}`}
    >
      <div className="w-[360px] rounded-lg bg-white px-6 pt-4 shadow-lg">
        <div className="flex items-center justify-between">
          <p className="font-sans text-[16px] font-semibold leading-[27px] tracking-custom">
            Request payment
          </p>
          <div className="cursor-pointer" onClick={toggleMenu}>
            <CloseIcon />
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center pb-[10px]">
          <p className="w-[328px] text-[14px] font-normal">
            To ensure a smooth process, please mark the job as completed only after it&apos;s
            finished. Your payment will be released only when the client confirms completion. You
            may dispute delayed payments.
          </p>
          <div className="mt-[40px] flex w-full justify-center gap-3">
            <Button
              className={`h-[48px] w-full rounded-[12px] p-[14px] px-[48px] ${requestPLoading ? "bg-light-green-20" : "bg-gradient-green"} shadow-custom-bottom`}
              onClick={handleRequestPayment}
              disabled={requestPLoading}
            >
              {requestPLoading ? (
                <div className={"flex gap-2"}>
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
                  <p className="text-[16px] font-semi-normal text-light-white">Loading...</p>
                </div>
              ) : (
                <p className="text-[16px] font-semi-normal">Request payment</p>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPaymentModal;
