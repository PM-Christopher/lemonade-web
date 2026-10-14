import React from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useWithdrawalRequestDecisionMutation } from "@/features/wallet/mutations";
import type { WalletDetail } from "@/features/wallet/api";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { errorMessage } from "@/lib/api-error";

type Decision = "approve" | "reject";

type WithdrawalDecisionModalProps = {
  isOpen: boolean;
  toggle: () => void;
  decision: Decision;
  withdrawalId: string;
  withdrawal: WalletDetail["info"] | undefined;
};

const COPY: Record<Decision, { title: string; question: string; action: string }> = {
  approve: {
    title: "Approve withdrawal",
    question: "Are you sure you want to approve and pay out this withdrawal?",
    action: "Approve",
  },
  reject: {
    title: "Reject withdrawal",
    question: "Are you sure you want to reject this withdrawal?",
    action: "Reject",
  },
};

/** Confirms an approve or reject decision on one real withdrawal request. */
const WithdrawalDecisionModal: React.FC<WithdrawalDecisionModalProps> = ({
  isOpen,
  toggle,
  decision,
  withdrawalId,
  withdrawal,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const decide = useWithdrawalRequestDecisionMutation(withdrawalId);
  const copy = COPY[decision];

  const confirm = () => {
    decide.mutate(decision, {
      onSuccess: (result) => {
        // Approval moves the money first; a failed bank transfer is reported, not hidden.
        const failed = result.payout_status === "failed";
        dispatch(
          updateToastifyReducer({
            show: true,
            message: failed
              ? `Approved, but the payout failed: ${result.failure_reason || "unknown reason"}`
              : `Withdrawal ${decision === "approve" ? "approved" : "rejected"}`,
            type: failed ? "error" : "success",
          }),
        );
        toggle();
      },
      onError: (error) => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: errorMessage(error, "Something went wrong"),
            type: "error",
          }),
        );
      },
    });
  };

  if (!isOpen) return null;

  const details: Array<[string, string | undefined]> = [
    ["Account holder", withdrawal?.account_name ?? withdrawal?.fullname],
    ["Bank name", withdrawal?.bank_name],
    ["Account number", withdrawal?.account_number],
  ];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <div className="w-120 rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-semiBold text-lg">{copy.title}</DialogTitle>
            <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
              <XIcon aria-hidden="true" />
            </button>
          </div>
          <div className="mt-5 flex flex-col gap-4">
            <p className="text-sm font-normal">{copy.question}</p>
            <div className="bg-mid-grey flex flex-col gap-4 rounded-xl p-4">
              <div className="border-light-green rounded-lg border border-dashed bg-[#F5FAEB] py-4 text-center">
                <p className="text-text-grey text-xs font-medium">Amount</p>
                <p className="font-semiBold text-2xl text-[#5B8601]">
                  ₦{formatNumberWithCommas(Number(withdrawal?.amount) || 0)}
                </p>
              </div>
              {details.map(([label, value]) => (
                <div className="flex flex-col" key={label}>
                  <p className="text-text-grey text-xs font-medium">{label}</p>
                  <p className="font-semiBold text-sm">{value || "—"}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between gap-4">
              <button
                type="button"
                className="border-light-grey-50 w-full rounded-xl border bg-white px-12 py-3 text-base font-medium text-black"
                onClick={toggle}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={decide.isPending}
                className={`w-full rounded-xl border px-12 py-3 text-base font-medium text-white disabled:opacity-70 ${
                  decision === "approve" ? "border-step-color bg-gradient-green" : "bg-[#DB0000]"
                }`}
                onClick={confirm}
              >
                {decide.isPending ? "Working..." : copy.action}
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default WithdrawalDecisionModal;
