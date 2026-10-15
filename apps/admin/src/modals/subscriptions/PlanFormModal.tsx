import React from "react";
import { XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label, Input, Dialog, DialogContentBare, DialogTitle, FieldError } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import type { AdminSubscriptionPlan } from "@/features/subscriptions/api";
import { useCreatePlanMutation, useUpdatePlanMutation } from "@/features/subscriptions/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { SubmitButton } from "@/components/global/SubmitButton";
import { planSchema, type PlanInput } from "@/features/subscriptions/schema";
import { applyServerErrors } from "@/lib/form-errors";

interface PlanFormModalProps {
  isOpen: boolean;
  toggle: () => void;
  // Its absence means create mode; its presence means edit mode, pre-filled.
  plan?: AdminSubscriptionPlan;
}

const emptyValues: PlanInput = {
  title: "",
  access_type: "",
  monthly_charge: "",
  yearly_charge: "",
  ver_badge: false,
  forum_creation: false,
  lemon_id: false,
  event_creation: "",
  sales_commission: "",
  service_commission: "",
  connection_range: "",
  offline_benefits: false,
  recommended: false,
};

// The response's formatted major-unit amounts go straight into the inputs.
function toFormValues(plan: AdminSubscriptionPlan): PlanInput {
  return {
    title: plan.title,
    access_type: plan.access_type,
    monthly_charge: plan.monthly_charge,
    yearly_charge: plan.yearly_charge,
    ver_badge: plan.benefits.verification_badge,
    forum_creation: plan.benefits.tribe_creation,
    lemon_id: plan.benefits.lemon_id,
    event_creation: String(plan.benefits.event_creation),
    sales_commission: String(plan.benefits.ticket_sales_commission),
    service_commission: String(plan.benefits.service_commission),
    connection_range: plan.benefits.connection_range,
    offline_benefits: plan.benefits.offline_benefits,
    recommended: plan.recommended,
  };
}

const checkboxFields: Array<{
  name: "ver_badge" | "forum_creation" | "lemon_id" | "offline_benefits" | "recommended";
  label: string;
}> = [
  { name: "ver_badge", label: "Verification badge" },
  { name: "forum_creation", label: "Tribe creation" },
  { name: "lemon_id", label: "Lemon ID" },
  { name: "offline_benefits", label: "Offline benefits" },
  { name: "recommended", label: "Recommended plan" },
];

const PlanFormModal: React.FC<PlanFormModalProps> = ({ isOpen, toggle, plan }) => {
  const dispatch = useDispatch<AppDispatch>();
  const title = plan ? "Edit plan" : "Create plan";
  const createPlanMutation = useCreatePlanMutation();
  const updatePlanMutation = useUpdatePlanMutation(plan?.id);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<PlanInput>({
    resolver: zodResolver(planSchema),
    values: plan ? toFormValues(plan) : emptyValues,
    mode: "onTouched",
  });

  const onSubmit = (values: PlanInput) => {
    const payload = {
      title: values.title,
      access_type: values.access_type,
      monthly_charge: Number(values.monthly_charge),
      yearly_charge: Number(values.yearly_charge),
      ver_badge: values.ver_badge,
      forum_creation: values.forum_creation,
      lemon_id: values.lemon_id,
      event_creation: Number(values.event_creation),
      sales_commission: Number(values.sales_commission),
      service_commission: Number(values.service_commission),
      connection_range: values.connection_range,
      offline_benefits: values.offline_benefits,
      recommended: values.recommended,
      // SubscriptionPlanRequest::toDto() defaults `active` to true when
      // the field is absent — on UPDATE that would silently reactivate a
      // deactivated plan on every unrelated edit. Activate/deactivate own
      // that state via their own mutations, so this form always sends the
      // plan's current value back unchanged (true for a new plan).
      active: plan ? plan.active : true,
    };

    const mutation = plan ? updatePlanMutation : createPlanMutation;
    mutation.mutate(payload, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: apiMessage(plan ? "Plan updated successfully" : "Plan created successfully"),
            type: "success",
          }),
        );
        toggle();
      },
      onError: (error) => {
        const fields = Object.keys(emptyValues) as (keyof PlanInput)[];
        if (applyServerErrors(error, setError, fields)) return;
        dispatch(
          updateToastifyReducer({
            show: true,
            message: error?.message || "Something went wrong",
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
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="w-120 rounded-xl bg-white pt-4 pb-1">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={"px-4 py-1"}>
              <div className="flex items-center justify-between">
                <p className="text-body-xl font-sans font-semibold">{title}</p>
                <div className="cursor-pointer" onClick={toggle}>
                  <XIcon />
                </div>
              </div>
            </div>
            <div className={"flex max-h-[60vh] flex-col gap-4 overflow-y-auto px-4 py-4"}>
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-text-grey text-body-s font-sans font-normal">
                  Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  className="form-font bg-light-grey h-12 rounded-xl border-0"
                  {...register("title")}
                />
                <FieldError message={errors.title?.message} />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="access_type"
                  className="text-text-grey text-body-s font-sans font-normal"
                >
                  Access type
                </Label>
                <Input
                  id="access_type"
                  type="text"
                  placeholder="e.g. Limited, Unlimited"
                  className="form-font bg-light-grey h-12 rounded-xl border-0"
                  {...register("access_type")}
                />
                <FieldError message={errors.access_type?.message} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label
                    htmlFor="monthly_charge"
                    className="text-text-grey text-body-s font-sans font-normal"
                  >
                    Monthly charge
                  </Label>
                  <Input
                    id="monthly_charge"
                    type="number"
                    min={0}
                    step="0.01"
                    className="form-font bg-light-grey h-12 rounded-xl border-0"
                    {...register("monthly_charge")}
                  />
                  <FieldError message={errors.monthly_charge?.message} />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="yearly_charge"
                    className="text-text-grey text-body-s font-sans font-normal"
                  >
                    Yearly charge
                  </Label>
                  <Input
                    id="yearly_charge"
                    type="number"
                    min={0}
                    step="0.01"
                    className="form-font bg-light-grey h-12 rounded-xl border-0"
                    {...register("yearly_charge")}
                  />
                  <FieldError message={errors.yearly_charge?.message} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label
                    htmlFor="event_creation"
                    className="text-text-grey text-body-s font-sans font-normal"
                  >
                    Event creation limit
                  </Label>
                  <Input
                    id="event_creation"
                    type="number"
                    min={0}
                    className="form-font bg-light-grey h-12 rounded-xl border-0"
                    {...register("event_creation")}
                  />
                  <FieldError message={errors.event_creation?.message} />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="connection_range"
                    className="text-text-grey text-body-s font-sans font-normal"
                  >
                    Connection range
                  </Label>
                  <Input
                    id="connection_range"
                    type="text"
                    placeholder="e.g. Limited, Global"
                    className="form-font bg-light-grey h-12 rounded-xl border-0"
                    {...register("connection_range")}
                  />
                  <FieldError message={errors.connection_range?.message} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label
                    htmlFor="sales_commission"
                    className="text-text-grey text-body-s font-sans font-normal"
                  >
                    Sales commission (%)
                  </Label>
                  <Input
                    id="sales_commission"
                    type="number"
                    min={0}
                    max={100}
                    className="form-font bg-light-grey h-12 rounded-xl border-0"
                    {...register("sales_commission")}
                  />
                  <FieldError message={errors.sales_commission?.message} />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="service_commission"
                    className="text-text-grey text-body-s font-sans font-normal"
                  >
                    Service commission (%)
                  </Label>
                  <Input
                    id="service_commission"
                    type="number"
                    min={0}
                    max={100}
                    className="form-font bg-light-grey h-12 rounded-xl border-0"
                    {...register("service_commission")}
                  />
                  <FieldError message={errors.service_commission?.message} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {checkboxFields.map((field) => (
                  <label
                    key={field.name}
                    htmlFor={field.name}
                    className="text-light-black text-body-s flex items-center gap-2 font-normal"
                  >
                    <input id={field.name} type="checkbox" {...register(field.name)} />
                    {field.label}
                  </label>
                ))}
              </div>
            </div>
            <div className={"flex justify-between gap-4 px-4 pb-2.5"}>
              <button
                type="button"
                onClick={toggle}
                className={"border-light-grey-50 w-full rounded-xl border bg-white px-12 py-2.75"}
              >
                <p className={"text-body-l font-medium text-black"}>Cancel</p>
              </button>
              <SubmitButton
                loading={createPlanMutation.isPending || updatePlanMutation.isPending}
                title="Confirm"
                isValid={isValid}
                classes="w-full rounded-xl border border-step-color px-12 py-2.75"
              />
            </div>
          </form>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default PlanFormModal;
