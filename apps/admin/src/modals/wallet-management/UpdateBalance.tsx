import React from "react";
import { XIcon } from "lucide-react";
import { Input, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { AppDispatch } from "@/redux/store";
import { useFormik } from "formik";
import { useAddToWalletMutation, useDeductFromWalletMutation } from "@/features/wallet/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { formatNumberWithCommas } from "@/lib/formatNumber";

type UpdateBalanceInterface = {
  isOpen: boolean;
  toggle: () => void;
  updateType: string;
  balance?: number;
  // Optional: a consumer outside the wallet-management domain (e.g. the
  // user detail page's WalletView, refreshing its own Redux-backed account
  // info) that needs its own refresh on top of this mutation's own query
  // invalidation.
  reload?: () => void;
};

const UpdateBalance: React.FC<UpdateBalanceInterface> = ({
  isOpen,
  toggle,
  updateType,
  balance,
  reload,
}) => {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const id = params.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : undefined;

  const addToWallet = useAddToWalletMutation(id);
  const deductFromWallet = useDeductFromWalletMutation(id);

  const renderType = () => {
    switch (updateType) {
      case "add":
        return "Add to balance";
      case "deduct":
        return "Deduct from balance";
      default:
        return "Add to balance";
    }
  };

  const onMutationSettled = {
    onSuccess: () => {
      dispatch(
        updateToastifyReducer({
          show: true,
          message: `Success `,
          type: "success",
        }),
      );
      toggle();
      reload?.();
    },
    onError: (error: Error) => {
      dispatch(
        updateToastifyReducer({
          show: true,
          message: error?.message || `Something went wrong`,
          type: "error",
        }),
      );
    },
  };

  const formik = useFormik({
    initialValues: {
      amount: "",
    },
    onSubmit: (values) => {
      const amount = parseFloat(values.amount);
      if (updateType === "add" || updateType === "") {
        addToWallet.mutate(amount, onMutationSettled);
      } else {
        deductFromWallet.mutate(amount, onMutationSettled);
      }
    },
    enableReinitialize: true,
  });

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{renderType()}</DialogTitle>
        <div className="rounded-lg bg-white p-6 shadow-lg" style={{ width: "480px" }}>
          <div className="flex items-center justify-between">
            <p className={"font-semiBold text-[18px]"}>{renderType()}</p>
            <div className="cursor-pointer" onClick={toggle}>
              <XIcon />
            </div>
          </div>
          <div className={"flex flex-col"} style={{ marginTop: "20px", gap: "16px" }}>
            <div className={"flex flex-col"} style={{ gap: "4px" }}>
              <p className={"text-text-grey text-[14px] font-normal"}>Amount</p>
              <Input
                className={"bg-light-grey h-12 rounded-xl border-none px-3 py-3"}
                placeholder={"Amount"}
                value={formik.values.amount}
                onChange={formik.handleChange("amount")}
                onBlur={formik.handleBlur}
                id="amount"
              />
            </div>

            <p className={"text-[14px] font-normal"}>
              Wallet balance:{" "}
              <span className={"text-[14px] font-bold"}>
                {" "}
                ₦ {formatNumberWithCommas(balance || 0)}
              </span>
            </p>

            <div className={"flex justify-between gap-4"}>
              <button
                className={"border-light-grey-50 w-full rounded-xl border bg-white px-12 py-[11px]"}
                onClick={toggle}
              >
                <p className={"text-[16px] font-medium text-black"}>Cancel</p>
              </button>
              <button
                className={
                  "border-step-color bg-gradient-green w-full rounded-xl border px-12 py-[11px]"
                }
                onClick={() => {
                  formik.handleSubmit();
                }}
              >
                <p className={"text-[16px] font-medium text-white"}>Confirm</p>
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default UpdateBalance;
