export const formatNumber = (number: number, places: number) => {
  if (number) {
    return parseFloat(String(number)).toFixed(places);
  }
  return 0;
};

/** A count with thousands commas, like 12,450. */
export const formatCount = (value: number | string | null | undefined) =>
  Number(value ?? 0).toLocaleString("en-US", { maximumFractionDigits: 2 });

export const formatNumberWithCommas = (number: number) => {
  if (number) {
    return number.toLocaleString("en-US");
  }
  return 0;
};
