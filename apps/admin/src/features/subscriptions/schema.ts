import { z } from "zod";
import { amountField } from "@lemonade/validation";

// A typed-in whole number, kept as the string the input holds.
const wholeNumber = (label: string, max?: number) =>
  z
    .string()
    .trim()
    .min(1, { error: `${label} is required` })
    .regex(/^\d+$/, { error: `${label} must be a whole number` })
    .refine((value) => max === undefined || Number(value) <= max, {
      error: `${label} can't be more than ${max}`,
    });

// Mirrors lemonade-backend's App\Http\Requests\Admin\SubscriptionPlanRequest. access_type and
// connection_range have no `in:` list there, so they are free text.
export const planSchema = z.object({
  title: z.string().trim().min(1, { error: "Title is required" }).max(120),
  access_type: z.string().trim().min(1, { error: "Access type is required" }).max(60),
  monthly_charge: amountField({ label: "Monthly charge", allowZero: true }),
  yearly_charge: amountField({ label: "Yearly charge", allowZero: true }),
  ver_badge: z.boolean(),
  forum_creation: z.boolean(),
  business_listing: z.boolean(),
  lemon_id: z.boolean(),
  event_creation: wholeNumber("Event creation"),
  sales_commission: wholeNumber("Sales commission", 100),
  service_commission: wholeNumber("Service commission", 100),
  connection_range: z.string().trim().min(1, { error: "Connection range is required" }).max(60),
  offline_benefits: z.boolean(),
  recommended: z.boolean(),
});
export type PlanInput = z.infer<typeof planSchema>;
