import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import UnsuspendModal from "./UnsuspendModal";

const mutate = vi.fn();

vi.mock("react-redux", () => ({ useDispatch: () => vi.fn() }));
vi.mock("@/features/events/mutations", () => ({
  useActivateEventMutation: () => ({ mutate, isPending: false }),
}));

describe("UnsuspendModal", () => {
  beforeEach(() => mutate.mockReset());

  it("reactivates the event once confirmed", () => {
    render(<UnsuspendModal isOpen toggle={vi.fn()} id="e1" />);

    fireEvent.click(screen.getByRole("button", { name: "Activate" }));

    expect(mutate).toHaveBeenCalled();
  });
});
