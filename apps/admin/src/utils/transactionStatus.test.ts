import { describe, expect, it } from "vitest";
import { transactionStatus } from "./helper";

describe("transactionStatus", () => {
  it.each([
    ["success", "Successful"],
    ["paid", "Successful"],
    ["pending", "Pending"],
    ["approved", "Processing"],
    ["rejected", "Rejected"],
    ["abandoned", "Failed"],
  ])("reads %s as %s", (status, label) => {
    expect(transactionStatus(status).label).toBe(label);
  });

  it("keeps an unknown status readable", () => {
    expect(transactionStatus("on hold").label).toBe("On Hold");
  });
});
