import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { ApiError } from "@lemonade/api-client";
import AssignTicketClient from "./AssignTicketClient";

const buyMutate = vi.fn();
const dispatch = vi.fn();

vi.mock("@/images/icons/users.svg", () => ({ default: () => <svg aria-hidden="true" /> }));
vi.mock("@/images/icons/chevron-left.svg", () => ({ default: () => <svg aria-hidden="true" /> }));
vi.mock("@/components/layouts/MainLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => dispatch }));
vi.mock("react-redux", () => ({
  useSelector: (select: (state: unknown) => unknown) =>
    select({
      event: {
        tickets: [
          { id: "t-regular", ticket_name: "Regular", quantity: 2, price: 5000, purchase_limit: 5 },
          { id: "t-vip", ticket_name: "VIP", quantity: 0, price: 20000, purchase_limit: 2 },
        ],
        eventReferrals: {},
      },
    }),
}));
vi.mock("@/features/events/mutations", () => ({
  useBuyTicketMutation: () => ({ mutateAsync: buyMutate, isPending: false }),
}));
vi.mock("@/hooks/useNavigation", () => ({
  useNavigation: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
}));
vi.mock("next/navigation", () => ({
  usePathname: () => "/event/5/assign-ticket",
  useSearchParams: () => new URLSearchParams(""),
}));

const renderPage = async () => {
  await act(async () => {
    render(<AssignTicketClient id={5} />);
  });
};

const fillBuyer = () => {
  const name = screen.getByLabelText("Full name");
  const email = screen.getByLabelText("Email address");
  fireEvent.change(name, { target: { value: "Ada Lovelace" } });
  fireEvent.change(email, { target: { value: "ada@example.com" } });
};

describe("AssignTicketClient checkout", () => {
  beforeEach(() => {
    buyMutate.mockReset();
    dispatch.mockReset();
  });

  it("sends only ticket ids and quantities, never prices or totals", async () => {
    buyMutate.mockResolvedValue({ completed: true });
    await renderPage();
    fillBuyer();
    const pay = screen.getByRole("button", { name: "Pay now" });
    await waitFor(() => expect(pay).toBeEnabled());
    fireEvent.click(pay);

    await waitFor(() => expect(buyMutate).toHaveBeenCalled());
    const [{ eventId, data }] = buyMutate.mock.calls[0];
    expect(eventId).toBe(5);
    expect(data).toMatchObject({ fullname: "Ada Lovelace", email: "ada@example.com" });
    for (const ticket of data.tickets) {
      expect(Object.keys(ticket).sort()).toEqual(["id", "quantity"]);
    }
    expect(JSON.stringify(data)).not.toMatch(/price|total|amount/);
  });

  it("shows the server's reason when the purchase fails", async () => {
    buyMutate.mockRejectedValue(
      new ApiError({
        status: 422,
        errorCode: "validation-failed",
        message: "Regular is sold out",
        kind: "validation",
      }),
    );
    await renderPage();
    fillBuyer();
    const pay = screen.getByRole("button", { name: "Pay now" });
    await waitFor(() => expect(pay).toBeEnabled());
    fireEvent.click(pay);

    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({ message: "Regular is sold out", type: "error" }),
        }),
      ),
    );
  });

  it("has no accessibility violations", async () => {
    await renderPage();
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
