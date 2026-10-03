import React from "react";
import { XIcon } from "lucide-react";
import { Input, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useUpdatePointsRateMutation } from "@/features/wallet/mutations";

type PointsRateModalInterface = {
  isOpen: boolean;
  toggle: () => void;
  currency: string;
  // Major units of `currency` per point (e.g. "1" for NGN's "100 points = ₦100"), as a string
  // for the input's initial value — same convention as WalletThresholdModal.
  currentRate: string;
};

const PointsRateModal: React.FC<PointsRateModalInterface> = ({
  isOpen,
  toggle,
  currency,
  currentRate,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const updateRate = useUpdatePointsRateMutation();
  const rateSchema = yup.object({
    rate: yup.string().required("Rate is required"),
  });

  const formik = useFormik({
    initialValues: {
      rate: currentRate,
    },
    validationSchema: rateSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: (values) => {
      updateRate.mutate(
        { currency, rate: parseFloat(values.rate) },
        {
          onSuccess: () => {
            dispatch(
              updateToastifyReducer({
                show: true,
                message: `${currency} rate updated`,
                type: "success",
              }),
            );
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
    },
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
        <DialogTitle className="sr-only">Points Rate</DialogTitle>
        <div className="rounded-lg bg-white p-6 shadow-lg" style={{ width: "480px" }}>
          <div className="flex items-center justify-between">
            <p className={"font-semiBold text-[18px]"}>{currency} Rate</p>
            <div className="cursor-pointer" onClick={toggle}>
              <XIcon />
            </div>
          </div>
          <div style={{ marginTop: "20px" }}>
            <div className={"flex flex-col gap-4"}>
              <div style={{ maxWidth: "328px" }}>
                <p className={"text-text-grey text-[14px] font-normal"}>
                  How much of {currency} a user receives per point redeemed. For example, 1 means
                  100 points = {currency === "NGN" ? "₦100" : `100 ${currency}`}.
                </p>
              </div>
              <p className={"text-text-grey text-[14px] font-normal"}>Rate per point</p>
              <Input
                className={"bg-light-grey h-12 rounded-xl border-none px-3 py-3"}
                placeholder={"e.g. 1"}
                value={formik.values.rate}
                onChange={formik.handleChange("rate")}
                onBlur={formik.handleBlur}
              />
              <div className={"flex justify-between gap-4"}>
                <button
                  onClick={toggle}
                  className={
                    "border-light-grey-50 h-12 w-full rounded-xl border bg-white px-12 py-3.5"
                  }
                >
                  <p className={"text-[16px] font-medium text-black"}>Cancel</p>
                </button>
                <button
                  onClick={() => formik.handleSubmit()}
                  className={
                    "border-step-color bg-gradient-green h-12 w-full rounded-xl border px-12 py-3.5"
                  }
                >
                  <p className={"text-[16px] font-medium text-white"}>
                    {updateRate.isPending ? "Loading..." : "Submit"}
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};
export default PointsRateModal;
