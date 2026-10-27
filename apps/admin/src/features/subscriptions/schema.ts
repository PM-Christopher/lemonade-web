import { z } from "zod";
import { amountField } from "@lemonade/validation";

// A whole percent, or empty to use the admin's standard rate.
const optionalPercent = (label: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === "" || /^\d+$/.test(value), {
      error: `${label} must be a whole number`,
    })
    .refine((value) => value === "" || Number(value) <= 100, {
      error: `${label} can't be more than 100`,
    });

export const PLAN_TYPES = ["Limited", "Unlimited"] as const;

const planType = (label: string) => z.enum(PLAN_TYPES, { error: `Choose a ${label}` });

// The usage limits are only checked on a Limited plan, so they can stay empty on an Unlimited one.
const LIMIT_FIELDS = ["event_creation", "tribe_limit", "thread_limit", "business_limit"] as const;
const LIMIT_LABELS: Record<(typeof LIMIT_FIELDS)[number], string> = {
  event_creation: "Events per month",
  tribe_limit: "Tribes",
  thread_limit: "Threads per tribe",
  business_limit: "Businesses",
};

// Mirrors lemonade-backend's App\Http\Requests\Admin\SubscriptionPlanRequest.
export const planSchema = z
  .object({
    title: z.string().trim().min(1, { error: "Title is required" }).max(120),
    access_type: planType("plan type"),
    monthly_charge: amountField({ label: "Monthly charge", allowZero: true }),
    yearly_charge: amountField({ label: "Yearly charge", allowZero: true }),
    ver_badge: z.boolean(),
    forum_creation: z.boolean(),
    business_listing: z.boolean(),
    lemon_id: z.boolean(),
    event_creation: z.string().trim(),
    tribe_limit: z.string().trim(),
    thread_limit: z.string().trim(),
    business_limit: z.string().trim(),
    sales_commission: optionalPercent("Ticket commission"),
    service_commission: optionalPercent("Service commission"),
    connection_range: planType("connection range"),
    offline_benefits: z.boolean(),
    recommended: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if (values.access_type !== "Limited") return;
    for (const field of LIMIT_FIELDS) {
      if (!/^\d+$/.test(values[field])) {
        ctx.addIssue({
          code: "custom",
          path: [field],
          message: `${LIMIT_LABELS[field]}: enter a whole number, 0 for no cap`,
        });
      }
    }
  });
export type PlanInput = z.infer<typeof planSchema>;
