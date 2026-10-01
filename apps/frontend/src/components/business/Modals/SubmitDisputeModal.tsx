import React from "react";
import { Button, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import CloseIcon from "@/images/icons/close.svg";
import * as yup from "yup";
import { useFormik } from "formik";
import { axiosInstance } from "@/lib/axiosInstane";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import MultipleFileUploader from "@/components/global/MultipleFileUploader";
import { FormikButton } from "@/components/global/FormikButton";
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
    selectedJob: any;
  };
  const disputeJobMutation = useDisputeJobMutation(job?.id);
  const disputeLoading = disputeJobMutation.isPending;
  const disputeJobSchema = yup.object({
    dispute: yup.string().trim().required("Dispute is required"),
    attachments: yup.array().of(yup.string()),
  });
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      dispute: "",
      attachments: [],
    },
    validationSchema: disputeJobSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      handleDispute(values);
    },
  });

  const handleDispute = (values: any) => {
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
      onError: () => {
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
          onSubmit={formik.handleSubmit}
          className="hide-scrollbar laptop:p-8 max-h-[90vh] w-full max-w-[640px] overflow-y-auto scroll-smooth rounded-2xl bg-white p-6 shadow-xl"
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
              <h2 className="laptop:text-[18px] font-sans text-[16px] font-semibold text-black">
                Dispute Job
              </h2>
            </div>

            <FormikButton
              title="Submit"
              classes="h-[40px] w-[90px] rounded-[12px]"
              loading={formik.isSubmitting}
              error={formik.isValid}
            />
          </div>

          {/* Body */}
          <div className="flex flex-col gap-6 pb-6">
            {/* Dispute Textarea */}
            <div className="flex w-full flex-col gap-2">
              <div className="flex justify-between">
                <label htmlFor="dispute" className="text-text-grey text-[14px] font-normal">
                  Dispute
                </label>
                <span className="text-text-grey text-[12px] font-normal">200 characters</span>
              </div>
              <textarea
                id="dispute"
                name="dispute"
                className={`bg-light_grey h-[130px] w-full rounded-xl border p-4 ${
                  formik.touched.dispute && formik.errors.dispute
                    ? "border-red-500"
                    : "border-gray-200"
                } placeholder:text-grey-40 focus:ring-step-color text-[14px] transition placeholder:text-[14px] placeholder:font-normal focus:border-transparent focus:ring-2 focus:outline-none`}
                placeholder="Dispute details"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.dispute}
              />
              {formik.touched.dispute && formik.errors.dispute && (
                <p className="mt-1 text-[12px] text-red-500">{formik.errors.dispute}</p>
              )}
            </div>

            {/* Attachments */}
            <div className="flex w-full flex-col gap-2">
              <label className="text-text-grey text-[14px] font-normal">Attachments</label>
              <MultipleFileUploader
                length="multiple"
                type="dispute"
                setField={formik}
                images={[]}
                title="Upload multiple images"
              />
            </div>
          </div>
        </form>
      </DialogContentBare>
    </Dialog>
  );
};

export default SubmitDisputeModal;
