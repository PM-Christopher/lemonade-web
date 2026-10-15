import React, { useMemo } from "react";
import { PlusIcon, XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle, FieldError } from "@lemonade/ui";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { usePromotionDetailQuery } from "@/features/events/queries";
import {
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
} from "@/features/events/mutations";
import { promotionSchema, type PromotionInput } from "@/features/events/schema";
import { SubmitButton } from "@/components/global/SubmitButton";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";

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

  // The form follows the promotion being edited, or starts blank for a new one.
  const formValues = useMemo<PromotionInput>(
    () => ({
      name: editing?.name ?? "",
      price_option: editing?.price_option ?? "",
      price: editing ? String(editing.price ?? "") : "",
      breakdown: editing?.breakdown?.length ? editing.breakdown : [""],
    }),
    [editing],
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<PromotionInput>({
    resolver: zodResolver(promotionSchema),
    values: formValues,
    mode: "onTouched",
  });

  const priceOption = useWatch({ control, name: "price_option" });
  const breakdowns = useWatch({ control, name: "breakdown" }) ?? [];

  const setBreakdowns = (next: string[]) =>
    setValue("breakdown", next, { shouldValidate: true, shouldDirty: true });
  const handleAddField = () => setBreakdowns([...breakdowns, ""]);
  const handleInputChange = (index: number, value: string) =>
    setBreakdowns(breakdowns.map((item, i) => (i === index ? value : item)));
  const handleRemoveField = (index: number) =>
    setBreakdowns(breakdowns.filter((_, i) => i !== index));

  const onSubmit = (values: PromotionInput) => {
    if (!isLoggedIn) return;
    // NOTE (found, not fixed — pre-existing bug, see the NOTE on promotionsApi in
    // features/events/api.ts): the backend requires `image`, which this form never
    // collects, so create/update 422s. Editing keeps the promotion's existing image.
    const data = {
      ...values,
      price: Number(values.price),
      image: promotionDetail?.promotion?.image ?? "",
    };
    const onSuccess = (message: string) => () => {
      dispatch(
        updateToastifyReducer({ show: true, message: apiMessage(message), type: "success" }),
      );
      toggle();
    };
    if (promotionId !== 0) {
      updatePromotionMutation.mutate(data, {
        onSuccess: onSuccess("Updated promotion successfully"),
      });
    } else {
      createPromotionMutation.mutate(data, {
        onSuccess: onSuccess("Added promotion successfully"),
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{promotionTitle}</DialogTitle>
        <div className="w-160 rounded-xl bg-white pt-4 pb-1">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={"px-4 py-1"}>
              <div className="flex items-center justify-between">
                <div className={"flex items-center gap-2"}>
                  <XIcon onClick={toggle} className={"cursor-pointer"} />
                  <p className="text-body-xl font-sans font-semibold">{promotionTitle}</p>
                </div>
                <div className="cursor-pointer">
                  <SubmitButton
                    loading={
                      isSubmitting ||
                      createPromotionMutation.isPending ||
                      updatePromotionMutation.isPending
                    }
                    title={promotionTitle}
                    isValid={isValid}
                    classes="border px-3.5 py-2.75 rounded-xl w-full"
                  />
                </div>
              </div>
            </div>
            <div className={"flex flex-col gap-6 px-4 py-4"}>
              <div className={"flex flex-col gap-0.5"}>
                <p className={"text-text-grey text-body-s font-normal"}>Promotion name</p>
                <input
                  id="name"
                  className={"bg-light-grey text-body-s h-12 gap-3 rounded-xl p-3"}
                  placeholder={""}
                  {...register("name")}
                />
                <FieldError message={errors.name?.message} />
              </div>
              <div className={"flex flex-col gap-1"}>
                <p className={"text-text-grey text-body-s font-normal"}>Price option</p>
                <div className="flex gap-2">
                  <div
                    className={`flex cursor-pointer items-center gap-2 rounded-xl p-3 px-4 ${priceOption === "one-time" ? "bg-gradient-green-2 shadow-event-custom" : "bg-light_grey text-text-grey"}`}
                    onClick={() => setValue("price_option", "one-time", { shouldValidate: true })}
                  >
                    <p className="tracking-custom text-body-s font-sans font-normal">One time</p>
                  </div>
                  <div
                    className={`flex cursor-pointer items-center gap-2 rounded-xl p-3 px-4 ${priceOption === "unit" ? "bg-gradient-green-2 shadow-event-custom" : "bg-light_grey text-text-grey"}`}
                    onClick={() => setValue("price_option", "unit", { shouldValidate: true })}
                  >
                    <p className="tracking-custom text-body-s font-sans font-normal">Unit</p>
                  </div>
                </div>
              </div>
              <div className={"flex flex-col gap-0.5"}>
                <p className={"text-text-grey text-body-s font-normal"}>Promotion Price</p>
                <input
                  id="price"
                  className={"bg-light-grey text-body-s h-12 gap-3 rounded-xl p-3"}
                  placeholder={"N0.00"}
                  {...register("price")}
                />
                <FieldError message={errors.price?.message} />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-text-grey text-body-s font-normal">Breakdown</p>
                {breakdowns.map((breakdown, index) => (
                  <div key={index} className="flex flex-col gap-0.5">
                    <div className="relative">
                      <input
                        className="bg-light-grey text-body-s h-12 w-full gap-3 rounded-xl p-3 pr-10"
                        placeholder="Enter breakdown of promotion"
                        value={breakdown}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveField(index)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 transform text-red-500"
                        >
                          <XIcon size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <FieldError
                  message={
                    errors.breakdown?.message ??
                    errors.breakdown?.find?.((item) => item?.message)?.message
                  }
                />
              </div>
            </div>
            <div className={"flex justify-between gap-4 px-4 pb-2.5"}>
              <button
                className={
                  "bg-light-green-10 flex w-full items-center justify-center rounded-xl border px-12 py-2.75"
                }
                onClick={handleAddField}
                type={"button"}
              >
                <PlusIcon className={"text-light-green"} />
                <p className={"text-light-green text-body-l font-medium"}>Add breakdown</p>
              </button>
            </div>
          </form>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default CreatePromotionModal;
