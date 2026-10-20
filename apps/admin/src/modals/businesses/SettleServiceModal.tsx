"use client";
import React from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import type { ServiceDetailResponse } from "@/features/businesses/api";
import { useSettleServiceMutation } from "@/features/businesses/mutations";
import { naira } from "@/views/transactions/transactionFormat";
import { errorMessage } from "@/lib/api-error";

interface SettleServiceModalProps {
  isOpen: boolean;
  toggle: () => void;
  serviceId: string;
  resolution: "release" | "refund";
  service: ServiceDetailResponse["service"] | undefined;
}

// Confirms paying escrow to the business owner, or back to the client.
function SettleServiceModal({
  isOpen,
  toggle,
  serviceId,
  resolution,
  service,
}: SettleServiceModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const mutation = useSettleServiceMutation(serviceId);
  const isRelease = resolution === "release";
  const bank = service?.owner_bank;

  const confirm = () =>
    mutation.mutate(resolution, {
      onSuccess: toggle,
      onError: (error) =>
        dispatch(
          updateToastifyReducer({
            show: true,
            message: errorMessage(error, "Couldn't settle this service."),
            type: "error",
          }),
        ),
    });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">
          {isRelease ? "Release funds" : "Refund client"}
        </DialogTitle>
        <div className="w-90 max-w-[94vw] rounded-xl bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-body-xl font-sans font-semibold">
              {isRelease ? "Release funds" : "Refund client"}
            </p>
            <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
              <XIcon />
            </button>
          </div>
          <div className="mt-4 rounded-xl border border-dashed border-green-300 bg-lime-50 p-3 text-center">
            {isRelease && <p className="text-text-grey text-meta">Amount</p>}
            <p className="text-light-green-70 text-body-xl font-semibold">
              {naira(service?.escrow?.amount)}
            </p>
          </div>
          {isRelease && bank && (
            <div className="bg-light-grey mt-3 flex flex-col gap-2 rounded-xl p-3">
              <div>
                <p className="text-text-grey text-meta">Account holder</p>
                <p className="text-body-s font-semibold">{bank.account_name}</p>
              </div>
              <div>
                <p className="text-text-grey text-meta">Bank name</p>
                <p className="text-body-s font-semibold">{bank.bank_name}</p>
              </div>
              <div>
                <p className="text-text-grey text-meta">Account number</p>
                <p className="text-body-s font-semibold">{bank.account_number}</p>
              </div>
            </div>
          )}
          <p className="text-light-black text-meta mt-3 font-normal">
            {isRelease
              ? "Confirm you want to release the funds in escrow to the business owner."
              : "Confirm you want to refund the funds in escrow to the client. Contact the client for their account information to issue a refund."}
          </p>
          <div className="mt-4 flex justify-between gap-2.5">
            <button
              type="button"
              className="border-light-grey-50 h-12 w-39 rounded-xl border bg-white"
              onClick={toggle}
            >
              <p className="text-body-l font-medium text-black">Cancel</p>
            </button>
            <button
              type="button"
              disabled={mutation.isPending}
              className="bg-gradient-green h-12 w-39 rounded-xl border text-center disabled:opacity-60"
              onClick={confirm}
            >
              <p className="text-body-l font-medium text-white">
                {mutation.isPending ? "Working..." : "Confirm"}
              </p>
            </button>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default SettleServiceModal;
