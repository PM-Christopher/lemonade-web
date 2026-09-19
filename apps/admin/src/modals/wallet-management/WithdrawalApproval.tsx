import React from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useParams } from "next/navigation";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { useWithdrawalRequestDecisionMutation } from "@/features/wallet/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";

type WithdrawalActionInterface = {
  isOpen: boolean;
  toggle: () => void;
};

const WithdrawalApproval: React.FC<WithdrawalActionInterface> = ({
  isOpen,
  toggle,
}) => {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const id = params.id
    ? Array.isArray(params.id)
      ? parseInt(params.id[0])
      : parseInt(params.id)
    : undefined;

  const decision = useWithdrawalRequestDecisionMutation(id);

  const isReject = () => {
    decision.mutate("approve", {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: `Success `,
            type: "success",
          }),
        );
        toggle();
      },
      onError: (error) => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: error?.message || `Something went wrong`,
            type: "error",
          }),
        );
      },
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Approve withdrawal</DialogTitle>
        <div
          className="rounded-lg bg-white p-6 shadow-lg"
          style={{ width: "480px" }}
        >
          <div className="flex items-center justify-between">
            <p className={"text-[18px] font-semiBold"}>Approve withdrawal</p>
            <div className="cursor-pointer" onClick={toggle}>
              <XIcon />
            </div>
          </div>
          <div
            className={"flex flex-col"}
            style={{ marginTop: "20px", gap: "16px" }}
          >
            <p className={"text-[14px] font-normal"}>
              Are you sure you want to approve this wallet balance withdrawal?
            </p>
            <div
              className={"flex flex-col rounded-[12px] bg-mid-grey p-[16px]"}
              style={{ gap: "17px" }}
            >
              {/* Hardcoded placeholder data (amount/account holder/bank/account
                number) — this modal renders no real withdrawal-request detail
                today, only a hardcoded fixture. It's a pre-existing bug, not
                introduced by the Phase 1 lint wiring; fixing it needs the
                caller to pass the actual withdrawal request through as a
                prop, which none of this component's callers currently do.
                Not fixed here — see docs/ARCHITECTURE.md. */}
              <div
                className={"flex flex-col text-center"}
                style={{
                  border: "1px dashed #5B8601",
                  paddingTop: "16px",
                  paddingBottom: "16px",
                  paddingLeft: "102px",
                  paddingRight: "102px",
                  backgroundColor: "#F5FAEB",
                  borderRadius: "8px",
                }}
              >
                <p className={"text-[12px] font-medium text-text-grey"}>
                  Amount
                </p>
                <p
                  className={"text-[24px] font-semiBold"}
                  style={{ color: "#5B8601" }}
                >
                  N120,000
                </p>
              </div>
              <div className={"flex flex-col"}>
                <p className={"text-[12px] font-medium text-text-grey"}>
                  Account holder
                </p>
                <p className={"text-[14px] font-semiBold"}>Funmilayo Johnson</p>
              </div>
              <div className={"flex flex-col"}>
                <p className={"text-[12px] font-medium text-text-grey"}>
                  Bank name
                </p>
                <p className={"text-[14px] font-semiBold"}>GTB</p>
              </div>
              <div className={"flex flex-col"}>
                <p className={"text-[12px] font-medium text-text-grey"}>
                  Account number
                </p>
                <p className={"text-[14px] font-semiBold"}>0123456789</p>
              </div>
            </div>
            <div className={"flex justify-between gap-[16px]"}>
              <button
                className={
                  "w-full rounded-[12px] border-[1px] border-light-grey-50 bg-white px-[48px] py-[11px]"
                }
                onClick={toggle}
              >
                <p className={"text-[16px] font-medium text-black"}>Cancel</p>
              </button>
              <button
                className={
                  "w-full rounded-[12px] border-[1px] border-step-color bg-gradient-green px-[48px] py-[11px]"
                }
                onClick={isReject}
              >
                <p className={"text-[16px] font-medium text-white"}>Approve</p>
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default WithdrawalApproval;
