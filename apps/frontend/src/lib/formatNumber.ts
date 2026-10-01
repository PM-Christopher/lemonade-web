export const formatNumber = (number: number, places: number) => {
  if (number) {
    return parseFloat(String(number)).toFixed(places);
  }
  return 0;
};

export const formatNumberWithCommas = (number: number | undefined | null) => {
  if (number) {
    if (number <= 1) {
      return number;
    }
    return number.toLocaleString("en-US");
  }
  return 0;
};
