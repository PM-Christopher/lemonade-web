import { afterEach, describe, expect, it, vi } from "vitest";
import { appUrl } from "./app-url";
import { routes } from "./routes";

describe("appUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("joins the app URL and a route", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://app.example.com");

    expect(appUrl(routes.TRIBE_DETAIL("hikers"))).toBe("https://app.example.com/tribe/hikers");
  });

  it("adds exactly one slash between them", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://app.example.com/");

    expect(appUrl("signup?referral=ABC")).toBe("https://app.example.com/signup?referral=ABC");
    expect(appUrl("/business")).toBe("https://app.example.com/business");
  });
});
