import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import MainError from "./error";

vi.mock("@/lib/logger", () => ({ logger: { error: vi.fn() } }));

describe("MainError", () => {
  it("shows a friendly message with the reference and retries on click", () => {
    const reset = vi.fn();
    render(
      <MainError error={Object.assign(new Error("boom"), { digest: "abc123" })} reset={reset} />,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Reference: abc123")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
