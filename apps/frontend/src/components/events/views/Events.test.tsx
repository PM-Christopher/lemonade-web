import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const event = (id: number, name: string) => ({ id, event_name: name }) as never;

const events = {
  trending: [event(1, "Trending Gig")],
  this_week: [event(2, "Soon Party")],
  upcoming: [event(2, "Soon Party"), event(3, "Later Fest")],
};

vi.mock("@/features/events/queries", () => ({
  useEventsQuery: () => ({ data: events, isLoading: false }),
}));
vi.mock("@/components/events/EventCard", () => ({
  default: ({ event }: { event: { event_name: string } }) => <span>{event.event_name}</span>,
}));
vi.mock("@/components/global/FallbackImage", () => ({
  FallbackImage: ({ alt }: { alt: string }) => <span>{alt}</span>,
}));
vi.mock("@/images/icons/dot.svg", () => ({ default: () => <svg /> }));
vi.mock("lucide-react", () => ({ CalendarIcon: () => <svg /> }));

const { default: EventsSectionView } = await import("./Events");

const renderView = (props = {}) =>
  render(
    <EventsSectionView
      results={[]}
      searchTerm=""
      filtered={false}
      filteredEvents={[]}
      filteredLoading={false}
      {...props}
    />,
  );

describe("EventsSectionView", () => {
  it("shows This week before All events", () => {
    renderView();

    const headings = screen.getAllByText(/^(This week|All events)$/).map((el) => el.textContent);
    expect(headings).toEqual(["This week", "All events"]);
  });

  it("tags trending events and links Get ticket to the event page", () => {
    renderView();

    expect(screen.getByText("Trending")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get ticket" })).toHaveAttribute("href", "/event/1");
  });

  it("hides the trending banner while searching", () => {
    renderView({ searchTerm: "fest", results: [event(3, "Later Fest")] });

    expect(screen.queryByText("Trending")).not.toBeInTheDocument();
    expect(screen.getByText("Search results")).toBeInTheDocument();
  });

  it("clears an active filter from the results header", () => {
    const onClearFilter = vi.fn();
    renderView({
      filtered: true,
      filteredEvents: [event(3, "Later Fest")],
      onClearFilter,
    });

    fireEvent.click(screen.getByRole("button", { name: "Clear filter" }));
    expect(onClearFilter).toHaveBeenCalledOnce();
  });

  it("does not flash stale or empty results while a search is pending", () => {
    renderView({ searchTerm: "fest", searchLoading: true, results: [event(3, "Later Fest")] });

    expect(screen.queryByText("Later Fest")).not.toBeInTheDocument();
    expect(screen.queryByText("No results found")).not.toBeInTheDocument();
  });
});
