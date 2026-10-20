"use client";
import React from "react";
import { Button, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";

type HowItWorksInterface = {
  isOpen: boolean;
  onClose: () => void;
  // "requester" books a service; "owner" receives and delivers requests.
  variant: "requester" | "owner";
  // Owner's plan commission in percent. Left out when the plan is unknown.
  serviceFeePercent?: number | null;
};

const STEPS = {
  requester: [
    [
      "Send Quote",
      "Start by sending a detailed quote outlining the service and its cost to the business owner.",
    ],
    ["Accept or Reject", "The business owner may choose to either accept or reject your quote."],
    [
      "Payment Held Securely",
      "If the business owner accept your quote, you'll make payment into Lemonade's secure escrow account. Funds will be held in trust until service is completely rendered.",
    ],
    [
      "Mark & Release payment",
      'When the service is completed, mark as "Completed" and funds will be disbursed to the business owner.',
    ],
  ],
  owner: [
    [
      "Receive Quote",
      "You will get a service request with detailed quote outlining the service needed by the client.",
    ],
    ["Accept or Reject", "You may choose to either accept or reject your quote."],
    [
      "Payment Held Securely",
      "If you accept the quote, the client will make payment into Lemonade's secure escrow account. Funds will be held in trust until service is completely rendered.",
    ],
    [
      "Mark & Release payment",
      'When the service is completed, you can "request payment". When the client confirms, you will get paid.',
    ],
  ],
} as const;

const feeText = (percent: number) =>
  percent === 0
    ? "Your plan has no Lemonade service fee."
    : `Lemonade charges ${percent}% for all services.`;

const HowItWorksModal: React.FC<HowItWorksInterface> = ({
  isOpen,
  onClose,
  variant,
  serviceFeePercent,
}) => (
  <Dialog
    open={isOpen}
    onOpenChange={(open) => {
      if (!open) onClose();
    }}
  >
    <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
      <div className="laptop:w-120 w-full max-w-120 rounded-lg bg-white p-6 shadow-lg">
        <DialogTitle className="text-title-l font-sans leading-normal font-bold">
          How it works
        </DialogTitle>
        <p className="text-body-s mt-4 font-normal">
          Here is how the Lemonade&apos;s service management works:
        </p>
        <ol className="text-body-s mt-4 list-decimal space-y-3 pl-5 font-normal">
          {STEPS[variant].map(([title, text]) => (
            <li key={title}>
              <span className="font-semibold">{title}:</span> {text}
            </li>
          ))}
        </ol>
        {variant === "owner" && typeof serviceFeePercent === "number" && (
          <p className="text-body-s mt-4 font-normal">{feeText(serviceFeePercent)}</p>
        )}
        <Button
          className="bg-gradient-green mt-6 h-12 w-full rounded-xl p-3.5 px-12"
          onClick={onClose}
        >
          I understand
        </Button>
      </div>
    </DialogContentBare>
  </Dialog>
);

export default HowItWorksModal;
