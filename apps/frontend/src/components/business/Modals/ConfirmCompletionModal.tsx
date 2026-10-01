"use client";
import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { Button, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useAppDispatch } from "@/redux/hook";
import { useMarkJobCompletedMutation } from "@/features/business/mutations";
import { setSelectedJob } from "@/redux/tempSlice";
import { updateToastifyReducer } from "@/redux/toastifySlice";

interface ConfirmCompletionModalProps {
  isOpen: boolean;
  toggle: () => void;
  job: any;
}
const ConfirmCompletionModal: React.FC<ConfirmCompletionModalProps> = ({ isOpen, toggle, job }) => {
  const dispatch = useAppDispatch();
  const markJobCompletedMutation = useMarkJobCompletedMutation(job?.id);
  const completedLoading = markJobCompletedMutation.isPending;

  const markCompleted = () => {
    markJobCompletedMutation.mutate(undefined, {
      onSuccess: (result) => {
        dispatch(setSelectedJob(result.job));
        dispatch(
          updateToastifyReducer({
            show: true,
            message: result?.message,
            type: "success",
          }),
        );
        toggle();
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
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{"Confirm completion"}</DialogTitle>
        <div className="w-[360px] rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="tracking-custom font-sans text-[16px] leading-[27px] font-semibold">
              Confirm completion
            </p>
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggle}>
                <CloseIcon />
              </div>
            </div>
          </div>
          <div className="mt-2 flex w-[328px] flex-col items-center">
            <p className="mt-[16px] text-[14px] font-normal">
              Are you sure this service has been completed? If so, the payment will be released to
              the vendor and the order will be marked as completed.
            </p>
            <div className="mt-[16px] flex w-full justify-center gap-3">
              <Button
                className="bg-gradient-green shadow-custom-bottom h-[48px] w-full rounded-[12px] p-[14px] px-[48px]"
                onClick={markCompleted}
                disabled={completedLoading}
              >
                {completedLoading ? (
                  <>
                    <div
                      className={
                        "flex w-full items-center justify-center gap-[8px] rounded-2xl shadow-md"
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
                      <p className="text-light-white text-[16px] font-medium">Loading...</p>
                    </div>
                  </>
                ) : (
                  <p className="text-light-white text-[16px] font-medium">Confirm</p>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default ConfirmCompletionModal;
