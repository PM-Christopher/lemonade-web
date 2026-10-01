import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import { Button, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { useRouter } from "next/navigation";

export interface PaymentConfirmJob {
  amount?: number;
  name?: string;
  services?: unknown[];
  updated_at?: string;
}

const PaymentConfirmModal = ({
  isOpen,
  job,
  toggleMenu,
}: {
  isOpen: boolean;
  toggleMenu: () => void;
  job: PaymentConfirmJob;
}) => {
  const router = useRouter();
  const backToBusiness = () => {
    toggleMenu();
    const currentPath = window.location.pathname;
    router.push(currentPath);
  };
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggleMenu();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{"Payment successful"}</DialogTitle>
        <div className="hide-scrollbar max-h-[90vh] w-full max-w-[480px] animate-[fadeIn_0.25s_ease-out] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
          {/* Close Button */}
          <div className="flex justify-end">
            <button onClick={toggleMenu} className="rounded-lg p-2 transition hover:bg-gray-100">
              <CloseIcon />
            </button>
          </div>

          {/* Icon */}
          <div className="mt-4 flex justify-center">
            <Image
              src={"/images/jobVerified.png"}
              alt="Payment Verified"
              width={160}
              height={160}
            />
          </div>

          {/* Title & Description */}
          <div className="mt-6 px-4 text-center">
            <p className="text-light-green text-[22px] font-semibold">Payment successful</p>
            <p className="text-text-grey mt-2 text-[14px]">
              Your payment has been securely received and held until the service is completed.
            </p>
          </div>

          {/* Amount */}
          <div className="mt-6">
            <p className="text-text-grey text-[14px]">Amount paid</p>
            <p className="mt-1 text-[22px] font-semibold">
              N{formatNumberWithCommas(job?.amount ?? 0)}
            </p>
          </div>

          {/* Business Name */}
          <div className="mt-5">
            <p className="text-text-grey text-[14px]">Business name</p>
            <p className="text-light-black text-[16px] font-medium">{job?.name}</p>
          </div>

          {/* Services Rendered */}
          <div className="mt-5">
            <p className="text-text-grey text-[14px]">Services rendered</p>
            <p className="text-light-black text-[16px] font-medium">{job?.services?.length}</p>
          </div>

          {/* Payment Date */}
          <div className="mt-5">
            <p className="text-text-grey text-[14px]">Payment date</p>
            <p className="text-light-black text-[16px] font-medium">{job?.updated_at}</p>
          </div>

          {/* Button */}
          <Button
            className="bg-gradient-green mt-8 h-12 w-full rounded-xl shadow-md transition hover:shadow-lg"
            onClick={backToBusiness}
            type="button"
          >
            <p className="text-[16px] font-medium text-white">View service</p>
          </Button>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default PaymentConfirmModal;
