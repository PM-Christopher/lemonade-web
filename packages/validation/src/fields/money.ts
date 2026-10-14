import { z } from "zod";

const DECIMAL_AMOUNT = /^\d+(\.\d{1,2})?$/;

/**
 * A typed-in money amount, kept as the string the user entered. Mirrors the
 * backend's `numeric|decimal:0,2` rules. Commas are allowed and stripped.
 */
export const amountField = ({
  label = "Amount",
  allowZero = false,
}: { label?: string; allowZero?: boolean } = {}) =>
  z
    .string()
    .trim()
    .transform((value) => value.replace(/,/g, ""))
    .pipe(
      z
        .string()
        .min(1, { error: `${label} is required` })
        .regex(DECIMAL_AMOUNT, { error: `${label} must be a number with at most 2 decimal places` })
        .refine((value) => allowZero || Number(value) > 0, {
          error: `${label} must be more than 0`,
        }),
    );
