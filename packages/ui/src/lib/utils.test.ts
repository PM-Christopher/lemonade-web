import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { cn, typeScale } from "./utils";

const typographyCss = readFileSync(resolve(process.cwd(), "../config/typography.css"), "utf8");

describe("type scale merge", () => {
  it("uses the same roles as the shared typography file", () => {
    for (const role of typeScale) {
      expect(typographyCss).toContain(`--text-${role}:`);
    }
  });

  it("keeps a text color next to a type role", () => {
    expect(cn("text-mid-green", "text-body-s")).toBe("text-mid-green text-body-s");
  });

  it("keeps button color when the button size is set", () => {
    expect(cn("text-button", "text-primary-foreground")).toBe(
      "text-button text-primary-foreground",
    );
  });

  it("lets a later type role replace an earlier one", () => {
    expect(cn("text-body-s", "text-body-l")).toBe("text-body-l");
  });
});
