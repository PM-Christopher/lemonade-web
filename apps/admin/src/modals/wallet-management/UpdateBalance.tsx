import React from "react";
import { XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { AppDispatch } from "@/redux/store";
import { useFormik } from "formik";
import {
  useAddToWalletMutation,
  useDeductFromWalletMutation,
} from "@/features/wallet/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { formatNumberWithCommas } from "@/lib/formatNumber";

type UpdateBalanceInterface = {
  isOpen: boolean;
  toggle: () => void;
  updateType: string;
  userDetails?: any;
  balance?: any;
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
  userDetails,
  balance,
  reload,
}) => {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const id = params.id
    ? Array.isArray(params.id)
      ? parseInt(params.id[0])
      : parseInt(params.id)
    : undefined;

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
        })
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
        })
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
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 ${
        isOpen ? "flex" : "hidden"
      }`}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6"
        style={{ width: "480px" }}
      >
        <div className="flex justify-between items-center">
          <p className={"text-[18px] font-semiBold"}>{renderType()}</p>
          <div className="cursor-pointer" onClick={toggle}>
            <XIcon />
          </div>
        </div>
        <div
          className={"flex flex-col"}
          style={{ marginTop: "20px", gap: "16px" }}
        >
          <div className={"flex flex-col"} style={{ gap: "4px" }}>
            <p className={"text-text-grey font-normal text-[14px]"}>Amount</p>
            <Input
              className={
                "bg-light-grey h-[48px] rounded-[12px] py-[12px] px-[12px] border-none"
              }
              placeholder={"Amount"}
              value={formik.values.amount}
              onChange={formik.handleChange("amount")}
              onBlur={formik.handleBlur}
              id="amount"
            />
          </div>

          <p className={"font-normal text-[14px]"}>
            Wallet balance:{" "}
            <span className={"font-bold text-[14px]"}>
              {" "}
              ₦{" "}
              {/* {formatNumberWithCommas(
                userDetails?.total_amount ||
                  userDetails?.history[0]?.wallet?.balance ||
                  0
              )} */}
              {formatNumberWithCommas(balance || 0)}
            </span>
          </p>

          <div className={"flex justify-between gap-[16px]"}>
            <button
              className={
                "border-[1px] border-light-grey-50 px-[48px] py-[11px] rounded-[12px] bg-white w-full"
              }
              onClick={toggle}
            >
              <p className={"text-black text-[16px] font-medium"}>Cancel</p>
            </button>
            <button
              className={
                "border-[1px] border-step-color px-[48px] py-[11px] rounded-[12px] bg-gradient-green w-full"
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
    </div>
  );
};

export default UpdateBalance;
