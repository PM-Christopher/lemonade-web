import { describe, expect, it } from "vitest";
import { centerNumericColumns } from "./tableAlign";

describe("centerNumericColumns", () => {
  it("centers the head and cells of numeric columns only", () => {
    const classes = centerNumericColumns(["ROLE", "ADMINS", "PERMISSIONS", "ACTIONS"]);

    expect(classes).toContain("[&_th:nth-child(2)]:text-center");
    expect(classes).toContain("[&_td:nth-child(3)]:text-center");
    expect(classes).not.toContain("nth-child(1)");
    expect(classes).not.toContain("nth-child(4)");
  });

  it("matches labels in any case and gives nothing for a table without numbers", () => {
    expect(centerNumericColumns(["Title", "Monthly charge"])).toContain("nth-child(2)");
    expect(centerNumericColumns(["NAME", "EMAIL"])).toBe("");
  });
});
