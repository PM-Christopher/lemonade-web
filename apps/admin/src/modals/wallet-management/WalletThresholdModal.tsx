import React from "react";
import { XIcon } from "lucide-react";
import { MoneyInput, Dialog, DialogContentBare, DialogTitle, FieldError } from "@lemonade/ui";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { useUpdateWithdrawalThresholdMutation } from "@/features/wallet/mutations";
import { withdrawalThresholdSchema, type WithdrawalThresholdInput } from "@/features/wallet/schema";
import { applyServerErrors } from "@/lib/form-errors";

type WalletMgtInterface = {
  isOpen: boolean;
  toggle: () => void;
  // The threshold in force now, in naira, so the field starts filled.
  current?: string | number;
};

const WalletThresholdModal: React.FC<WalletMgtInterface> = ({ isOpen, toggle, current }) => {
  const dispatch = useDispatch<AppDispatch>();
  const updateThreshold = useUpdateWithdrawalThresholdMutation();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<WithdrawalThresholdInput>({
    resolver: zodResolver(withdrawalThresholdSchema),
    values: { threshold: current === undefined ? "" : String(current) },
    mode: "onTouched",
  });

  const onSubmit = (values: WithdrawalThresholdInput) => {
    updateThreshold.mutate(Number(values.threshold), {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({ show: true, message: apiMessage("Success"), type: "success" }),
        );
        toggle();
      },
      onError: (error) => {
        if (applyServerErrors(error, setError, ["threshold"])) return;
        dispatch(
          updateToastifyReducer({
            show: true,
            message: error?.message || "Something went wrong",
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
        <DialogTitle className="sr-only">Withdrawal Threshold</DialogTitle>
        <div className="rounded-lg bg-white p-6 shadow-lg" style={{ width: "480px" }}>
          <div className="flex items-center justify-between">
            <p className={"font-semiBold text-body-xl"}>Withdrawal Threshold</p>
            <div className="cursor-pointer" onClick={toggle}>
              <XIcon />
            </div>
          </div>
          <div style={{ marginTop: "20px" }}>
            <div className={"flex flex-col gap-4"}>
              <div>
                <p className={"text-text-grey text-body-s font-normal"}>
                  Set the minimum amount that can be withdrawn from wallet balance.
                </p>
              </div>
              <p className={"text-text-grey text-body-s font-normal"}>Amount</p>
              <Controller
                name="threshold"
                control={control}
                render={({ field }) => (
                  <MoneyInput
                    className={"bg-light-grey h-12 rounded-xl border-none px-3 py-3"}
                    placeholder={"Amount"}
                    aria-label="threshold"
                    value={field.value}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                    padDecimals
                  />
                )}
              />
              <FieldError message={errors.threshold?.message} />
              <div className={"flex justify-between gap-4"}>
                <button
                  onClick={toggle}
                  className={
                    "border-light-grey-50 h-12 w-full rounded-xl border bg-white px-12 py-3.5"
                  }
                >
                  <p className={"text-body-l font-medium text-black"}>Cancel</p>
                </button>
                <button
                  onClick={handleSubmit(onSubmit)}
                  className={
                    "border-step-color bg-gradient-green h-12 w-full rounded-xl border px-12 py-3.5"
                  }
                >
                  <p className={"text-body-l font-medium text-white"}>
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
