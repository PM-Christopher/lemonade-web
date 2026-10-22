import React from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle, MoneyInput, FieldError } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { useUpdateCommissionChargeMutation } from "@/features/events/mutations";
import { SubmitButton } from "@/components/global/SubmitButton";
import { commissionChargeSchema, type CommissionChargeInput } from "@/features/events/schema";

interface EditCommissionModalProps {
  isOpen: boolean;
  toggle: () => void;
  commissionCharge: number;
}

function EditCommissionModal({ isOpen, toggle, commissionCharge }: EditCommissionModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const updateCommissionChargeMutation = useUpdateCommissionChargeMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CommissionChargeInput>({
    resolver: zodResolver(commissionChargeSchema),
    // The backend stores a fraction; the form shows a percentage.
    values: { percentage: commissionCharge > 0 ? String(commissionCharge * 100) : "" },
    mode: "onTouched",
  });

  const onSubmit = (values: CommissionChargeInput) => {
    updateCommissionChargeMutation.mutate(Number(values.percentage), {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: apiMessage("Commission charge updated!"),
            type: "success",
          }),
        );
        toggle();
      },
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Commission percentage</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-90 rounded-xl bg-white pt-4 pb-1">
            <div className={"px-4 py-1"}>
              <div className="flex items-center justify-between">
                <p className="text-body-xl font-sans font-semibold">Commission percentage</p>
                <div className="cursor-pointer" onClick={toggle}>
                  <XIcon />
                </div>
              </div>
            </div>
            <div className={"flex flex-col gap-4 px-4 py-4"}>
              <p className={"text-light-black text-body-s font-normal"}>
                Set the commission to be earned on every ticket sale.
              </p>
              <p className={"text-text-grey text-body-s font-normal"}>Commission percentage (%)</p>
              <Controller
                name="percentage"
                control={control}
                render={({ field }) => (
                  <MoneyInput
                    className={"bg-light-grey h-12 rounded-xl border-none px-3 py-3"}
                    placeholder={"Commission percentage"}
                    value={field.value}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                    grouping={false}
                  />
                )}
              />
              <FieldError message={errors.percentage?.message} />
              <div className={"flex justify-between gap-2.5"}>
                <button
                  type="button"
                  className={"border-light-grey-50 h-12 w-39 rounded-xl border bg-white"}
                  onClick={toggle}
                >
                  <p className={"text-body-l font-medium text-black"}>Cancel</p>
                </button>
                <SubmitButton
                  loading={updateCommissionChargeMutation.isPending}
                  title={"Save"}
                  isValid={isValid}
                  classes="border px-3.5 py-2.75 rounded-xl w-39"
                />
                {/*<button className={"h-12 border bg-gradient-green rounded-xl w-39 text-center"}>*/}
                {/*    <p className={"text-body-l font-medium text-white"}>Save</p>*/}
                {/*</button>*/}
              </div>
            </div>
          </div>
        </form>
      </DialogContentBare>
    </Dialog>
  );
}

export default EditCommissionModal;
