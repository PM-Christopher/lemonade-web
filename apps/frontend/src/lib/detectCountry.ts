import ct from "countries-and-timezones";
import CountryList from "country-list-with-dial-code-and-flag";

// The user's country, guessed from the timezone their device is set to, as the country list names it.
export function detectCountryName(): string | null {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const code = ct.getCountryForTimezone(timeZone)?.id;
    return (code && CountryList.findOneByCountryCode(code)?.name) || null;
  } catch {
    return null;
  }
}
