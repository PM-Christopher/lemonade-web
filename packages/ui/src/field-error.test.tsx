import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FieldError } from "./field-error";

describe("FieldError", () => {
  it("announces the message", () => {
    render(<FieldError message="Email is required" />);

    expect(screen.getByRole("alert")).toHaveTextContent("Email is required");
  });

  it("renders nothing without a message", () => {
    const { container } = render(<FieldError />);

    expect(container).toBeEmptyDOMElement();
  });
});
