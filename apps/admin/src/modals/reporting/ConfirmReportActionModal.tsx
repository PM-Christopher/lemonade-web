"use client";
import React from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";

interface ConfirmReportActionModalProps {
  isOpen: boolean;
  toggle: () => void;
  title: string;
  body: string;
  confirmLabel: string;
  // Red for destructive actions, green otherwise.
  tone: "green" | "red";
  pending: boolean;
  onConfirm: () => void;
}

function ConfirmReportActionModal({
  isOpen,
  toggle,
  title,
  body,
  confirmLabel,
  tone,
  pending,
  onConfirm,
}: ConfirmReportActionModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="w-90 max-w-[92vw] rounded-xl bg-white pt-4 pb-1">
          <div className="px-4 py-1">
            <div className="flex items-center justify-between">
              <p className="text-body-xl font-sans font-semibold">{title}</p>
              <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4 px-4 py-4">
            <p className="text-light-black text-body-s font-normal">{body}</p>
            <div className="flex justify-between gap-2.5">
              <button
                className="border-light-grey-50 h-12 w-39 rounded-xl border bg-white"
                onClick={toggle}
              >
                <p className="text-body-l font-medium text-black">Cancel</p>
              </button>
              <button
                className={`h-12 w-39 rounded-xl border text-center disabled:opacity-60 ${
                  tone === "red" ? "border-red-2 bg-red-1" : "border-step-color bg-gradient-green"
                }`}
                onClick={onConfirm}
                disabled={pending}
              >
                <p className="text-body-l font-medium text-white">{confirmLabel}</p>
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default ConfirmReportActionModal;
