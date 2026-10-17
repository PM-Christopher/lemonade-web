import { routes } from "@/lib/routes";
import { appUrl } from "@/lib/app-url";
import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Button, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useAppDispatch } from "@/redux/hook";
import { useMakeJobPaymentMutation } from "@/features/business/mutations";
import type { ServiceRequestJob } from "@/features/business/api";

const PayNowModal = ({
  isOpen,
  toggleMenu,
  job,
}: {
  isOpen: boolean;
  toggleMenu: () => void;
  job: ServiceRequestJob;
}) => {
  const dispatch = useAppDispatch();
  const makeJobPaymentMutation = useMakeJobPaymentMutation(job.id);
  const payLoading = makeJobPaymentMutation.isPending;

  const handlePayNow = () => {
    makeJobPaymentMutation.mutate(
      { redirect_url: appUrl(routes.BUSINESS) },
      {
        onSuccess: (result) => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Redirecting to payment link",
              type: "success",
            }),
          );
          toggleMenu();
          window.location.href = result.payment;
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
      },
    );
  };
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggleMenu();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{"Make Payment"}</DialogTitle>
        <div className="w-90 rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="tracking-custom text-body-l font-sans leading-6.75 font-semibold">
              Make Payment
            </p>
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggleMenu}>
                <CloseIcon />
              </div>
            </div>
          </div>
          <div className="mt-2 flex flex-col items-center py-4">
            <div className="border-mid-green bg-light-green-10 gap-2 rounded-lg border border-dashed p-7.75 px-25.5">
              <p className="font-semiBold text-mid-green text-title-l leading-normal">
                ₦{formatNumberWithCommas(job?.amount ?? 0)}
              </p>
            </div>
            <p className="text-body-s mt-4 font-normal">
              Your payment will be held securely in escrow until you mark the service as completed.
            </p>
            <div className="mt-4 flex w-full justify-center gap-3">
              <Button
                className="bg-gradient-green h-12 w-full rounded-xl p-3.5 px-12"
                onClick={handlePayNow}
                disabled={payLoading}
              >
                {payLoading ? (
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
                    <p className="font-semi-normal text-light-white text-body-l">Loading...</p>
                  </div>
                ) : (
                  <p className="font-semi-normal text-body-l">Pay now</p>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default PayNowModal;
