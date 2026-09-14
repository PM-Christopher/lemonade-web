import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

// Pipeline smoke test — proves jsdom + Testing Library actually render and
// interact with a real component under this app's Vitest config, not just
// that the runner starts. See docs/ARCHITECTURE.md Phase 1.
describe("Button", () => {
  it("renders its children and responds to clicks", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Continue</Button>);

    const button = screen.getByRole("button", { name: "Continue" });
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disables interaction when the disabled prop is set", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Continue
      </Button>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    expect(onClick).not.toHaveBeenCalled();
  });
});
