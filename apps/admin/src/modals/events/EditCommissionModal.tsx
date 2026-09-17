import React, { useEffect, useState } from "react";
import { XIcon } from "lucide-react";
import { Input } from "@lemonade/ui";
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
  id?: number;
  commissionCharge: number;
}

function EditCommissionModal({ isOpen, toggle, id, commissionCharge }: EditCommissionModalProps) {
  const [isLoading, setLoading] = useState(false);
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
    <div
      className={`fixed inset-0 z-50 items-center justify-center bg-gray-800 bg-opacity-50 ${isOpen ? "flex" : "hidden"}`}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="w-[360px] rounded-[12px] bg-white pb-[4px] pt-[16px]">
          <div className={"px-[16px] py-[4px]"}>
            <div className="flex items-center justify-between">
              <p className="font-sans text-[18px] font-semibold leading-[27px]">
                Commission percentage
              </p>
              <div className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </div>
            </div>
          </div>
          <div className={"flex flex-col gap-[16px] px-[16px] py-[16px]"}>
            <p className={"text-[14px] font-normal text-light-black"}>
              Set the commission to be earned on every ticket sale.
            </p>
            <p className={"text-[14px] font-normal text-text-grey"}>Commission percentage (%)</p>
            <Input
              className={"h-[48px] rounded-[12px] border-none bg-light-grey px-[12px] py-[12px]"}
              placeholder={"Commission percentage"}
              value={formik.values.percentage}
              onChange={formik.handleChange("percentage")}
              onBlur={formik.handleBlur}
              type={"number"}
            />
            <div className={"flex justify-between gap-[10px]"}>
              <button
                className={
                  "h-[48px] w-[156px] rounded-[12px] border-[1px] border-light-grey-50 bg-white"
                }
                onClick={toggle}
              >
                <p className={"text-[16px] font-medium text-black"}>Cancel</p>
              </button>
              <FormikButton
                loading={formik.isSubmitting}
                title={"Save"}
                error={formik.isValid}
                classes="border-[1px] px-[14px] py-[11px] rounded-[12px] w-[156px]"
              />
              {/*<button className={"h-[48px] border-[1px] bg-gradient-green rounded-[12px] w-[156px] text-center"}>*/}
              {/*    <p className={"text-[16px] font-medium text-white"}>Save</p>*/}
              {/*</button>*/}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditCommissionModal;
