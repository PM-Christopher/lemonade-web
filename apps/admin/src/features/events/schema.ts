import { z } from "zod";
import { amountField } from "@lemonade/validation";

// Mirrors the `commission_charge` rule in lemonade-backend's EventController::updateCommission.
export const commissionChargeSchema = z.object({
  percentage: amountField({ label: "Commission percentage", allowZero: true }).refine(
    (value) => Number(value) <= 100,
    { error: "Commission percentage can't be more than 100" },
  ),
});
export type CommissionChargeInput = z.infer<typeof commissionChargeSchema>;

// Mirrors Create/UpdatePromotionRequest, minus `image`: the form doesn't collect
// one yet (see the note on promotionsApi in api.ts).
export const promotionSchema = z.object({
  name: z.string().trim().min(1, { error: "Promotion name is required" }),
  price_option: z.string().min(1, { error: "Choose a price option" }),
  price: amountField({ label: "Price", allowZero: true }),
  breakdown: z
    .array(z.string().trim().min(1, { error: "Breakdown can't be empty" }))
    .min(1, { error: "Add at least one breakdown" }),
});
export type PromotionInput = z.infer<typeof promotionSchema>;

// Mirrors ScheduleEventPromotionRequest: promotion_date is required, a date, today or later.
export const schedulePromotionSchema = z.object({
  promotion_date: z
    .string()
    .min(1, { error: "Pick a promotion date" })
    .refine((value) => value >= new Date().toISOString().slice(0, 10), {
      error: "The promotion date can't be in the past",
    }),
});
export type SchedulePromotionInput = z.infer<typeof schedulePromotionSchema>;
