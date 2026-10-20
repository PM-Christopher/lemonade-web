import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mutate = vi.fn();
const dispatch = vi.fn();

vi.mock("next/dynamic", () => ({
  default: () =>
    function FakeScanner({ onScan }: { onScan: (code: string) => void }) {
      return (
        <button type="button" onClick={() => onScan("QR-CODE")}>
          Simulate scan
        </button>
      );
    },
}));
vi.mock("@/images/icons/scanIcon.svg", () => ({ default: () => <svg /> }));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => dispatch }));
vi.mock("@/features/events/mutations", () => ({
  useScanTicketMutation: () => ({ mutate }),
}));

const { default: ScanTicketButton } = await import("./ScanTicketButton");

describe("ScanTicketButton", () => {
  it("looks up the scanned code and hands the guest back", () => {
    const onGuest = vi.fn();
    mutate.mockImplementation((_code, options) =>
      options.onSuccess({
        guest_details: {
          id: 9,
          checked_in: false,
          user: { name: "Ada" },
          ticket: { ticket_name: "VIP" },
        },
      }),
    );
    render(<ScanTicketButton eventId={5} onGuest={onGuest} />);

    fireEvent.click(screen.getByRole("button", { name: "Scan ticket" }));
    fireEvent.click(screen.getByRole("button", { name: "Simulate scan" }));

    expect(mutate).toHaveBeenCalledWith("QR-CODE", expect.any(Object));
    expect(onGuest).toHaveBeenCalledWith(
      expect.objectContaining({ id: 9, name: "Ada", ticket_name: "VIP", checked_in: false }),
    );
  });

  it("shows an error toast when the ticket is not valid", () => {
    const onGuest = vi.fn();
    mutate.mockImplementation((_code, options) => options.onError(new Error("bad")));
    render(<ScanTicketButton eventId={5} onGuest={onGuest} />);

    fireEvent.click(screen.getByRole("button", { name: "Scan ticket" }));
    fireEvent.click(screen.getByRole("button", { name: "Simulate scan" }));

    expect(onGuest).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  });
});
