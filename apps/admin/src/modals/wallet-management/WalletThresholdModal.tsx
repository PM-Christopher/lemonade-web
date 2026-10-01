import React from "react";
import { XIcon } from "lucide-react";
import { Input, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useUpdateWithdrawalThresholdMutation } from "@/features/wallet/mutations";

type WalletMgtInterface = {
  isOpen: boolean;
  toggle: () => void;
};

const WalletThresholdModal: React.FC<WalletMgtInterface> = ({ isOpen, toggle }) => {
  const dispatch = useDispatch<AppDispatch>();
  const updateThreshold = useUpdateWithdrawalThresholdMutation();
  const prodSchema = yup.object({
    threshold: yup.string().required("threshold is required"),
  });

  const formik = useFormik({
    initialValues: {
      threshold: "",
    },
    validationSchema: prodSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      updateThreshold.mutate(parseInt(values.threshold), {
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
        <DialogTitle className="sr-only">Withdrawal Threshold</DialogTitle>
        <div className="rounded-lg bg-white p-6 shadow-lg" style={{ width: "480px" }}>
          <div className="flex items-center justify-between">
            <p className={"font-semiBold text-[18px]"}>Withdrawal Threshold</p>
            <div className="cursor-pointer" onClick={toggle}>
              <XIcon />
            </div>
          </div>
          <div style={{ marginTop: "20px" }}>
            <div className={"flex flex-col gap-4"}>
              <div style={{ maxWidth: "328px" }}>
                <p className={"text-text-grey text-[14px] font-normal"}>
                  Set the minimum amount that can be withdrawn from wallet balance.
                </p>
              </div>
              <p className={"text-text-grey text-[14px] font-normal"}>Amount</p>
              <Input
                className={"bg-light-grey h-12 rounded-xl border-none px-3 py-3"}
                placeholder={"Amount"}
                value={formik.values.threshold}
                onChange={formik.handleChange("threshold")}
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
                    {updateThreshold.isPending ? "Loading..." : "Submit"}
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
export default WalletThresholdModal;
