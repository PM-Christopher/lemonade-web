import React from "react";
import { XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
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
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 ${
        isOpen ? "flex" : "hidden"
      }`}
    >
      <div className="rounded-lg bg-white p-6 shadow-lg" style={{ width: "480px" }}>
        <div className="flex items-center justify-between">
          <p className={"text-[18px] font-semiBold"}>Withdrawal Threshold</p>
          <div className="cursor-pointer" onClick={toggle}>
            <XIcon />
          </div>
        </div>
        <div style={{ marginTop: "20px" }}>
          <div className={"flex flex-col gap-[16px]"}>
            <div style={{ maxWidth: "328px" }}>
              <p className={"text-[14px] font-normal text-text-grey"}>
                Set the minimum amount that can be withdrawn from wallet balance.
              </p>
            </div>
            <p className={"text-[14px] font-normal text-text-grey"}>Amount</p>
            <Input
              className={"h-[48px] rounded-[12px] border-none bg-light-grey px-[12px] py-[12px]"}
              placeholder={"Amount"}
              value={formik.values.threshold}
              onChange={formik.handleChange("threshold")}
              onBlur={formik.handleBlur}
            />
            <div className={"flex justify-between gap-[16px]"}>
              <button
                onClick={toggle}
                className={
                  "h-[48px] w-full rounded-[12px] border-[1px] border-light-grey-50 bg-white px-[48px] py-[14px]"
                }
              >
                <p className={"text-[16px] font-medium text-black"}>Cancel</p>
              </button>
              <button
                onClick={() => formik.handleSubmit()}
                className={
                  "h-[48px] w-full rounded-[12px] border-[1px] border-step-color bg-gradient-green px-[48px] py-[14px]"
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
    </div>
  );
};
export default WalletThresholdModal;
