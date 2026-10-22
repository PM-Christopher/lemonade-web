import * as React from "react";

import { Input } from "./input";

/** Keeps digits and one decimal point (max 2 decimals) from what the user typed. */
export const sanitizeMoneyInput = (text: string): string => {
  const cleaned = text.replace(/[^0-9.]/g, "");
  const [whole = "", ...rest] = cleaned.split(".");
  const trimmedWhole = whole.replace(/^0+(?=\d)/, "");
  if (rest.length === 0) return trimmedWhole;
  return `${trimmedWhole}.${rest.join("").slice(0, 2)}`;
};

/** Adds thousands separators to a sanitized amount: "1234.5" becomes "1,234.5". */
export const formatMoneyInput = (raw: string): string => {
  const [whole = "", decimals] = raw.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimals === undefined ? grouped : `${grouped}.${decimals}`;
};

/** "1000" and "1000." become "1000.00"; ".5" becomes "0.50". */
const padToCents = (raw: string): string => {
  if (raw === "" || raw === ".") return "";
  const [whole = "", decimals = ""] = raw.split(".");
  return `${whole === "" ? "0" : whole}.${decimals.padEnd(2, "0")}`;
};

export type MoneyInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange" | "type"
> & {
  /** The plain amount, e.g. "3004.5". */
  value: string;
  onValueChange: (value: string) => void;
  /** Set to false for whole-number amounts. */
  allowDecimals?: boolean;
  /** Show thousands separators. Turn off for percentages and counts. */
  grouping?: boolean;
  /** Fill in the cents when the field loses focus, so 1000 reads 1,000.00. */
  padDecimals?: boolean;
};

// Only digits and one decimal point get through; the form keeps the plain amount.
export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  (
    {
      value,
      onValueChange,
      allowDecimals = true,
      grouping = true,
      padDecimals = false,
      onBlur,
      ...props
    },
    ref,
  ) => (
    <Input
      {...props}
      ref={ref}
      type="text"
      inputMode={allowDecimals ? "decimal" : "numeric"}
      autoComplete="off"
      value={grouping ? formatMoneyInput(value) : value}
      onChange={(event) => {
        const amount = sanitizeMoneyInput(event.target.value);
        onValueChange(allowDecimals ? amount : (amount.split(".")[0] ?? ""));
      }}
      onBlur={(event) => {
        if (padDecimals && allowDecimals) onValueChange(padToCents(value));
        onBlur?.(event);
      }}
    />
  ),
);
MoneyInput.displayName = "MoneyInput";
