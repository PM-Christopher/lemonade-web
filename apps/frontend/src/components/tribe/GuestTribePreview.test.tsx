import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/global/FallbackImage", () => ({
  FallbackImage: ({ alt }: { alt: string }) => <span>{alt}</span>,
}));
vi.mock("@/components/global/BrandLogo", () => ({ BrandLogo: () => <span>logo</span> }));
vi.mock("next/image", () => ({ default: ({ alt }: { alt: string }) => <span>{alt}</span> }));

const { GuestTribePreview } = await import("./GuestTribePreview");

const tribe = {
  tribe_name: "Naija Arts Network",
  slug: "naija-arts-network-gn6up",
  category: "Art",
  description: "A home for artists.",
  image: null,
  monetized: false,
  membership_fee: "0.00",
  members: 1200,
  threads: 45,
  created_by: "Ada",
  created_at: "2026-01-01",
};

describe("GuestTribePreview", () => {
  it("shows the summary and a sign up link", () => {
    render(<GuestTribePreview tribe={tribe} />);

    expect(screen.getByRole("heading", { name: "Naija Arts Network" })).toBeInTheDocument();
    expect(screen.getByText("A home for artists.")).toBeInTheDocument();
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign up to join this tribe" })).toHaveAttribute(
      "href",
      "/signup",
    );
  });

  it("sends login back to the tribe", () => {
    render(<GuestTribePreview tribe={tribe} />);

    const links = screen.getAllByRole("link", { name: "Log in" });
    expect(links[0]).toHaveAttribute("href", "/login?next=%2Ftribe%2Fnaija-arts-network-gn6up");
  });
});
