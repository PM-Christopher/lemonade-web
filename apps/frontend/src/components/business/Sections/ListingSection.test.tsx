import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ListingSection from "./ListingSection";

const push = vi.hoisted(() => vi.fn());
vi.mock("@/hooks/useNavigation", () => ({ useNavigation: () => ({ push }) }));
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

describe("ListingSection", () => {
  it("offers to add a business when the plan allows listing", () => {
    render(<ListingSection businesses={[]} loading={false} />);

    expect(screen.getByRole("button", { name: "Add business" })).toBeInTheDocument();
    expect(screen.queryByText("Upgrade plan")).not.toBeInTheDocument();
  });

  it("asks the user to upgrade when the plan does not include listing", () => {
    render(<ListingSection businesses={[]} loading={false} canList={false} />);

    expect(screen.getByText("Upgrade plan")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add business" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "See all plans" }));
    expect(push).toHaveBeenCalledWith("/settings/plan");
  });
});
