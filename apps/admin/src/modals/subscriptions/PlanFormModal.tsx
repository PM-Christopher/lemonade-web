import React from "react";
import { XIcon } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Label,
  Input,
  MoneyInput,
  Dialog,
  DialogContentBare,
  DialogTitle,
  FieldError,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import type { AdminSubscriptionPlan } from "@/features/subscriptions/api";
import { useCreatePlanMutation, useUpdatePlanMutation } from "@/features/subscriptions/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { SubmitButton } from "@/components/global/SubmitButton";
import { PLAN_TYPES, planSchema, type PlanInput } from "@/features/subscriptions/schema";
import { applyServerErrors } from "@/lib/form-errors";

interface PlanFormModalProps {
  isOpen: boolean;
  toggle: () => void;
  // Its absence means create mode; its presence means edit mode, pre-filled.
  plan?: AdminSubscriptionPlan;
}

const emptyValues: PlanInput = {
  title: "",
  access_type: "Limited",
  monthly_charge: "",
  yearly_charge: "",
  ver_badge: false,
  forum_creation: false,
  business_listing: true,
  lemon_id: false,
  event_creation: "0",
  tribe_limit: "0",
  thread_limit: "0",
  business_limit: "0",
  sales_commission: "",
  service_commission: "",
  connection_range: "Limited",
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
    business_listing: plan.benefits.business_listing,
    lemon_id: plan.benefits.lemon_id,
    event_creation: String(plan.benefits.event_creation),
    tribe_limit: String(plan.benefits.tribe_limit),
    thread_limit: String(plan.benefits.thread_limit),
    business_limit: String(plan.benefits.business_limit),
    sales_commission:
      plan.benefits.ticket_sales_commission === null
        ? ""
        : String(plan.benefits.ticket_sales_commission),
    service_commission:
      plan.benefits.service_commission === null ? "" : String(plan.benefits.service_commission),
    connection_range: plan.benefits.connection_range,
    offline_benefits: plan.benefits.offline_benefits,
    recommended: plan.recommended,
  };
}

const limitFields: Array<{
  name: "event_creation" | "tribe_limit" | "thread_limit" | "business_limit";
  label: string;
}> = [
  { name: "event_creation", label: "Events per month" },
  { name: "tribe_limit", label: "Tribes" },
  { name: "thread_limit", label: "Threads per tribe" },
  { name: "business_limit", label: "Businesses" },
];

// A fixed choice of Limited or Unlimited.
function TypeSelect({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} className="form-font bg-light-grey h-12 w-full rounded-xl border-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PLAN_TYPES.map((type) => (
          <SelectItem key={type} value={type}>
            {type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const checkboxFields: Array<{
  name:
    | "ver_badge"
    | "forum_creation"
    | "business_listing"
    | "lemon_id"
    | "offline_benefits"
    | "recommended";
  label: string;
}> = [
  { name: "ver_badge", label: "Verification badge" },
  { name: "forum_creation", label: "Tribe creation" },
  { name: "business_listing", label: "Business listing" },
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
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<PlanInput>({
    resolver: zodResolver(planSchema),
    values: plan ? toFormValues(plan) : emptyValues,
    mode: "onTouched",
  });

  const isLimited = useWatch({ control, name: "access_type" }) === "Limited";

  const onSubmit = (values: PlanInput) => {
    // An Unlimited plan sends no limits, the backend keeps them at 0.
    const limit = (value: string) => (values.access_type === "Limited" ? Number(value) : 0);
    const payload = {
      title: values.title,
      access_type: values.access_type,
      monthly_charge: Number(values.monthly_charge),
      yearly_charge: Number(values.yearly_charge),
      ver_badge: values.ver_badge,
      forum_creation: values.forum_creation,
      business_listing: values.business_listing,
      lemon_id: values.lemon_id,
      event_creation: limit(values.event_creation),
      tribe_limit: limit(values.tribe_limit),
      thread_limit: limit(values.thread_limit),
      business_limit: limit(values.business_limit),
      // Blank keeps the standard rate; 0 is a real rate.
      sales_commission: values.sales_commission === "" ? null : Number(values.sales_commission),
      service_commission:
        values.service_commission === "" ? null : Number(values.service_commission),
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
                <Controller
                  name="access_type"
                  control={control}
                  render={({ field }) => (
                    <TypeSelect id="access_type" value={field.value} onChange={field.onChange} />
                  )}
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
                  <Controller
                    name="monthly_charge"
                    control={control}
                    render={({ field }) => (
                      <MoneyInput
                        id="monthly_charge"
                        className="form-font bg-light-grey h-12 rounded-xl border-0"
                        value={field.value as string}
                        onValueChange={field.onChange}
                        onBlur={field.onBlur}
                        padDecimals
                      />
                    )}
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
                  <Controller
                    name="yearly_charge"
                    control={control}
                    render={({ field }) => (
                      <MoneyInput
                        id="yearly_charge"
                        className="form-font bg-light-grey h-12 rounded-xl border-0"
                        value={field.value as string}
                        onValueChange={field.onChange}
                        onBlur={field.onBlur}
                        padDecimals
                      />
                    )}
                  />
                  <FieldError message={errors.yearly_charge?.message} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="connection_range"
                  className="text-text-grey text-body-s font-sans font-normal"
                >
                  Connection range
                </Label>
                <Controller
                  name="connection_range"
                  control={control}
                  render={({ field }) => (
                    <TypeSelect
                      id="connection_range"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <FieldError message={errors.connection_range?.message} />
              </div>

              {isLimited ? (
                <div className="bg-light-grey flex flex-col gap-3 rounded-xl p-3">
                  <div>
                    <p className="text-body-s font-semibold">Usage limits</p>
                    <p className="text-text-grey text-meta">
                      What a subscriber can create. Enter 0 for no cap.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {limitFields.map((item) => (
                      <div className="grid gap-2" key={item.name}>
                        <Label
                          htmlFor={item.name}
                          className="text-text-grey text-body-s font-sans font-normal"
                        >
                          {item.label}
                        </Label>
                        <Controller
                          name={item.name}
                          control={control}
                          render={({ field }) => (
                            <MoneyInput
                              id={item.name}
                              className="form-font h-12 rounded-xl border-0 bg-white"
                              value={field.value as string}
                              onValueChange={field.onChange}
                              onBlur={field.onBlur}
                              allowDecimals={false}
                              grouping={false}
                            />
                          )}
                        />
                        <FieldError message={errors[item.name]?.message} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-text-grey text-meta">Unlimited plans have no usage limits.</p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label
                    htmlFor="sales_commission"
                    className="text-text-grey text-body-s font-sans font-normal"
                  >
                    Ticket commission (%)
                  </Label>
                  <Controller
                    name="sales_commission"
                    control={control}
                    render={({ field }) => (
                      <MoneyInput
                        id="sales_commission"
                        className="form-font bg-light-grey h-12 rounded-xl border-0"
                        value={field.value as string}
                        onValueChange={field.onChange}
                        onBlur={field.onBlur}
                        allowDecimals={false}
                        grouping={false}
                      />
                    )}
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
                  <Controller
                    name="service_commission"
                    control={control}
                    render={({ field }) => (
                      <MoneyInput
                        id="service_commission"
                        className="form-font bg-light-grey h-12 rounded-xl border-0"
                        value={field.value as string}
                        onValueChange={field.onChange}
                        onBlur={field.onBlur}
                        allowDecimals={false}
                        grouping={false}
                      />
                    )}
                  />
                  <FieldError message={errors.service_commission?.message} />
                </div>
                <p className="text-text-grey text-meta col-span-2">
                  Leave a commission blank to use the standard rate. 0 means no commission.
                </p>
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
