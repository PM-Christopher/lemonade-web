import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import EditThreadModal from "./EditThreadModal";

const mutate = vi.fn();

vi.mock("@/images/icons/close.svg", () => ({ default: () => <svg aria-hidden="true" /> }));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => vi.fn() }));
vi.mock("@/features/tribes/mutations", () => ({
  useEditThreadMutation: () => ({ mutate, isPending: false }),
}));

const renderModal = () =>
  render(
    <EditThreadModal
      isOpen
      toggle={vi.fn()}
      tribeSlug="design-circle"
      threadId="th1"
      topic="Old title"
      thoughts="Old content"
    />,
  );

describe("EditThreadModal", () => {
  beforeEach(() => mutate.mockReset());

  it("starts with the current title and content and saves the changes", async () => {
    renderModal();

    expect(screen.getByLabelText("Topic")).toHaveValue("Old title");
    fireEvent.change(screen.getByLabelText("Topic"), { target: { value: "New title" } });
    fireEvent.click(screen.getByRole("button", { name: /Save changes/ }));

    await waitFor(() => expect(mutate).toHaveBeenCalled());
    expect(mutate.mock.calls[0][0]).toEqual({
      id: "th1",
      data: { topic: "New title", thoughts: "Old content" },
    });
  });

  it("will not save an empty title", async () => {
    renderModal();

    fireEvent.change(screen.getByLabelText("Topic"), { target: { value: "  " } });
    fireEvent.click(screen.getByRole("button", { name: /Save changes/ }));

    expect(await screen.findByText("Topic is required")).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });
});
