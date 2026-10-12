import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import type { TicketQuoteResponse } from "@/features/events/api";
import TicketSummary from "./TicketSummary";

vi.mock("@/images/icons/close.svg", () => ({ default: () => <svg aria-hidden="true" /> }));

const quote: TicketQuoteResponse = {
  event_id: "e-1",
  currency: "NGN",
  lines: [
    {
      ticket_id: "t-regular",
      name: "Regular",
      quantity: 2,
      unit_price_minor: 500000,
      unit_price_display: "₦5,000.00",
      unit_fee_minor: 0,
      unit_fee_display: "₦0.00",
      subtotal_minor: 1000000,
      subtotal_display: "₦10,000.00",
      fees_minor: 0,
      fees_display: "₦0.00",
      total_minor: 1000000,
      total_display: "₦10,000.00",
    },
  ],
  subtotal_minor: 1000000,
  subtotal_display: "₦10,000.00",
  fees_minor: 0,
  fees_display: "₦0.00",
  total_minor: 1000000,
  total_display: "₦10,000.00",
};

const renderSummary = (overrides: Partial<Parameters<typeof TicketSummary>[0]> = {}) => {
  const props = {
    toggle: vi.fn(),
    proceed: vi.fn(),
    isOpen: true,
    totalLabel: quote.total_display,
    quoteState: { quote, hasSelection: true, isPending: false, error: null },
    ...overrides,
  };
  return { props, ...render(<TicketSummary {...props} />) };
};

describe("TicketSummary", () => {
  it("lists the server-priced lines and total, with no made-up fee", async () => {
    const { container } = renderSummary();

    expect(screen.getByText("2 Regular")).toBeInTheDocument();
    expect(screen.getByTestId("ticket-quote-total")).toHaveTextContent("₦10,000.00");
    expect(screen.queryByText("Fees")).not.toBeInTheDocument();
    expect(container.textContent).not.toContain("2,000");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("continues to checkout and closes from its own controls", () => {
    const { props } = renderSummary();

    fireEvent.click(screen.getByRole("button", { name: "Assign ticket" }));
    fireEvent.click(screen.getByRole("button", { name: "Close summary" }));

    expect(props.proceed).toHaveBeenCalledTimes(1);
    expect(props.toggle).toHaveBeenCalledTimes(1);
  });

  it("asks for a selection before showing a price", () => {
    renderSummary({
      totalLabel: "₦0.00",
      quoteState: { quote: undefined, hasSelection: false, isPending: false, error: null },
    });

    expect(screen.getByText("Select a ticket to see your total.")).toBeInTheDocument();
  });
});
