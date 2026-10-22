import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
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
    const { container } = render(<Avatar name="Charles Ajimobi" image="https://x.test/a.png" />);

    expect(container.querySelector("img")).toHaveAttribute("src", "https://x.test/a.png");
    expect(screen.queryByText("CA")).not.toBeInTheDocument();
  });
});
