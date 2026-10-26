import { afterEach, describe, expect, it, vi } from "vitest";
import { detectCountryName } from "./detectCountry";

const withTimeZone = (timeZone: string) =>
  vi.spyOn(Intl, "DateTimeFormat").mockReturnValue({
    resolvedOptions: () => ({ timeZone }),
  } as unknown as Intl.DateTimeFormat);

describe("detectCountryName", () => {
  afterEach(() => vi.restoreAllMocks());

  it("names the country for the device timezone", () => {
    withTimeZone("Africa/Lagos");

    expect(detectCountryName()).toBe("Nigeria");
  });

  it("gives nothing for a timezone it does not know", () => {
    withTimeZone("Etc/Nowhere");

    expect(detectCountryName()).toBeNull();
  });
});
