import React, { useState } from "react";
import { PlusIcon, XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { usePromotionDetailQuery } from "@/features/events/queries";
import {
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
} from "@/features/events/mutations";
import { FormikButton } from "@/components/global/FormikButton";
import { updateToastifyReducer } from "@/redux/toastifySlice";

interface CreatePromotionModalProps {
  isOpen: boolean;
  toggle: () => void;
  promotionId?: number;
}

const CreatePromotionModal: React.FC<CreatePromotionModalProps> = ({
  isOpen,
  toggle,
  promotionId,
}) => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const createPromotionMutation = useCreatePromotionMutation();
  const updatePromotionMutation = useUpdatePromotionMutation(promotionId);
  const { data: promotionDetail } = usePromotionDetailQuery(promotionId, {
    enabled: Boolean(promotionId),
  });

  const editing =
    promotionId !== 0 && promotionId !== undefined ? promotionDetail?.promotion : undefined;
  const promotionTitle = editing ? "Edit Promotion" : "Create Promotion";
  const recordKey = editing ? String(promotionId) : promotionId === 0 ? "create" : "idle";

  const handleAddField = () => {
    setBreakdowns([...breakdowns, ""]);
  };

  const handleInputChange = (index: number, value: string) => {
    const newBreakdowns = [...breakdowns];
    newBreakdowns[index] = value;
    setBreakdowns(newBreakdowns);
  };

  const handleRemoveField = (index: number) => {
    const newBreakdowns = breakdowns.filter((_, i) => i !== index);
    setBreakdowns(newBreakdowns);
  };

  const createPromotionSchema = yup.object({
    name: yup.string().required("Email is required"),
    price_option: yup.string().required("Email is required"),
    price: yup.string().required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: editing?.name ?? "",
      price_option: editing?.price_option ?? "",
      price: editing ? String(editing.price ?? "") : "",
    },
    enableReinitialize: true,
    validationSchema: createPromotionSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      if (isLoggedIn) {
        // NOTE (found, not fixed — pre-existing bug, see the NOTE on
        // promotionsApi in features/events/api.ts): the backend
        // requires `image`, which this form never collects, so
        // create/update always 422s. Preserving the promotion's
        // existing image on edit is the closest equivalent of the
        // old behavior (an empty string still fails `required`).
        const data = {
          ...values,
          price: Number(values.price),
          breakdown: breakdowns,
          image: promotionDetail?.promotion?.image ?? "",
        };
        if (promotionId !== 0) {
          updatePromotionMutation.mutate(data, {
            onSuccess: () => {
              dispatch(
                updateToastifyReducer({
                  show: true,
                  message: "Updated promotion successfully",
                  type: "success",
                }),
              );
              toggle();
            },
          });
        } else {
          createPromotionMutation.mutate(data, {
            onSuccess: () => {
              dispatch(
                updateToastifyReducer({
                  show: true,
                  message: "Added promotion successfully",
                  type: "success",
                }),
              );
              toggle();
            },
          });
        }
      }
    },
  });

  const [eventType, setEventType] = useState(editing?.price_option ?? "");
  const [eventTypeKey, setEventTypeKey] = useState(recordKey);
  if (recordKey !== eventTypeKey) {
    setEventTypeKey(recordKey);
    setEventType(editing?.price_option ?? "");
  }

  const [breakdowns, setBreakdowns] = useState<string[]>(
    editing ? (editing.breakdown ?? []) : [""],
  );
  const [breakdownKey, setBreakdownKey] = useState(recordKey);
  if (recordKey !== breakdownKey) {
    setBreakdownKey(recordKey);
    setBreakdowns(editing ? (editing.breakdown ?? []) : [""]);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{promotionTitle}</DialogTitle>
        <div className="w-[640px] rounded-xl bg-white pt-4 pb-1">
          <form onSubmit={formik.handleSubmit}>
            <div className={"px-4 py-1"}>
              <div className="flex items-center justify-between">
                <div className={"flex items-center gap-2"}>
                  <XIcon onClick={toggle} className={"cursor-pointer"} />
                  <p className="font-sans text-[18px] leading-[27px] font-semibold">
                    {promotionTitle}
                  </p>
                </div>
                <div className="cursor-pointer">
                  <FormikButton
                    loading={formik.isSubmitting}
                    title={promotionTitle}
                    error={formik.isValid}
                    classes="border px-3.5 py-[11px] rounded-xl w-full"
                  />
                </div>
              </div>
            </div>
            <div className={"flex flex-col gap-6 px-4 py-4"}>
              <div className={"flex flex-col gap-0.5"}>
                <p className={"text-text-grey text-[14px] font-normal"}>Promotion name</p>
                <input
                  id="name"
                  className={"bg-light-grey h-12 gap-3 rounded-xl p-3 text-[14px]"}
                  placeholder={""}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className={"flex flex-col gap-1"}>
                <p className={"text-text-grey text-[14px] font-normal"}>Price option</p>
                <div className="flex gap-2">
                  <div
                    className={`flex cursor-pointer items-center gap-2 rounded-xl p-3 px-4 ${eventType === "one-time" ? "bg-gradient-green-2 shadow-event-custom" : "bg-light_grey text-text-grey"}`}
                    onClick={() => {
                      setEventType("one-time");
                      formik.setFieldValue("price_option", "one-time");
                    }}
                  >
                    <p className="tracking-custom font-sans text-[14px] leading-[21px] font-normal">
                      One time
                    </p>
                  </div>
                  <div
                    className={`flex cursor-pointer items-center gap-2 rounded-xl p-3 px-4 ${eventType === "unit" ? "bg-gradient-green-2 shadow-event-custom" : "bg-light_grey text-text-grey"}`}
                    onClick={() => {
                      setEventType("unit");
                      formik.setFieldValue("price_option", "unit");
                    }}
                  >
                    <p className="tracking-custom font-sans text-[14px] leading-[21px] font-normal">
                      Unit
                    </p>
                  </div>
                </div>
              </div>
              <div className={"flex flex-col gap-0.5"}>
                <p className={"text-text-grey text-[14px] font-normal"}>Promotion Price</p>
                <input
                  id="price"
                  className={"bg-light-grey h-12 gap-3 rounded-xl p-3 text-[14px]"}
                  placeholder={"N0.00"}
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-text-grey text-[14px] font-normal">Breakdown</p>
                {breakdowns.map((breakdown, index) => (
                  <div key={index} className="flex flex-col gap-0.5">
                    <div className="relative">
                      <input
                        className="bg-light-grey h-12 w-full gap-3 rounded-xl p-3 pr-10 text-[14px]"
                        placeholder="Enter breakdown of promotion"
                        value={breakdown}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                      />
                      {index > 0 && (
                        <button
                          onClick={() => handleRemoveField(index)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 transform text-red-500"
                        >
                          <XIcon size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={"flex justify-between gap-4 px-4 pb-2.5"}>
              <button
                className={
                  "bg-light-green-10 flex w-full items-center justify-center rounded-xl border px-12 py-[11px]"
                }
                onClick={handleAddField}
                type={"button"}
              >
                <PlusIcon className={"text-light-green"} />
                <p className={"text-light-green text-[16px] font-medium"}>Add breakdown</p>
              </button>
            </div>
          </form>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default CreatePromotionModal;
