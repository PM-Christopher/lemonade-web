export const formatNumber = (number: number, places: number) => {
    return parseFloat(String(number)).toFixed(places)
}

export const formatNumberWithCommas = (number: number) => {
    return number.toLocaleString('en-US');
};