"use client";
import React from "react";
import { XIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContentBare, DialogTitle, MoneyInput } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useUpdateCommissionMutation } from "@/features/businesses/mutations";
import { errorMessage } from "@/lib/api-error";

// Mirrors UpdateServiceCommissionRequest: a whole percent from 0 to 100.
const commissionSchema = z.object({
  percentage: z.coerce
    .number({ message: "Enter a number" })
    .int("Use a whole number")
    .min(0, "Cannot be below 0")
    .max(100, "Cannot be above 100"),
});

type CommissionForm = z.input<typeof commissionSchema>;

interface CommissionModalProps {
  isOpen: boolean;
  toggle: () => void;
  current: number;
}

// Sets the default percentage kept from a completed service when the owner has no plan.
function CommissionModal({ isOpen, toggle, current }: CommissionModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const mutation = useUpdateCommissionMutation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CommissionForm, unknown, z.output<typeof commissionSchema>>({
    resolver: zodResolver(commissionSchema),
    values: { percentage: current },
  });

  const onSubmit = ({ percentage }: z.output<typeof commissionSchema>) =>
    mutation.mutate(percentage, {
      onSuccess: toggle,
      onError: (error) =>
        dispatch(
          updateToastifyReducer({
            show: true,
            message: errorMessage(error, "Couldn't save the commission."),
            type: "error",
          }),
        ),
    });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Default commission</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="w-90 rounded-xl bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-body-xl font-sans font-semibold">Default commission</p>
            <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
              <XIcon />
            </button>
          </div>
          <p className="text-light-black text-body-s mt-4 font-normal">
            Set the commission earned on a completed service when the business owner has no plan.
            Owners on a plan keep the rate set on that plan.
          </p>
          <label htmlFor="commission" className="text-text-grey text-meta mt-4 block">
            Commission percentage
          </label>
          <Controller
            name="percentage"
            control={control}
            render={({ field }) => (
              <MoneyInput
                id="commission"
                className="bg-light-grey mt-1 h-12 rounded-xl border-0"
                value={String(field.value ?? "")}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                allowDecimals={false}
                grouping={false}
              />
            )}
          />
          {errors.percentage && (
            <p className="text-red-1 text-meta mt-1 leading-normal">{errors.percentage.message}</p>
          )}
          <div className="mt-4 flex justify-between gap-2.5">
            <button
              type="button"
              className="border-light-grey-50 h-12 w-39 rounded-xl border bg-white"
              onClick={toggle}
            >
              <p className="text-body-l font-medium text-black">Cancel</p>
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-gradient-green h-12 w-39 rounded-xl border text-center disabled:opacity-60"
            >
              <p className="text-body-l font-medium text-white">
                {mutation.isPending ? "Saving..." : "Save"}
              </p>
            </button>
          </div>
        </form>
      </DialogContentBare>
    </Dialog>
  );
}

export default CommissionModal;
