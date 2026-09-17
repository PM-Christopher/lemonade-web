import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Button } from "@lemonade/ui";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useAppDispatch } from "@/redux/hook";
import { useMakeJobPaymentMutation } from "@/features/business/mutations";

const PayNowModal = ({
  isOpen,
  toggleMenu,
  job,
}: {
  isOpen: boolean;
  toggleMenu: () => void;
  job: any;
}) => {
  const dispatch = useAppDispatch();
  const makeJobPaymentMutation = useMakeJobPaymentMutation(job?.id);
  const payLoading = makeJobPaymentMutation.isPending;

  const handlePayNow = () => {
    makeJobPaymentMutation.mutate(
      { redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/business` },
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
    <div
      className={`fixed inset-0 z-50 items-center justify-center bg-gray-800 bg-opacity-50 ${isOpen ? "flex" : "hidden"}`}
    >
      <div className="w-[360px] rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <p className="font-sans text-[16px] font-semibold leading-[27px] tracking-custom">
            Make Payment
          </p>
          <div className="flex items-center gap-2">
            <div className="cursor-pointer" onClick={toggleMenu}>
              <CloseIcon />
            </div>
          </div>
        </div>
        <div className="mt-2 flex flex-col items-center py-[16px]">
          <div className="gap-[8px] rounded-[8px] border-[1px] border-dashed border-mid-green bg-light-green-10 p-[31px] px-[102px]">
            <p className="text-[24px] font-semiBold text-mid-green">
              ₦{formatNumberWithCommas(job?.amount)}
            </p>
          </div>
          <p className="mt-[16px] text-[14px] font-normal">
            Your payment will be held securely in escrow until you mark the service as completed.
          </p>
          <div className="mt-[16px] flex w-full justify-center gap-3">
            <Button
              className="h-[48px] w-full rounded-[12px] bg-gradient-green p-[14px] px-[48px] shadow-custom-bottom"
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
                  <p className="text-[16px] font-semi-normal text-light-white">Loading...</p>
                </div>
              ) : (
                <p className="text-[16px] font-semi-normal">Pay now</p>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayNowModal;
