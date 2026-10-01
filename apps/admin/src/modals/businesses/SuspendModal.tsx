"use client";
import React, { useState } from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle, Textarea } from "@lemonade/ui";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useSuspendBusinessMutation } from "@/features/businesses/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";

interface SuspendModalProps {
  isOpen: boolean;
  toggle: () => void;
  id: string;
}

// Mirrors RejectSubmissionRequest's `reason` rule (required string,
// 3-1000 chars) — suspend shares that FormRequest with reject on the
// backend. Client-side check is for responsiveness only.
const MIN_REASON_LENGTH = 3;
const MAX_REASON_LENGTH = 1000;

function SuspendModal({ isOpen, toggle, id }: SuspendModalProps) {
  const [reason, setReason] = useState("");
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const suspendBusinessMutation = useSuspendBusinessMutation(id);

  const trimmedLength = reason.trim().length;
  const isReasonValid = trimmedLength >= MIN_REASON_LENGTH && trimmedLength <= MAX_REASON_LENGTH;

  const submitAction = () => {
    if (!isLoggedIn || !isReasonValid) return;
    suspendBusinessMutation.mutate(
      { reason: reason.trim() },
      {
        onSuccess: () => {
          dispatch(
            updateToastifyReducer({ show: true, message: "Business suspended", type: "success" }),
          );
          setReason("");
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
        <DialogTitle className="sr-only">Suspend business</DialogTitle>
        <div className="w-[360px] rounded-xl bg-white pt-4 pb-1">
          <div className={"px-4 py-1"}>
            <div className="flex items-center justify-between">
              <p className="font-sans text-[18px] leading-[27px] font-semibold">Suspend business</p>
              <div className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </div>
            </div>
          </div>
          <div className={"flex flex-col gap-4 px-4 py-4"}>
            <p className={"text-light-black text-[14px] font-normal"}>
              Are you sure you want to suspend this listing? It will no longer be visible on the
              platform.
            </p>
            <p className={"text-text-grey text-[14px] font-normal"}>Reason</p>
            <Textarea
              className="bg-light-grey min-h-24 rounded-xl"
              placeholder="Explain why this listing is being suspended..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={MAX_REASON_LENGTH}
            />
            <div className={"flex justify-between gap-2.5"}>
              <button
                className={"border-light-grey-50 h-12 w-[156px] rounded-xl border bg-white"}
                onClick={toggle}
              >
                <p className={"text-[16px] font-medium text-black"}>Cancel</p>
              </button>
              <button
                className={
                  "border-red-2 bg-red-1 h-12 w-[156px] rounded-xl border text-center disabled:opacity-50"
                }
                onClick={submitAction}
                disabled={!isReasonValid}
              >
                <p className={"text-[16px] font-medium text-white"}>Suspend</p>
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default SuspendModal;
