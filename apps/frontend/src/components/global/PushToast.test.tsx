import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PushToast } from "./PushToast";

describe("PushToast", () => {
  it("shows the title and body and closes on dismiss", () => {
    const onClose = vi.fn();
    render(
      <PushToast
        title="New message"
        body="Xand3rx sent you a message"
        type="new_message"
        durationMs={10_000}
        isVisible
        onClose={onClose}
      />,
    );

    expect(screen.getByText("New message")).toBeTruthy();
    expect(screen.getByText("Xand3rx sent you a message")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Dismiss notification"));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
