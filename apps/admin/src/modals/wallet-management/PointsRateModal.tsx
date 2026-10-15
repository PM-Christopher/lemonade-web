import React from "react";
import { XIcon } from "lucide-react";
import { Input, Dialog, DialogContentBare, DialogTitle, FieldError } from "@lemonade/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { useUpdatePointsRateMutation } from "@/features/wallet/mutations";
import { pointsRateSchema, type PointsRateInput } from "@/features/wallet/schema";
import { applyServerErrors } from "@/lib/form-errors";

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
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<PointsRateInput>({
    resolver: zodResolver(pointsRateSchema),
    // `values` keeps the field in step with the current rate when it reloads.
    values: { rate: currentRate },
    mode: "onTouched",
  });

  const onSubmit = (values: PointsRateInput) => {
    updateRate.mutate(
      { currency, rate: Number(values.rate) },
      {
        onSuccess: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: apiMessage(`${currency} rate updated`),
              type: "success",
            }),
          );
          toggle();
        },
        onError: (error) => {
          if (applyServerErrors(error, setError, ["rate"])) return;
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
        <DialogTitle className="sr-only">Points Rate</DialogTitle>
        <div className="rounded-lg bg-white p-6 shadow-lg" style={{ width: "480px" }}>
          <div className="flex items-center justify-between">
            <p className={"font-semiBold text-body-xl"}>{currency} Rate</p>
            <div className="cursor-pointer" onClick={toggle}>
              <XIcon />
            </div>
          </div>
          <div style={{ marginTop: "20px" }}>
            <div className={"flex flex-col gap-4"}>
              <div style={{ maxWidth: "328px" }}>
                <p className={"text-text-grey text-body-s font-normal"}>
                  How much of {currency} a user receives per point redeemed. For example, 1 means
                  100 points = {currency === "NGN" ? "₦100" : `100 ${currency}`}.
                </p>
              </div>
              <p className={"text-text-grey text-body-s font-normal"}>Rate per point</p>
              <Input
                className={"bg-light-grey h-12 rounded-xl border-none px-3 py-3"}
                placeholder={"e.g. 1"}
                {...register("rate")}
              />
              <FieldError message={errors.rate?.message} />
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
