import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import DeleteModal from "./DeleteModal";

const mutate = vi.fn();
const push = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => vi.fn(),
  useSelector: (select: (state: unknown) => unknown) => select({ auth: { isLoggedIn: true } }),
}));
vi.mock("@/hooks/useNavigation", () => ({ useNavigation: () => ({ push }) }));
vi.mock("@/features/events/mutations", () => ({
  useDeleteEventMutation: () => ({ mutate, isPending: false }),
}));

describe("DeleteModal", () => {
  beforeEach(() => {
    mutate.mockReset();
    push.mockReset();
  });

  it("deletes with a reason and returns to the events list", () => {
    mutate.mockImplementation((_reason, options) => options.onSuccess());
    render(<DeleteModal isOpen toggle={vi.fn()} id="e1" />);

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(mutate).toHaveBeenCalledWith("Policy violation", expect.any(Object));
    expect(push).toHaveBeenCalledWith("/events");
  });
});
