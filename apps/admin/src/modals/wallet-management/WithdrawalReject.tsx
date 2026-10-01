import React from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useWithdrawalRequestDecisionMutation } from "@/features/wallet/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useParams } from "next/navigation";

type WithdrawalRejectInterface = {
  isOpen: boolean;
  toggle: () => void;
};

const WithdrawalReject: React.FC<WithdrawalRejectInterface> = ({ isOpen, toggle }) => {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const id = params.id
    ? Array.isArray(params.id)
      ? parseInt(params.id[0])
      : parseInt(params.id)
    : undefined;

  const decision = useWithdrawalRequestDecisionMutation(id);

  const isReject = () => {
    decision.mutate("reject", {
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
        <DialogTitle className="sr-only">Reject withdrawal</DialogTitle>
        <div className="rounded-lg bg-white p-6 shadow-lg" style={{ width: "480px" }}>
          <div className="flex items-center justify-between">
            <p className={"font-semiBold text-[18px]"}>Reject withdrawal</p>
            <div className="cursor-pointer" onClick={toggle}>
              <XIcon />
            </div>
          </div>
          <div className={"flex flex-col"} style={{ marginTop: "20px", gap: "16px" }}>
            <p className={"text-[14px] font-normal"}>
              Are you sure you want to reject this wallet balance withdrawal?
            </p>

            <div className={"flex justify-between gap-[16px]"}>
              <button
                className={
                  "border-light-grey-50 w-full rounded-[12px] border-[1px] bg-white px-[48px] py-[11px]"
                }
                onClick={toggle}
              >
                <p className={"text-[16px] font-medium text-black"}>Cancel</p>
              </button>
              <button
                className={"w-full rounded-[12px] border-[1px] px-[48px] py-[11px]"}
                style={{ background: "#DB0000" }}
                onClick={isReject}
              >
                <p className={"text-[16px] font-medium text-white"}>Reject</p>
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default WithdrawalReject;
