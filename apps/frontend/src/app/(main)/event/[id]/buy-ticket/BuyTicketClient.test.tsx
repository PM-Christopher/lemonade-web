import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { ApiError } from "@lemonade/api-client";
import type { TicketQuoteResponse } from "@/features/events/api";
import { routes } from "@/lib/routes";
import BuyTicketClient from "./BuyTicketClient";

const dispatch = vi.fn();
const push = vi.fn();
const quoteQuery = vi.fn();
let search = "";

vi.mock("@/images/icons/chevron-left.svg", () => ({ default: () => <svg aria-hidden="true" /> }));
vi.mock("@/images/icons/calendar.svg", () => ({ default: () => <svg aria-hidden="true" /> }));
vi.mock("@/images/icons/clock.svg", () => ({ default: () => <svg aria-hidden="true" /> }));
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));
vi.mock("next/dynamic", () => ({ default: () => () => null }));
vi.mock("@/components/layouts/MainLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => dispatch }));
vi.mock("@/hooks/useNavigation", () => ({
  useNavigation: () => ({ push, back: vi.fn() }),
}));
vi.mock("@/hooks/useDebounce", () => ({
  default: <T,>(value: T) => ({ debouncedValue: value }),
}));
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(search),
}));
// Stable reference, like a real query cache hit.
const ticketData = vi.hoisted(() => ({
  isLoading: false,
  data: {
    event: { event_name: "Lagos Jazz Night", start_date: null, end_date: null },
    tickets: [
      {
        id: "t-regular",
        name: "Regular",
        price: 500000,
        price_display: "₦5,000.00",
        purchase_limit: 5,
      },
      { id: "t-vip", name: "VIP", price: 1000050, price_display: "₦11,000.55", purchase_limit: 2 },
      {
        id: "t-group",
        name: "Group",
        price: 200000,
        price_display: "₦2,000.00",
        purchase_limit: 5,
      },
    ],
  },
}));

vi.mock("@/features/events/queries", () => ({
  useEventTicketDataQuery: () => ticketData,
  useTicketQuoteQuery: (...args: unknown[]) => quoteQuery(...args),
}));

const quote: TicketQuoteResponse = {
  event_id: "e-1",
  currency: "NGN",
  lines: [
    {
      ticket_id: "t-vip",
      name: "VIP",
      quantity: 1,
      unit_price_minor: 1000050,
      unit_price_display: "₦10,000.50",
      unit_fee_minor: 100005,
      unit_fee_display: "₦1,000.05",
      subtotal_minor: 1000050,
      subtotal_display: "₦10,000.50",
      fees_minor: 100005,
      fees_display: "₦1,000.05",
      total_minor: 1100055,
      total_display: "₦11,000.55",
    },
  ],
  subtotal_minor: 1000050,
  subtotal_display: "₦10,000.50",
  fees_minor: 100005,
  fees_display: "₦1,000.05",
  total_minor: 1100055,
  total_display: "₦11,000.55",
};

const renderPage = () => render(<BuyTicketClient id={42} />);

describe("BuyTicketClient", () => {
  beforeEach(() => {
    dispatch.mockReset();
    push.mockReset();
    quoteQuery.mockReset();
    quoteQuery.mockReturnValue({ data: undefined, isFetching: false, error: null });
    search = "";
  });

  it("asks the server to price only the selected tickets", () => {
    renderPage();
    expect(quoteQuery).toHaveBeenLastCalledWith(42, []);

    fireEvent.click(screen.getByRole("button", { name: "Add one VIP" }));
    fireEvent.click(screen.getByRole("button", { name: "Add one VIP" }));

    expect(quoteQuery).toHaveBeenLastCalledWith(42, [{ id: "t-vip", quantity: 2 }]);
  });

  it("stops at 10 tickets in one purchase and says more can be bought afterwards", () => {
    renderPage();

    for (let i = 0; i < 5; i += 1) {
      fireEvent.click(screen.getByRole("button", { name: "Add one Regular" }));
      fireEvent.click(screen.getByRole("button", { name: "Add one Group" }));
    }
    fireEvent.click(screen.getByRole("button", { name: "Add one VIP" }));

    expect(quoteQuery).toHaveBeenLastCalledWith(42, [
      { id: "t-regular", quantity: 5 },
      { id: "t-group", quantity: 5 },
    ]);
    expect(screen.getByText(/10-ticket limit/)).toBeInTheDocument();
  });

  it("shows the server's figures, fees included, not a client estimate", async () => {
    quoteQuery.mockReturnValue({ data: quote, isFetching: false, error: null });
    const { container } = renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Add one VIP" }));

    expect(screen.getByText("Fees")).toBeInTheDocument();
    expect(screen.getAllByText("₦1,000.05").length).toBeGreaterThan(0);
    expect(screen.getByTestId("ticket-quote-total")).toHaveTextContent("₦11,000.55");
    expect(container.textContent).not.toMatch(/1000050|1,000,050/);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("shows why the server refused to price the selection", () => {
    quoteQuery.mockReturnValue({
      data: undefined,
      isFetching: false,
      error: new ApiError({
        status: 400,
        errorCode: "not-specified",
        kind: "server",
        message: "Tickets are not on sale for this event",
      }),
    });
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Add one Regular" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Tickets are not on sale for this event");
  });

  it("carries only ids and quantities to checkout, keeping the referral", () => {
    search = "referral=ABC 1";
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Add one Regular" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Assign ticket" })[0]!);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: {
          tickets: [
            expect.objectContaining({ id: "t-regular", ticket_name: "Regular", quantity: 1 }),
          ],
        },
      }),
    );
    expect(JSON.stringify(dispatch.mock.calls[0])).not.toMatch(/price|total/);
    expect(push).toHaveBeenCalledWith(`${routes.EVENT_ASSIGN_TICKET(42)}?referral=ABC%201`);
  });

  it("refuses to continue with nothing selected", () => {
    renderPage();

    fireEvent.click(screen.getAllByRole("button", { name: "Assign ticket" })[0]!);

    expect(push).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: expect.objectContaining({ type: "error" }) }),
    );
  });
});
