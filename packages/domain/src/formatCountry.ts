import { getCode } from "country-list";

/** Converts a country name (e.g. "Nigeria") to its ISO 3166-1 alpha-2 code. */
export function formatCountry(country: string): string | null {
  if (country) {
    return getCode(country) ?? null;
  }
  return null;
}
