import React from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle, Input, FieldError } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppDispatch } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { SubmitButton } from "@/components/global/SubmitButton";
import { useScheduleEventPromotionMutation } from "@/features/events/mutations";
import { schedulePromotionSchema, type SchedulePromotionInput } from "@/features/events/schema";

interface SchedulePromotionModalProps {
  isOpen: boolean;
  toggle: () => void;
  id: string;
  currentDate?: string | null;
}

function SchedulePromotionModal({ isOpen, toggle, id, currentDate }: SchedulePromotionModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const scheduleMutation = useScheduleEventPromotionMutation(id);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SchedulePromotionInput>({
    resolver: zodResolver(schedulePromotionSchema),
    values: { promotion_date: currentDate?.slice(0, 10) ?? "" },
    mode: "onChange",
  });

  const onSubmit = (values: SchedulePromotionInput) => {
    scheduleMutation.mutate(values.promotion_date, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: apiMessage("Promotion scheduled"),
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
        <DialogTitle className="sr-only">Schedule promotion</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-90 rounded-xl bg-white pt-4 pb-1">
            <div className={"px-4 py-1"}>
              <div className="flex items-center justify-between">
                <p className="text-body-xl font-sans font-semibold">Schedule promotion</p>
                <button type="button" aria-label="Close" onClick={toggle}>
                  <XIcon />
                </button>
              </div>
            </div>
            <div className={"flex flex-col gap-4 px-4 py-4"}>
              <p className={"text-light-black text-body-s font-normal"}>
                Pick the day this promotion goes live.
              </p>
              <label htmlFor="promotion_date" className={"text-text-grey text-body-s font-normal"}>
                Promotion date
              </label>
              <Input
                id="promotion_date"
                className={"bg-light-grey h-12 rounded-xl border-none px-3 py-3"}
                type={"date"}
                {...register("promotion_date")}
              />
              <FieldError message={errors.promotion_date?.message} />
              <div className={"flex justify-between gap-2.5"}>
                <button
                  type="button"
                  className={"border-light-grey-50 h-12 w-39 rounded-xl border bg-white"}
                  onClick={toggle}
                >
                  <p className={"text-body-l font-medium text-black"}>Cancel</p>
                </button>
                <SubmitButton
                  loading={scheduleMutation.isPending}
                  title={"Schedule"}
                  isValid={isValid}
                  classes="border px-3.5 py-2.75 rounded-xl w-39"
                />
              </div>
            </div>
          </div>
        </form>
      </DialogContentBare>
    </Dialog>
  );
}

export default SchedulePromotionModal;
