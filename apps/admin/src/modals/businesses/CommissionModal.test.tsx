import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CommissionModal from "./CommissionModal";

const mutate = vi.fn();

vi.mock("react-redux", () => ({ useDispatch: () => vi.fn() }));
vi.mock("@/features/businesses/mutations", () => ({
  useUpdateCommissionMutation: () => ({ mutate, isPending: false }),
}));

describe("CommissionModal", () => {
  beforeEach(() => mutate.mockReset());

  it("starts on the current percentage and saves a new one", async () => {
    render(<CommissionModal isOpen toggle={vi.fn()} current={10} />);

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue(10);

    fireEvent.change(input, { target: { value: "15" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(mutate).toHaveBeenCalledWith(15, expect.any(Object)));
  });

  it("rejects a value above 100 without calling the server", async () => {
    render(<CommissionModal isOpen toggle={vi.fn()} current={10} />);

    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "150" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Cannot be above 100")).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });
});
