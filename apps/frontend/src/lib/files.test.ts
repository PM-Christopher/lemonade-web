import { describe, expect, it } from "vitest";
import { isImageFile } from "./files";

describe("isImageFile", () => {
  it("accepts images", () => {
    expect(isImageFile(new File(["x"], "a.png", { type: "image/png" }))).toBe(true);
  });

  it.each([
    ["application/pdf", "a.pdf"],
    ["video/mp4", "a.mp4"],
    ["", "unknown.bin"],
  ])("rejects %s", (type, name) => {
    expect(isImageFile(new File(["x"], name, { type }))).toBe(false);
  });
});
