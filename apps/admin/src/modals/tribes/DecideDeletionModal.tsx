"use client";
import React, { useState } from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle, Textarea } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import type { TribeDeletionRequestItem } from "@/features/tribes/api";
import { useDecideTribeDeletionMutation } from "@/features/tribes/mutations";
import { errorMessage } from "@/lib/api-error";
import { naira } from "@/views/transactions/transactionFormat";

interface DecideDeletionModalProps {
  request: TribeDeletionRequestItem | null;
  decision: "approve" | "reject";
  toggle: () => void;
}

// Approve or reject an owner's request to delete a paid tribe.
function DecideDeletionModal({ request, decision, toggle }: DecideDeletionModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const mutation = useDecideTribeDeletionMutation();
  const [reason, setReason] = useState("");
  const isApprove = decision === "approve";

  const confirm = () => {
    if (!request) return;
    mutation.mutate(
      { id: request.id, decision, reason: reason.trim() || undefined },
      {
        onSuccess: toggle,
        onError: (error) =>
          dispatch(
            updateToastifyReducer({
              show: true,
              message: errorMessage(error, "Couldn't save that decision."),
              type: "error",
            }),
          ),
      },
    );
  };

  return (
    <Dialog
      open={request !== null}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">
          {isApprove ? "Approve deletion" : "Reject deletion"}
        </DialogTitle>
        <div className="w-96 max-w-[94vw] rounded-xl bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-body-xl font-sans font-semibold">
              {isApprove ? "Approve deletion" : "Reject deletion"}
            </p>
            <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
              <XIcon />
            </button>
          </div>
          <p className="text-light-black text-body-s mt-4 font-normal">
            {isApprove
              ? `Delete ${request?.tribe?.name ?? "this tribe"}? It has earned ${naira(request?.tribe?.total_earned)} from ${request?.tribe?.members ?? 0} members. This cannot be undone here.`
              : `Keep ${request?.tribe?.name ?? "this tribe"}? The owner will be told it was not deleted.`}
          </p>
          <Textarea
            aria-label="Reason"
            className="bg-light-grey mt-3 min-h-20 rounded-xl"
            placeholder={isApprove ? "Note (optional)" : "Tell the owner why (optional)"}
            value={reason}
            maxLength={1000}
            onChange={(event) => setReason(event.target.value)}
          />
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
              className={`h-12 w-39 rounded-xl border text-center disabled:opacity-60 ${isApprove ? "border-red-2 bg-red-1" : "bg-gradient-green"}`}
              onClick={confirm}
            >
              <p className="text-body-l font-medium text-white">
                {isApprove ? "Delete" : "Keep tribe"}
              </p>
            </button>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default DecideDeletionModal;
