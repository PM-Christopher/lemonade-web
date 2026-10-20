import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import PendingEventsView from "./PendingEventsView";

const push = vi.fn();
vi.mock("@/hooks/useNavigation", () => ({ useNavigation: () => ({ push }) }));
vi.mock("@/hooks/useSearchParams", () => ({
  default: () => ({ searchParams: new URLSearchParams("") }),
}));

const event = {
  id: 1,
  unique_id: "EV-1",
  event_name: "Launch night",
  event_image: null,
  event_type: "Physical",
  category: "Music",
  date_created_at: "2026-10-20T08:00:00Z",
  status: "PENDING",
  start_date: "",
  end_date: "",
  rejection_reason: null,
  reviewed_at: null,
};

describe("PendingEventsView", () => {
  it("lists events waiting for approval and opens one", () => {
    render(<PendingEventsView pageData={{ events: [event] }} />);

    fireEvent.click(screen.getByText("Launch night"));

    expect(push).toHaveBeenCalledWith("/events/1");
  });

  it("says when nothing is waiting", () => {
    render(<PendingEventsView pageData={{ events: [] }} />);

    expect(screen.getByText("No events waiting for approval")).toBeInTheDocument();
  });
});
