import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import BusinessCard from "./BusinessCard";
import type { BusinessInterface } from "@/interfaces/BusinessInterface";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

const business = (over: Partial<BusinessInterface>) =>
  ({
    id: 1,
    name: "Volta Malt",
    image: "",
    city: "Lagos",
    country: "Nigeria",
    rating: 4,
    services: ["Beverage", "Malta"],
    service_rate: 150000,
    ...over,
  }) as BusinessInterface;

describe("BusinessCard", () => {
  it("shows the hourly rate in naira, not kobo, and counts the extra services", () => {
    render(<BusinessCard business={business({})} />);

    expect(screen.getByText("₦1,500/hr")).toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("hides the services row when there are no services", () => {
    const { container } = render(<BusinessCard business={business({ services: [] })} />);

    expect(container.querySelector(".min-w-0.flex-wrap")?.textContent).not.toMatch(/Beverage/);
    expect(container.querySelectorAll(".bg-grey-20")).toHaveLength(0);
    expect(screen.getByText("₦1,500/hr")).toBeInTheDocument();
  });
});
