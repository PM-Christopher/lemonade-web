import dayjs from "dayjs";

/** A naira amount the backend already formatted, shown with the ₦ sign and thousands commas. */
export const naira = (amount: string | number | null | undefined) => {
  const value = Number(amount ?? 0);
  const fraction = Number.isInteger(value) ? 0 : 2;
  return `₦${value.toLocaleString("en-US", { minimumFractionDigits: fraction, maximumFractionDigits: 2 })}`;
};

export const shortDate = (value: string | null | undefined) =>
  value ? dayjs(value).format("DD MMM, YYYY hh:mm A") : "N/A";

/** An amount with its currency code, like "NGN 1,250.00", for ledger and payment tables. */
export const currencyAmount = (
  currency: string | null | undefined,
  amount: string | number | null | undefined,
) =>
  `${currency ?? ""} ${Number(amount ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`.trim();
