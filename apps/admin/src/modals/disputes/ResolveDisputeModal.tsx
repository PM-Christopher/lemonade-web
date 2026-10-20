"use client";
import React from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useResolveDisputeMutation } from "@/features/disputes/mutations";
import type { DisputeResolution } from "@/features/disputes/api";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";

interface ResolveDisputeModalProps {
  isOpen: boolean;
  toggle: () => void;
  id: string;
  resolution: DisputeResolution;
}

const COPY: Record<DisputeResolution, { title: string; body: string; action: string }> = {
  refund: {
    title: "Refund client",
    body: "The escrowed payment goes back to the client and the job is marked completed. This can't be undone.",
    action: "Refund",
  },
  release: {
    title: "Pay business owner",
    body: "The escrowed payment is released to the business owner after the plan fee and the job is marked completed. This can't be undone.",
    action: "Pay owner",
  },
};

function ResolveDisputeModal({ isOpen, toggle, id, resolution }: ResolveDisputeModalProps) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const resolveMutation = useResolveDisputeMutation(id);
  const copy = COPY[resolution];

  const submitAction = () => {
    if (!isLoggedIn) return;
    resolveMutation.mutate(
      { resolution },
      {
        onSuccess: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: apiMessage("Dispute resolved"),
              type: "success",
            }),
          );
          toggle();
        },
        onError: (error) => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: error?.message || "Something went wrong",
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
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{copy.title}</DialogTitle>
        <div className="w-90 rounded-xl bg-white pt-4 pb-1">
          <div className={"px-4 py-1"}>
            <div className="flex items-center justify-between">
              <p className="text-body-xl font-sans font-semibold">{copy.title}</p>
              <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </button>
            </div>
          </div>
          <div className={"flex flex-col gap-4 px-4 py-4"}>
            <p className={"text-light-black text-body-s font-normal"}>{copy.body}</p>
            <div className={"flex justify-between gap-2.5"}>
              <button
                className={"border-light-grey-50 h-12 w-39 rounded-xl border bg-white"}
                onClick={toggle}
              >
                <p className={"text-body-l font-medium text-black"}>Cancel</p>
              </button>
              <button
                className={
                  "border-step-color bg-gradient-green h-12 w-39 rounded-xl border text-center disabled:opacity-60"
                }
                onClick={submitAction}
                disabled={resolveMutation.isPending}
              >
                <p className={"text-body-l font-medium text-white"}>{copy.action}</p>
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default ResolveDisputeModal;
