import React from "react";
import { Dialog, DialogContentBare, DialogTitle, FieldError } from "@lemonade/ui";
import CloseIcon from "@/images/icons/close.svg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { disputeJobSchema, type DisputeJobInput } from "@/features/business/schema";
import { applyServerErrors } from "@/lib/form-errors";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import MultipleFileUploader from "@/components/global/MultipleFileUploader";
import { SubmitButton } from "@/components/global/SubmitButton";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAppDispatch } from "@/redux/hook";
import { useDisputeJobMutation } from "@/features/business/mutations";

interface SubmitDisputeModalProps {
  isOpen: boolean;
  toggle: () => void;
}

const SubmitDisputeModal: React.FC<SubmitDisputeModalProps> = ({ isOpen, toggle }) => {
  const { selectedJob: job } = useSelector((state: RootState) => state.temp) as {
    selectedJob: { id?: number } | null;
  };
  const disputeJobMutation = useDisputeJobMutation(job?.id ?? 0);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<DisputeJobInput>({
    resolver: zodResolver(disputeJobSchema),
    defaultValues: {
      dispute: "",
      attachments: [],
    },
    mode: "onTouched",
  });

  const onSubmit = (values: DisputeJobInput) => {
    disputeJobMutation.mutate(values, {
      onSuccess: (result) => {
        toggle();
        dispatch(
          updateToastifyReducer({
            show: true,
            message: result?.message,
            type: "success",
          }),
        );
      },
      onError: (error: Error) => {
        if (applyServerErrors(error, setError, ["dispute", "attachments"])) return;
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Something went wrong. Please try again",
            type: "error",
          }),
        );
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
        <DialogTitle className="sr-only">{"Dispute Job"}</DialogTitle>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="hide-scrollbar laptop:p-8 max-h-[90vh] w-full max-w-160 overflow-y-auto scroll-smooth rounded-2xl bg-white p-6 shadow-xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 mb-6 flex items-center justify-between bg-white pt-2 pb-4">
            <div className="flex items-center gap-3">
              <div
                className="cursor-pointer rounded-full p-1 transition hover:bg-gray-100"
                onClick={toggle}
              >
                <CloseIcon />
              </div>
              <h2 className="laptop:text-body-xl text-body-l font-sans font-semibold text-black">
                Dispute Job
              </h2>
            </div>

            <SubmitButton
              title="Submit"
              classes="h-10 w-22.5 rounded-xl"
              loading={isSubmitting}
              isValid={isValid}
            />
          </div>

          {/* Body */}
          <div className="flex flex-col gap-6 pb-6">
            {/* Dispute Textarea */}
            <div className="flex w-full flex-col gap-2">
              <div className="flex justify-between">
                <label htmlFor="dispute" className="text-text-grey text-body-s font-normal">
                  Dispute
                </label>
                <span className="text-text-grey text-meta leading-normal font-normal">
                  200 characters
                </span>
              </div>
              <textarea
                id="dispute"
                className={`bg-light_grey h-32.5 w-full rounded-xl border p-4 ${
                  errors.dispute ? "border-red-500" : "border-gray-200"
                } placeholder:text-grey-40 focus:ring-step-color text-body-s placeholder:text-body-s transition placeholder:font-normal focus:border-transparent focus:ring-2 focus:outline-none`}
                placeholder="Dispute details"
                {...register("dispute")}
              />
              <FieldError message={errors.dispute?.message} />
            </div>

            {/* Attachments */}
            <div className="flex w-full flex-col gap-2">
              <label className="text-text-grey text-body-s font-normal">Attachments</label>
              <MultipleFileUploader
                length="multiple"
                type="dispute"
                setField={{
                  setFieldValue: (field, value) =>
                    setValue(
                      field as keyof DisputeJobInput,
                      value as DisputeJobInput["attachments"],
                      {
                        shouldValidate: true,
                      },
                    ),
                }}
                images={[]}
                title="Upload multiple images"
              />
              <FieldError message={errors.attachments?.message} />
            </div>
          </div>
        </form>
      </DialogContentBare>
    </Dialog>
  );
};

export default SubmitDisputeModal;
