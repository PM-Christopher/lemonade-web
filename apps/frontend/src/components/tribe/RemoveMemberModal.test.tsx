import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import RemoveMemberModal from "./RemoveMemberModal";

const mutate = vi.fn();
const dispatch = vi.fn();
const onClose = vi.fn();

vi.mock("@/images/icons/close.svg", () => ({ default: () => <span /> }));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => dispatch }));
vi.mock("@/features/tribes/mutations", () => ({
  useRemoveTribeMemberMutation: () => ({ mutate, isPending: false }),
}));

const renderModal = () =>
  render(
    <RemoveMemberModal
      tribeSlug="start-ups"
      member={{ userId: "u1", username: "christjoe" }}
      onClose={onClose}
    />,
  );

describe("RemoveMemberModal", () => {
  beforeEach(() => {
    mutate.mockReset();
    dispatch.mockReset();
    onClose.mockReset();
  });

  it("names the member and removes them once confirmed", () => {
    mutate.mockImplementation((_userId, options) => options.onSuccess());
    renderModal();

    expect(screen.getByText(/remove @christjoe from your tribe/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Yes, remove" }));

    expect(mutate).toHaveBeenCalledWith("u1", expect.any(Object));
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({ message: "Member removed", type: "success" }),
      }),
    );
    expect(onClose).toHaveBeenCalled();
  });

  it("keeps the member and shows the error when removal fails", () => {
    mutate.mockImplementation((_userId, options) => options.onError(new Error("Nope")));
    renderModal();

    fireEvent.click(screen.getByRole("button", { name: "Yes, remove" }));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: expect.objectContaining({ type: "error" }) }),
    );
    expect(onClose).not.toHaveBeenCalled();
  });
});
