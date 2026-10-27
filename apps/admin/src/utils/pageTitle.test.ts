import { describe, expect, it } from "vitest";
import { getPageHeading } from "./pageTitle";

describe("getPageHeading", () => {
  it("gives each category page a title and its feature page as the back target", () => {
    expect(getPageHeading("/tribes/categories")).toEqual({
      title: "Tribe categories",
      parent: "/tribes",
    });
    expect(getPageHeading("/businesses/categories")).toEqual({
      title: "Business categories",
      parent: "/businesses",
    });
    expect(getPageHeading("/reporting/categories")).toEqual({
      title: "Reporting categories",
      parent: "/reporting",
    });
  });

  it("still treats other tribe paths as tribe details", () => {
    expect(getPageHeading("/tribes/abc")).toEqual({ title: "Tribe details", parent: "/tribes" });
  });

  it("uses the admin's own name for a menu page, and the default without one", () => {
    expect(getPageHeading("/forum", { "/forum": "Forum Management" }).title).toBe(
      "Forum Management",
    );
    expect(getPageHeading("/forum", {}).title).toBe("Forum moderation");
  });
});
