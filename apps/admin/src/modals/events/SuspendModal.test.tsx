import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import SuspendModal from "./SuspendModal";

const mutate = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => vi.fn(),
  useSelector: (select: (state: unknown) => unknown) => select({ auth: { isLoggedIn: true } }),
}));
vi.mock("@/features/events/mutations", () => ({
  useSuspendEventMutation: () => ({ mutate, isPending: false }),
}));

describe("SuspendModal", () => {
  beforeEach(() => mutate.mockReset());

  it("suspends with the default reason", () => {
    render(<SuspendModal isOpen toggle={vi.fn()} id="e1" />);

    fireEvent.click(screen.getByRole("button", { name: "Suspend" }));

    expect(mutate).toHaveBeenCalledWith("Policy violation", expect.any(Object));
  });

  it("does nothing without an event id", () => {
    render(<SuspendModal isOpen toggle={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Suspend" }));

    expect(mutate).not.toHaveBeenCalled();
  });
});
