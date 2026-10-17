import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/images/icons/facebook-color.svg", () => ({ default: () => <svg /> }));
vi.mock("@/images/icons/instagram-color.svg", () => ({ default: () => <svg /> }));
vi.mock("@/images/icons/linkedin-color.svg", () => ({ default: () => <svg /> }));
vi.mock("@/images/icons/twitter-color.svg", () => ({ default: () => <svg /> }));
vi.mock("@/images/icons/webIcon.svg", () => ({ default: () => <svg /> }));
vi.mock("@/images/icons/whatsappIcon.svg", () => ({ default: () => <svg /> }));

const { SocialLinks } = await import("./SocialLinks");

describe("SocialLinks", () => {
  it("shows an icon for each known network, whatever the name's case", () => {
    render(
      <SocialLinks
        socials={[
          { name: "Instagram", value: "@ada" },
          { name: "facebook", value: "https://facebook.com/ada" },
          { name: "Phone", value: "+2347000000000" },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute(
      "href",
      "https://instagram.com/ada",
    );
    expect(screen.getByRole("link", { name: "Facebook" })).toHaveAttribute(
      "href",
      "https://facebook.com/ada",
    );
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  it("renders nothing when there is no link to show", () => {
    const { container } = render(<SocialLinks socials={[{ name: "Phone", value: "123" }]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
