import {getCode} from "country-list"

export const formatCountry = (country: string) => {
    return getCode(country)
}