import { describe, expect, it } from "vitest";
import { LayoutDashboard } from "lucide-react";
import { applyMenuPreferences } from "./menuOrder";
import type { PageLink } from "./pageLinks";

const link = (name: string, path: string): PageLink => ({ name, path, icon: LayoutDashboard });
const links = [
  link("Overview", "/"),
  link("Tribes", "/tribes"),
  link("Users", "/users"),
  link("Events", "/events"),
];
const names = (items: PageLink[]) => items.map((item) => item.name);

describe("applyMenuPreferences names", () => {
  it("uses the admin's own names and keeps the default for the rest", () => {
    const renamed = applyMenuPreferences(links, {
      menu_order: [],
      hidden_menu: [],
      menu_labels: { "/tribes": " Communities ", "/users": "  " },
    });

    expect(names(renamed)).toEqual(["Overview", "Communities", "Users", "Events"]);
  });
});

describe("applyMenuPreferences", () => {
  it("keeps the default order when nothing is saved", () => {
    expect(names(applyMenuPreferences(links, undefined))).toEqual([
      "Overview",
      "Tribes",
      "Users",
      "Events",
    ]);
    expect(names(applyMenuPreferences(links, { menu_order: [], hidden_menu: [] }))).toEqual([
      "Overview",
      "Tribes",
      "Users",
      "Events",
    ]);
  });

  it("follows the saved order and puts pages it doesn't know about last", () => {
    const result = applyMenuPreferences(links, {
      menu_order: ["/events", "/", "/users"],
      hidden_menu: [],
    });
    expect(names(result)).toEqual(["Events", "Overview", "Users", "Tribes"]);
  });

  it("hides chosen pages but never Overview", () => {
    const result = applyMenuPreferences(links, { menu_order: [], hidden_menu: ["/", "/users"] });
    expect(names(result)).toEqual(["Overview", "Tribes", "Events"]);
  });
});
