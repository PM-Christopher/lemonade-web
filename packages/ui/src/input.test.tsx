import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Input } from "./input";

describe("Input", () => {
  it("toggles a password field between hidden and shown", () => {
    render(<Input aria-label="Password" type="password" />);
    const input = screen.getByLabelText("Password");

    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(input).toHaveAttribute("type", "text");

    fireEvent.click(screen.getByRole("button", { name: "Hide password" }));
    expect(input).toHaveAttribute("type", "password");
  });

  it("has no visibility toggle for other input types", () => {
    render(<Input aria-label="Email" type="email" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
