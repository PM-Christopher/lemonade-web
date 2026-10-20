import { images } from "@/lib/images";
import { useNavigation } from "@/hooks/useNavigation";
import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import { Button, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { formatMinorNaira } from "@/lib/formatNumber";

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
  const { push } = useNavigation();
  const backToBusiness = () => {
    toggleMenu();
    const currentPath = window.location.pathname;
    push(currentPath);
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
        <div className="hide-scrollbar max-h-[90vh] w-full max-w-120 animate-[fadeIn_0.25s_ease-out] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
          {/* Close Button */}
          <div className="flex justify-end">
            <button onClick={toggleMenu} className="rounded-lg p-2 transition hover:bg-gray-100">
              <CloseIcon />
            </button>
          </div>

          {/* Icon */}
          <div className="mt-4 flex justify-center">
            <Image src={images.JOB_VERIFIED} alt="Payment Verified" width={160} height={160} />
          </div>

          {/* Title & Description */}
          <div className="mt-6 px-4 text-center">
            <p className="text-light-green text-title-r leading-normal font-semibold">
              Payment successful
            </p>
            <p className="text-text-grey text-body-s mt-2">
              Your payment has been securely received and held until the service is completed.
            </p>
          </div>

          {/* Amount */}
          <div className="mt-6">
            <p className="text-text-grey text-body-s">Amount paid</p>
            <p className="text-title-r mt-1 leading-normal font-semibold">
              {formatMinorNaira(job?.amount)}
            </p>
          </div>

          {/* Business Name */}
          <div className="mt-5">
            <p className="text-text-grey text-body-s">Business name</p>
            <p className="text-light-black text-body-l font-medium">{job?.name}</p>
          </div>

          {/* Services Rendered */}
          <div className="mt-5">
            <p className="text-text-grey text-body-s">Services rendered</p>
            <p className="text-light-black text-body-l font-medium">{job?.services?.length}</p>
          </div>

          {/* Payment Date */}
          <div className="mt-5">
            <p className="text-text-grey text-body-s">Payment date</p>
            <p className="text-light-black text-body-l font-medium">{job?.updated_at}</p>
          </div>

          {/* Button */}
          <Button
            className="bg-gradient-green mt-8 h-12 w-full rounded-xl shadow-md transition hover:shadow-lg"
            onClick={backToBusiness}
            type="button"
          >
            <p className="text-body-l font-medium text-white">View service</p>
          </Button>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default PaymentConfirmModal;
