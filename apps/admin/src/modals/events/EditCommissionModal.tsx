import React, { useEffect, useState } from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle, Input } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import * as yup from "yup";
import { useFormik } from "formik";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useUpdateCommissionChargeMutation } from "@/features/events/mutations";
import { FormikButton } from "@/components/global/FormikButton";

interface EditCommissionModalProps {
  isOpen: boolean;
  toggle: () => void;
  commissionCharge: number;
}

function EditCommissionModal({ isOpen, toggle, commissionCharge }: EditCommissionModalProps) {
  const [, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const updateCommissionChargeMutation = useUpdateCommissionChargeMutation();
  const commSchema = yup.object({
    percentage: yup.string().required("Commission percentage is required"),
  });

  const formik = useFormik({
    initialValues: {
      percentage: "",
    },
    validationSchema: commSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      setLoading(true);
      updateCommissionChargeMutation.mutate(Number(values.percentage), {
        onSuccess: () => {
          setLoading(false);
          dispatch(
            updateToastifyReducer({
              show: true,
              message: `Commission charge updated!`,
              type: "success",
            }),
          );
          toggle();
        },
        onError: () => {
          setLoading(false);
        },
      });
    },
  });

  useEffect(() => {
    if (commissionCharge > 0) {
      formik.setFieldValue("percentage", commissionCharge * 100);
    }
    // formik's returned object is recreated on every keystroke (it embeds
    // current values/errors), so adding it here would re-run this sync
    // — and re-run setFieldValue — on every render, fighting the user's
    // own edits. This effect must only fire when commissionCharge changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commissionCharge]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Commission percentage</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <div className="w-[360px] rounded-xl bg-white pt-4 pb-1">
            <div className={"px-4 py-1"}>
              <div className="flex items-center justify-between">
                <p className="font-sans text-[18px] leading-[27px] font-semibold">
                  Commission percentage
                </p>
                <div className="cursor-pointer" onClick={toggle}>
                  <XIcon />
                </div>
              </div>
            </div>
            <div className={"flex flex-col gap-4 px-4 py-4"}>
              <p className={"text-light-black text-[14px] font-normal"}>
                Set the commission to be earned on every ticket sale.
              </p>
              <p className={"text-text-grey text-[14px] font-normal"}>Commission percentage (%)</p>
              <Input
                className={"bg-light-grey h-12 rounded-xl border-none px-3 py-3"}
                placeholder={"Commission percentage"}
                value={formik.values.percentage}
                onChange={formik.handleChange("percentage")}
                onBlur={formik.handleBlur}
                type={"number"}
              />
              <div className={"flex justify-between gap-2.5"}>
                <button
                  className={"border-light-grey-50 h-12 w-[156px] rounded-xl border bg-white"}
                  onClick={toggle}
                >
                  <p className={"text-[16px] font-medium text-black"}>Cancel</p>
                </button>
                <FormikButton
                  loading={formik.isSubmitting}
                  title={"Save"}
                  error={formik.isValid}
                  classes="border px-3.5 py-[11px] rounded-xl w-[156px]"
                />
                {/*<button className={"h-12 border bg-gradient-green rounded-xl w-[156px] text-center"}>*/}
                {/*    <p className={"text-[16px] font-medium text-white"}>Save</p>*/}
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
