import React, { useState } from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRejectEventMutation } from "@/features/events/mutations";

interface RejectEventModalProps {
  isOpen: boolean;
  toggle: () => void;
  id?: string | number;
}

// Mirrors backend's RejectSubmissionRequest exactly (app/Http/Requests/
// Admin/RejectSubmissionRequest.php): 'reason' => ['string', 'required',
// 'min:3', 'max:1000'].
const MIN_REASON_LENGTH = 3;
const MAX_REASON_LENGTH = 1000;

function RejectEventModal({ isOpen, toggle, id }: RejectEventModalProps) {
  const [reason, setReason] = useState("");
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const rejectEventMutation = useRejectEventMutation(id);

  const trimmedReason = reason.trim();
  const isValid =
    trimmedReason.length >= MIN_REASON_LENGTH && trimmedReason.length <= MAX_REASON_LENGTH;

  const handleClose = () => {
    setReason("");
    toggle();
  };

  const submitAction = () => {
    if (isLoggedIn && id && isValid) {
      rejectEventMutation.mutate(trimmedReason, {
        onSuccess: () => {
          handleClose();
        },
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Reject event</DialogTitle>
        <div className="w-90 rounded-xl bg-white pt-4 pb-1">
          <div className={"px-4 py-1"}>
            <div className="flex items-center justify-between">
              <p className="text-body-xl font-sans font-semibold">Reject event</p>
              <div className="cursor-pointer" onClick={handleClose}>
                <XIcon />
              </div>
            </div>
          </div>
          <div className={"flex flex-col gap-4 px-4 py-4"}>
            <p className={"text-light-black text-body-s font-normal"}>
              The organiser will see this reason and can resubmit the event for review.
            </p>
            <p className={"text-text-grey text-body-s font-normal"}>Reason</p>
            <textarea
              className="bg-light-grey text-body-s min-h-24 resize-none rounded-xl p-3"
              placeholder="e.g. Missing venue details"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={MAX_REASON_LENGTH}
            />
            {reason.length > 0 && !isValid ? (
              <p className="text-red-1 text-meta leading-normal">
                Reason must be between {MIN_REASON_LENGTH} and {MAX_REASON_LENGTH} characters.
              </p>
            ) : null}
            <div className={"flex justify-between gap-2.5"}>
              <button
                className={"border-light-grey-50 h-12 w-39 rounded-xl border bg-white"}
                onClick={handleClose}
              >
                <p className={"text-body-l font-medium text-black"}>Cancel</p>
              </button>
              <button
                className={`border-red-2 bg-red-1 h-12 w-39 rounded-xl border text-center ${
                  !isValid || rejectEventMutation.isPending ? "cursor-not-allowed opacity-70" : ""
                }`}
                onClick={submitAction}
                disabled={!isValid || rejectEventMutation.isPending}
              >
                <p className={"text-body-l font-medium text-white"}>Reject</p>
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default RejectEventModal;
