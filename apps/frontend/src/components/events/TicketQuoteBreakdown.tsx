import React from "react";
import { ApiError } from "@lemonade/api-client";
import type { TicketQuoteResponse } from "@/features/events/api";

export interface TicketQuoteState {
  quote: TicketQuoteResponse | undefined;
  hasSelection: boolean;
  isPending: boolean;
  error: unknown;
}

const rowLabel = "tracking-custom text-text-grey font-sans text-body-s font-normal";
const rowValue = "tracking-custom text-light-black font-sans text-body-s font-semibold";

// Shows the server's price for the selection. Nothing here is computed on the client.
export const TicketQuoteBreakdown = ({
  quote,
  hasSelection,
  isPending,
  error,
}: TicketQuoteState) => {
  if (!hasSelection) {
    return <p className={`mt-4 ${rowLabel}`}>Select a ticket to see your total.</p>;
  }

  if (error) {
    return (
      <p role="alert" className="text-body-s mt-4 font-sans text-red-600">
        {error instanceof ApiError ? error.message : "We couldn't price your tickets. Try again."}
      </p>
    );
  }

  if (!quote) {
    return <p className={`mt-4 ${rowLabel}`}>Working out your total…</p>;
  }

  return (
    <div aria-busy={isPending}>
      <ul>
        {quote.lines.map((line) => (
          <li className="mt-4 flex justify-between" key={line.ticket_id}>
            <span className={rowLabel}>
              {line.quantity} {line.name}
            </span>
            <span className={rowValue}>{line.subtotal_display}</span>
          </li>
        ))}
      </ul>
      <div className="border-grey-20 my-4 border-t"></div>
      <div className="mt-4 flex justify-between">
        <span className={rowLabel}>Subtotal</span>
        <span className={rowValue}>{quote.subtotal_display}</span>
      </div>
      {quote.fees_minor > 0 && (
        <div className="mt-4 flex justify-between">
          <span className={rowLabel}>Fees</span>
          <span className={rowValue}>{quote.fees_display}</span>
        </div>
      )}
      <div className="border-grey-20 my-4 border-t"></div>
      <div className="mt-4 flex justify-between">
        <span className="tracking-custom text-text-grey text-body-xl font-sans font-normal">
          Total
        </span>
        <span
          data-testid="ticket-quote-total"
          className="tracking-custom text-light-black text-body-xl font-sans font-semibold"
        >
          {quote.total_display}
        </span>
      </div>
    </div>
  );
};
