import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import MemberInfoModal from "./MemberInfoModal";

describe("MemberInfoModal", () => {
  it("shows the member's profile and social links", () => {
    render(
      <MemberInfoModal
        isOpen
        toggle={() => undefined}
        user={{
          id: "u1",
          fullname: "Christjoe",
          username: "christjoe",
          profile_image: null,
          industry: "Software engineering",
          bio: "I am a STEM professional",
          socials: [{ name: "facebook", value: "https://facebook.com/c" }],
        }}
      />,
    );

    expect(screen.getByText("Christjoe")).toBeInTheDocument();
    expect(screen.getByText("Software engineering")).toBeInTheDocument();
    expect(screen.getByText("I am a STEM professional")).toBeInTheDocument();
    expect(screen.getByLabelText("facebook")).toHaveAttribute("href", "https://facebook.com/c");
  });
});
