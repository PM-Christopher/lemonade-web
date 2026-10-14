import { z } from "zod";
import { amountField } from "@lemonade/validation";

// Mirrors lemonade-backend's App\Http\Requests\Admin\UpdateWithdrawalThresholdRequest.
export const withdrawalThresholdSchema = z.object({
  threshold: amountField({ label: "Threshold", allowZero: true }),
});
export type WithdrawalThresholdInput = z.infer<typeof withdrawalThresholdSchema>;

// Mirrors Add/DeductUserWalletBalanceRequest.
export const walletAdjustmentSchema = z.object({
  amount: amountField(),
});
export type WalletAdjustmentInput = z.infer<typeof walletAdjustmentSchema>;

// Mirrors App\Http\Requests\Admin\UpdatePointsRedemptionRateRequest.
export const pointsRateSchema = z.object({
  rate: amountField({ label: "Rate" }),
});
export type PointsRateInput = z.infer<typeof pointsRateSchema>;
