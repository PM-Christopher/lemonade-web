import React from "react";
import { XIcon } from "lucide-react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Label, Input, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import type { AdminSubscriptionPlan } from "@/features/subscriptions/api";
import { useCreatePlanMutation, useUpdatePlanMutation } from "@/features/subscriptions/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { FormikButton } from "@/components/global/FormikButton";

interface PlanFormModalProps {
  isOpen: boolean;
  toggle: () => void;
  // Its absence means create mode; its presence means edit mode, pre-filled.
  plan?: AdminSubscriptionPlan;
}

interface PlanFormValues {
  title: string;
  access_type: string;
  monthly_charge: string;
  yearly_charge: string;
  ver_badge: boolean;
  forum_creation: boolean;
  lemon_id: boolean;
  event_creation: string;
  sales_commission: string;
  service_commission: string;
  connection_range: string;
  offline_benefits: boolean;
  recommended: boolean;
}

// Mirrors SubscriptionPlanRequest::rules() (lemonade-backend). access_type
// and connection_range have no `in:` enum there — just `string|max:60` —
// confirmed by grepping the backend for both fields: seeders/factories/tests
// use inconsistent casing ("Full"/"Limited"/"Global"/"global"), so there's
// no fixed option set to hardcode into a <select>. Free-text inputs instead.
const planSchema = yup.object({
  title: yup.string().required("Title is required").max(120),
  access_type: yup.string().required("Access type is required").max(60),
  monthly_charge: yup
    .number()
    .typeError("Monthly charge must be a number")
    .min(0)
    .required("Monthly charge is required"),
  yearly_charge: yup
    .number()
    .typeError("Yearly charge must be a number")
    .min(0)
    .required("Yearly charge is required"),
  ver_badge: yup.boolean().required(),
  forum_creation: yup.boolean().required(),
  lemon_id: yup.boolean().required(),
  event_creation: yup
    .number()
    .typeError("Event creation must be a number")
    .integer()
    .min(0)
    .required("Event creation is required"),
  sales_commission: yup
    .number()
    .typeError("Sales commission must be a number")
    .integer()
    .min(0)
    .max(100)
    .required("Sales commission is required"),
  service_commission: yup
    .number()
    .typeError("Service commission must be a number")
    .integer()
    .min(0)
    .max(100)
    .required("Service commission is required"),
  connection_range: yup.string().required("Connection range is required").max(60),
  offline_benefits: yup.boolean().required(),
  recommended: yup.boolean().required(),
});

const emptyValues: PlanFormValues = {
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

// The response's monthly_charge_minor/yearly_charge_minor are minor units
// (kobo) — the create/update request instead expects major units (naira),
// per SubscriptionPlanRequest::toDto() -> Money::fromUnits(...)->minor.
// Verified against app/Http/Requests/Admin/SubscriptionPlanRequest.php and
// app/Support/Money.php directly, not assumed.
function toFormValues(plan: AdminSubscriptionPlan): PlanFormValues {
  return {
    title: plan.title,
    access_type: plan.access_type,
    monthly_charge: String(plan.monthly_charge_minor / 100),
    yearly_charge: String(plan.yearly_charge_minor / 100),
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

const checkboxFields: Array<{ name: keyof PlanFormValues; label: string }> = [
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

  const formik = useFormik<PlanFormValues>({
    initialValues: plan ? toFormValues(plan) : emptyValues,
    validationSchema: planSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: (values) => {
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
              message: plan ? "Plan updated successfully" : "Plan created successfully",
              type: "success",
            }),
          );
          toggle();
        },
        onError: (error) => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: error?.message || "Something went wrong",
              type: "error",
            }),
          );
        },
      });
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="w-[480px] rounded-xl bg-white pt-4 pb-1">
          <form onSubmit={formik.handleSubmit}>
            <div className={"px-4 py-1"}>
              <div className="flex items-center justify-between">
                <p className="font-sans text-[18px] leading-[27px] font-semibold">{title}</p>
                <div className="cursor-pointer" onClick={toggle}>
                  <XIcon />
                </div>
              </div>
            </div>
            <div className={"flex max-h-[60vh] flex-col gap-4 overflow-y-auto px-4 py-4"}>
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-text-grey font-sans text-[14px] font-normal">
                  Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  className="form-font bg-light-grey h-12 rounded-xl border-0"
                  value={formik.values.title}
                  onChange={formik.handleChange("title")}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="access_type"
                  className="text-text-grey font-sans text-[14px] font-normal"
                >
                  Access type
                </Label>
                <Input
                  id="access_type"
                  type="text"
                  placeholder="e.g. Limited, Unlimited"
                  className="form-font bg-light-grey h-12 rounded-xl border-0"
                  value={formik.values.access_type}
                  onChange={formik.handleChange("access_type")}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label
                    htmlFor="monthly_charge"
                    className="text-text-grey font-sans text-[14px] font-normal"
                  >
                    Monthly charge
                  </Label>
                  <Input
                    id="monthly_charge"
                    type="number"
                    min={0}
                    step="0.01"
                    className="form-font bg-light-grey h-12 rounded-xl border-0"
                    value={formik.values.monthly_charge}
                    onChange={formik.handleChange("monthly_charge")}
                    onBlur={formik.handleBlur}
                  />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="yearly_charge"
                    className="text-text-grey font-sans text-[14px] font-normal"
                  >
                    Yearly charge
                  </Label>
                  <Input
                    id="yearly_charge"
                    type="number"
                    min={0}
                    step="0.01"
                    className="form-font bg-light-grey h-12 rounded-xl border-0"
                    value={formik.values.yearly_charge}
                    onChange={formik.handleChange("yearly_charge")}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label
                    htmlFor="event_creation"
                    className="text-text-grey font-sans text-[14px] font-normal"
                  >
                    Event creation limit
                  </Label>
                  <Input
                    id="event_creation"
                    type="number"
                    min={0}
                    className="form-font bg-light-grey h-12 rounded-xl border-0"
                    value={formik.values.event_creation}
                    onChange={formik.handleChange("event_creation")}
                    onBlur={formik.handleBlur}
                  />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="connection_range"
                    className="text-text-grey font-sans text-[14px] font-normal"
                  >
                    Connection range
                  </Label>
                  <Input
                    id="connection_range"
                    type="text"
                    placeholder="e.g. Limited, Global"
                    className="form-font bg-light-grey h-12 rounded-xl border-0"
                    value={formik.values.connection_range}
                    onChange={formik.handleChange("connection_range")}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label
                    htmlFor="sales_commission"
                    className="text-text-grey font-sans text-[14px] font-normal"
                  >
                    Sales commission (%)
                  </Label>
                  <Input
                    id="sales_commission"
                    type="number"
                    min={0}
                    max={100}
                    className="form-font bg-light-grey h-12 rounded-xl border-0"
                    value={formik.values.sales_commission}
                    onChange={formik.handleChange("sales_commission")}
                    onBlur={formik.handleBlur}
                  />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="service_commission"
                    className="text-text-grey font-sans text-[14px] font-normal"
                  >
                    Service commission (%)
                  </Label>
                  <Input
                    id="service_commission"
                    type="number"
                    min={0}
                    max={100}
                    className="form-font bg-light-grey h-12 rounded-xl border-0"
                    value={formik.values.service_commission}
                    onChange={formik.handleChange("service_commission")}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {checkboxFields.map((field) => (
                  <label
                    key={field.name}
                    htmlFor={field.name}
                    className="text-light-black flex items-center gap-2 text-[14px] font-normal"
                  >
                    <input
                      id={field.name}
                      type="checkbox"
                      checked={Boolean(formik.values[field.name])}
                      onChange={(e) => formik.setFieldValue(field.name, e.target.checked)}
                    />
                    {field.label}
                  </label>
                ))}
              </div>
            </div>
            <div className={"flex justify-between gap-4 px-4 pb-2.5"}>
              <button
                type="button"
                onClick={toggle}
                className={"border-light-grey-50 w-full rounded-xl border bg-white px-12 py-[11px]"}
              >
                <p className={"text-[16px] font-medium text-black"}>Cancel</p>
              </button>
              <FormikButton
                loading={createPlanMutation.isPending || updatePlanMutation.isPending}
                title="Confirm"
                error={formik.isValid}
                classes="w-full rounded-xl border border-step-color px-12 py-[11px]"
              />
            </div>
          </form>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default PlanFormModal;
