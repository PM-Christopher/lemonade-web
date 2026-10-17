import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/images/icons/close.svg", () => ({ default: () => <svg /> }));
vi.mock("next/image", () => ({ default: ({ alt }: { alt: string }) => <span>{alt}</span> }));

const { default: VerifyPaymentModal } = await import("./VerifyPaymentModal");

describe("VerifyPaymentModal", () => {
  it("lists each bought ticket's type and ID", () => {
    render(
      <VerifyPaymentModal
        isOpen
        toggle={vi.fn()}
        toggleMore={vi.fn()}
        event={{
          data: {
            event: { event_name: "Halloween party", start_date: "2026-10-31T16:00:00Z" },
            tickets: [{ ticket_type: "Regular", ticket_code: "AT-12345678" }],
          },
        }}
      />,
    );

    expect(screen.getByText("Halloween party")).toBeInTheDocument();
    expect(screen.getByText("Regular")).toBeInTheDocument();
    expect(screen.getByText("AT-12345678")).toBeInTheDocument();
  });

  it("hides the ticket rows when none came back", () => {
    render(
      <VerifyPaymentModal isOpen toggle={vi.fn()} toggleMore={vi.fn()} event={{ data: {} }} />,
    );

    expect(screen.queryByText("Ticket ID")).not.toBeInTheDocument();
  });
});
