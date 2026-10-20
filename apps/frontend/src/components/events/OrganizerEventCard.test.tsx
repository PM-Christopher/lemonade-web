import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const deleteMutate = vi.fn();
const dispatch = vi.fn();

vi.mock("@/components/global/FallbackImage", () => ({
  FallbackImage: ({ alt }: { alt: string }) => <span>{alt}</span>,
}));
vi.mock("@/hooks/useNavigation", () => ({ useNavigation: () => ({ push: vi.fn() }) }));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => dispatch }));
vi.mock("@/features/events/mutations", () => ({
  useDeleteEventMutation: () => ({ mutate: deleteMutate, isPending: false }),
  usePublishEventMutation: () => ({ mutate: vi.fn(), isPending: false }),
}));
vi.mock("@/images/icons/calendar.svg", () => ({ default: () => <svg /> }));
vi.mock("@/images/icons/divider.svg", () => ({ default: () => <svg /> }));
vi.mock("@/images/icons/moreIcon.svg", () => ({
  default: (props: { onClick?: () => void }) => (
    <button type="button" aria-label="More" onClick={props.onClick} />
  ),
}));
vi.mock("@/images/icons/pencilIcon.svg", () => ({ default: () => <svg /> }));
vi.mock("@/images/icons/trashIcon.svg", () => ({ default: () => <svg /> }));
vi.mock("@/images/icons/goLive.svg", () => ({ default: () => <svg /> }));

const { default: OrganizerEventCard } = await import("./OrganizerEventCard");

const event = { id: 7, event_name: "Halloween party", start_date: "2026-03-23T16:00:00Z" } as never;

describe("OrganizerEventCard delete", () => {
  it("asks before deleting and deletes only after confirming", () => {
    render(<OrganizerEventCard event={event} draft={false} />);

    fireEvent.click(screen.getByRole("button", { name: "More" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete event" }));
    expect(screen.getByText("Are you sure you want to delete this event?")).toBeInTheDocument();
    expect(deleteMutate).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Yes, delete" }));
    expect(deleteMutate).toHaveBeenCalledWith(7, expect.any(Object));
  });

  it("keeps the event when the user backs out", () => {
    deleteMutate.mockClear();
    render(<OrganizerEventCard event={event} draft={false} />);

    fireEvent.click(screen.getByRole("button", { name: "More" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete event" }));
    fireEvent.click(screen.getByRole("button", { name: "No, don't delete" }));

    expect(deleteMutate).not.toHaveBeenCalled();
  });
});
