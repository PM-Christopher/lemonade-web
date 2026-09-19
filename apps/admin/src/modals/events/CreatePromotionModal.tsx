import React, { useEffect, useState } from "react";
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
  const [eventType, setEventType] = React.useState("");
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const createPromotionMutation = useCreatePromotionMutation();
  const updatePromotionMutation = useUpdatePromotionMutation(promotionId);
  const { data: promotionDetail } = usePromotionDetailQuery(promotionId, {
    enabled: Boolean(promotionId),
  });
  const [promotionTitle, setPromotionTitle] = useState("Create Promotion");

  const [breakdowns, setBreakdowns] = useState<string[]>([""]);

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
      name: "",
      price_option: "",
      price: "",
    },
    validationSchema: createPromotionSchema,
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

  useEffect(() => {
    if (promotionId !== 0 && promotionDetail) {
      const data = promotionDetail.promotion;
      setEventType(data.price_option);
      setPromotionTitle("Edit Promotion");
      formik.setFieldValue("name", data.name);
      formik.setFieldValue("price", data.price);
      formik.setFieldValue("price_option", data.price_option);
      setBreakdowns(data.breakdown ?? []);
    } else if (promotionId === 0) {
      setPromotionTitle("Create Promotion");
      formik.setFieldValue("name", "");
      formik.setFieldValue("price", "");
      formik.setFieldValue("price_option", "");
      setBreakdowns([""]);
    }
    // formik's returned object is recreated on every keystroke (it embeds
    // current values/errors), so adding it here would re-run this sync
    // — and re-run setFieldValue — on every render, fighting the user's
    // own edits. This effect must only fire when the target record
    // changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promotionId, promotionDetail]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{promotionTitle}</DialogTitle>
        <div className="w-[640px] rounded-[12px] bg-white pb-[4px] pt-[16px]">
          <form onSubmit={formik.handleSubmit}>
            <div className={"px-[16px] py-[4px]"}>
              <div className="flex items-center justify-between">
                <div className={"flex items-center gap-[8px]"}>
                  <XIcon onClick={toggle} className={"cursor-pointer"} />
                  <p className="font-sans text-[18px] font-semibold leading-[27px]">
                    {promotionTitle}
                  </p>
                </div>
                <div className="cursor-pointer">
                  <FormikButton
                    loading={formik.isSubmitting}
                    title={promotionTitle}
                    error={formik.isValid}
                    classes="border-[1px] px-[14px] py-[11px] rounded-[12px] w-full"
                  />
                </div>
              </div>
            </div>
            <div className={"flex flex-col gap-[24px] px-[16px] py-[16px]"}>
              <div className={"flex flex-col gap-[2px]"}>
                <p className={"text-[14px] font-normal text-text-grey"}>
                  Promotion name
                </p>
                <input
                  id="name"
                  className={
                    "h-[48px] gap-[12px] rounded-[12px] bg-light-grey p-[12px] text-[14px]"
                  }
                  placeholder={""}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className={"flex flex-col gap-[4px]"}>
                <p className={"text-[14px] font-normal text-text-grey"}>
                  Price option
                </p>
                <div className="flex gap-2">
                  <div
                    className={`flex cursor-pointer items-center gap-2 rounded-[12px] p-[12px] px-[16px] ${eventType === "one-time" ? "bg-gradient-green-2 shadow-event-custom" : "bg-light_grey text-text-grey"}`}
                    onClick={() => {
                      setEventType("one-time");
                      formik.setFieldValue("price_option", "one-time");
                    }}
                  >
                    <p className="tracking-custom font-sans text-[14px] font-normal leading-[21px]">
                      One time
                    </p>
                  </div>
                  <div
                    className={`flex cursor-pointer items-center gap-2 rounded-[12px] p-[12px] px-[16px] ${eventType === "unit" ? "bg-gradient-green-2 shadow-event-custom" : "bg-light_grey text-text-grey"}`}
                    onClick={() => {
                      setEventType("unit");
                      formik.setFieldValue("price_option", "unit");
                    }}
                  >
                    <p className="tracking-custom font-sans text-[14px] font-normal leading-[21px]">
                      Unit
                    </p>
                  </div>
                </div>
              </div>
              <div className={"flex flex-col gap-[2px]"}>
                <p className={"text-[14px] font-normal text-text-grey"}>
                  Promotion Price
                </p>
                <input
                  id="price"
                  className={
                    "h-[48px] gap-[12px] rounded-[12px] bg-light-grey p-[12px] text-[14px]"
                  }
                  placeholder={"N0.00"}
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="flex flex-col gap-[2px]">
                <p className="text-[14px] font-normal text-text-grey">
                  Breakdown
                </p>
                {breakdowns.map((breakdown, index) => (
                  <div key={index} className="flex flex-col gap-[2px]">
                    <div className="relative">
                      <input
                        className="h-[48px] w-full gap-[12px] rounded-[12px] bg-light-grey p-[12px] pr-[40px] text-[14px]"
                        placeholder="Enter breakdown of promotion"
                        value={breakdown}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value)
                        }
                      />
                      {index > 0 && (
                        <button
                          onClick={() => handleRemoveField(index)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 transform text-red-500"
                        >
                          <XIcon size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className={"flex justify-between gap-[16px] px-[16px] pb-[10px]"}
            >
              <button
                className={
                  "flex w-full items-center justify-center rounded-[12px] border-[1px] bg-light-green-10 px-[48px] py-[11px]"
                }
                onClick={handleAddField}
                type={"button"}
              >
                <PlusIcon className={"text-light-green"} />
                <p className={"text-[16px] font-medium text-light-green"}>
                  Add breakdown
                </p>
              </button>
            </div>
          </form>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default CreatePromotionModal;
