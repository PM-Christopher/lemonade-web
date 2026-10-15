import { describe, expect, it } from "vitest";
import { apiMessage, messageOr, rememberApiMessage } from "./api-message";

describe("messageOr", () => {
  it("uses the API message when there is one", () => {
    expect(messageOr("Login successful", "Done")).toBe("Login successful");
  });

  it.each([null, undefined, "", "   "])("falls back when the message is %j", (blank) => {
    expect(messageOr(blank, "Done")).toBe("Done");
  });
});

describe("apiMessage", () => {
  it("returns the latest API message once, then the fallback", () => {
    rememberApiMessage("Event created");

    expect(apiMessage("Fallback")).toBe("Event created");
    expect(apiMessage("Fallback")).toBe("Fallback");
  });

  it("falls back when the remembered message is blank", () => {
    rememberApiMessage("  ");

    expect(apiMessage("Fallback")).toBe("Fallback");
  });
});
