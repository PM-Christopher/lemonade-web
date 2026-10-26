import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AllBusinessCard from "./AllBusinessCard";
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
    services: ["UI designs", "Branding", "Mockups", "Logos"],
    service_rate: 200000,
    ...over,
  }) as BusinessInterface;

describe("AllBusinessCard", () => {
  it("shows the first service, how many more there are and the hourly rate in naira", () => {
    render(<AllBusinessCard business={business({})} />);

    expect(screen.getByText("UI designs")).toBeInTheDocument();
    expect(screen.getByText("+3")).toBeInTheDocument();
    expect(screen.getByText("₦2,000/hr")).toBeInTheDocument();
  });

  it("leaves out the services row when there are none, keeping the rate", () => {
    const { container } = render(<AllBusinessCard business={business({ services: [] })} />);

    expect(container.querySelectorAll(".min-w-0.flex-wrap")).toHaveLength(0);
    expect(screen.getByText("₦2,000/hr")).toBeInTheDocument();
  });

  it("leaves out the whole bottom section when there is no service and no rate", () => {
    const { container } = render(
      <AllBusinessCard business={business({ services: [], service_rate: 0 })} />,
    );

    expect(container.querySelector(".bg-mid-grey.mt-auto")).toBeNull();
  });
});
