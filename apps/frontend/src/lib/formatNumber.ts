type NumberLike = number | string | null | undefined;

// The API sends some amounts as strings such as "3004.00".
const toNumber = (value: NumberLike): number | null => {
  const parsed = typeof value === "string" ? Number(value.replace(/,/g, "")) : value;
  return typeof parsed === "number" && Number.isFinite(parsed) ? parsed : null;
};

export const formatNumber = (number: number, places: number) => {
  if (number) {
    return parseFloat(String(number)).toFixed(places);
  }
  return 0;
};

export const formatNumberWithCommas = (value: NumberLike) => {
  const number = toNumber(value);
  if (number) {
    if (number <= 1) {
      return number;
    }
    return number.toLocaleString("en-US");
  }
  return 0;
};

/** Display only: "₦3,004.00". The amount itself is never computed here. */
export const formatNaira = (value: NumberLike): string =>
  `₦${(toNumber(value) ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/** Display only: "₦2,000", with decimals only when the amount has them. */
export const formatNairaWhole = (value: NumberLike): string =>
  `₦${(toNumber(value) ?? 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

/** Display only: kobo from the API as naira, e.g. 200000 becomes "₦2,000". */
export const formatMinorNaira = (minor: NumberLike): string =>
  `₦${((toNumber(minor) ?? 0) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

/** Kobo from the API as a plain naira number, for form prefill. */
export const minorToNaira = (minor: NumberLike): number => (toNumber(minor) ?? 0) / 100;
