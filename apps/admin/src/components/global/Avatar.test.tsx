import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Avatar, getInitials } from "./Avatar";

describe("getInitials", () => {
  it("uses the first and last name", () => {
    expect(getInitials("Charles Ajimobi")).toBe("CA");
    expect(getInitials("  ada   king  lovelace ")).toBe("AL");
  });

  it("uses one letter for a single name and a mark for none", () => {
    expect(getInitials("Demo")).toBe("D");
    expect(getInitials("")).toBe("?");
    expect(getInitials(null)).toBe("?");
  });
});

describe("Avatar", () => {
  it("shows initials when there is no picture", () => {
    render(<Avatar name="Charles Ajimobi" />);

    expect(screen.getByText("CA")).toBeInTheDocument();
  });

  it("shows the picture when there is one", () => {
    const { container } = render(
      <Avatar name="Charles Ajimobi" image="https://res.cloudinary.com/a.png" />,
    );

    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "https://res.cloudinary.com/a.png",
    );
    expect(screen.queryByText("CA")).not.toBeInTheDocument();
  });

  it("falls back to initials when the picture fails to load", () => {
    const { container } = render(
      <Avatar name="Charles Ajimobi" image="https://res.cloudinary.com/broken.png" />,
    );

    fireEvent.error(container.querySelector("img") as HTMLImageElement);

    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("CA")).toBeInTheDocument();
  });

  it("uses initials for a picture from an unknown host", () => {
    const { container } = render(<Avatar name="Charles Ajimobi" image="https://evil.test/a.png" />);

    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("CA")).toBeInTheDocument();
  });

  it("shows a placeholder picture instead of initials when one is given", () => {
    const { container } = render(<Avatar name="Party" fallbackSrc="/images/placeholder.svg" />);

    expect(container.querySelector("img")).toHaveAttribute("src", "/images/placeholder.svg");
  });
});
