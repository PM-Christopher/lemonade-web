"use client";
import { Input } from "@lemonade/ui";
import { formatMoneyInput, sanitizeMoneyInput } from "@/lib/formatNumber";

type MoneyInputProps = Omit<React.ComponentProps<typeof Input>, "value" | "onChange" | "type"> & {
  /** The plain amount, e.g. "3004.5". */
  value: string;
  onValueChange: (value: string) => void;
  /** Set to false for whole-number amounts. */
  allowDecimals?: boolean;
};

// Shows thousands separators while typing; the form keeps the plain amount.
export function MoneyInput({
  value,
  onValueChange,
  allowDecimals = true,
  ...props
}: MoneyInputProps) {
  return (
    <Input
      {...props}
      type="text"
      inputMode={allowDecimals ? "decimal" : "numeric"}
      value={formatMoneyInput(value)}
      onChange={(event) => {
        const amount = sanitizeMoneyInput(event.target.value);
        onValueChange(allowDecimals ? amount : (amount.split(".")[0] ?? ""));
      }}
    />
  );
}
