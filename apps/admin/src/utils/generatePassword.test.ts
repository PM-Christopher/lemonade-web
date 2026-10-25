import { describe, expect, it } from "vitest";
import { strongPasswordField } from "@lemonade/validation";
import { generateStrongPassword } from "./generatePassword";

describe("generateStrongPassword", () => {
  it("meets the strong password rule every time", () => {
    for (let i = 0; i < 200; i += 1) {
      expect(strongPasswordField().safeParse(generateStrongPassword()).success).toBe(true);
    }
  });

  it("uses the length asked for and gives a different password each time", () => {
    expect(generateStrongPassword(24)).toHaveLength(24);
    expect(generateStrongPassword()).not.toBe(generateStrongPassword());
  });
});
