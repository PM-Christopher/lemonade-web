import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import DeleteTribeModal from "./DeleteTribeModal";

const mutate = vi.fn();
const push = vi.fn();

vi.mock("@/images/icons/close.svg", () => ({ default: () => <svg aria-hidden="true" /> }));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => vi.fn() }));
vi.mock("@/hooks/useNavigation", () => ({ useNavigation: () => ({ push }) }));
vi.mock("@/features/tribes/mutations", () => ({
  useDeleteTribeMutation: () => ({ mutate, isPending: false }),
}));

describe("DeleteTribeModal", () => {
  beforeEach(() => {
    mutate.mockReset();
    push.mockReset();
  });

  it("deletes a free tribe and returns to the tribe list", () => {
    mutate.mockImplementation((_vars, options) =>
      options.onSuccess({ status: "deleted", message: "Tribe deleted" }),
    );
    render(
      <DeleteTribeModal isOpen toggle={vi.fn()} tribeId="t1" tribeSlug="free" isPaid={false} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Yes, delete/ }));

    expect(mutate.mock.calls[0][0]).toEqual({ id: "t1" });
    expect(push).toHaveBeenCalledWith("/tribe");
  });

  it("explains that a paid tribe needs admin approval and stays on the page", () => {
    mutate.mockImplementation((_vars, options) =>
      options.onSuccess({ status: "pending_approval", message: "Your request was sent." }),
    );
    render(<DeleteTribeModal isOpen toggle={vi.fn()} tribeId="t2" tribeSlug="paid" isPaid />);

    expect(screen.getByText(/admin has to approve/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Send request/ }));

    expect(mutate).toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });
});
