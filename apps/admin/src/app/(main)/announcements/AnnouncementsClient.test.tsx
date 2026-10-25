import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import AnnouncementsClient from "./AnnouncementsClient";

const list = vi.fn();

const row = (id: number, title: string) => ({
  id,
  unique_id: `AN00${id}`,
  title,
  created_by: { name: "Demo Admin", image: null },
  content: "",
  created_at: "",
  scheduled_date: "",
  created_at_iso: "2026-10-22T20:51:00Z",
  scheduled_at: "2026-10-22T21:00:00Z",
  status: "sent",
});

vi.mock("react-redux", () => ({
  useSelector: (select: (state: unknown) => unknown) => select({ auth: { isLoggedIn: true } }),
}));
vi.mock("@/hooks/useNavigation", () => ({ useNavigation: () => ({ push: vi.fn() }) }));
vi.mock("@/features/announcements/queries", () => ({
  useAnnouncementsQuery: (options: { search?: string }) => list(options),
}));

beforeEach(() => {
  vi.useFakeTimers();
  list.mockImplementation(({ search }: { search?: string }) => ({
    data: {
      announcements: search
        ? [row(1, "Maintenance window")]
        : [row(1, "Maintenance window"), row(2, "Holiday")],
    },
  }));
});
afterEach(() => vi.useRealTimers());

describe("AnnouncementsClient search", () => {
  it("asks the server for matches once typing pauses", () => {
    render(<AnnouncementsClient />);
    expect(screen.getByText("2 Announcements")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Search announcements"), {
      target: { value: "  maintenance " },
    });
    expect(list).not.toHaveBeenLastCalledWith(expect.objectContaining({ search: "maintenance" }));

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(list).toHaveBeenLastCalledWith(expect.objectContaining({ search: "maintenance" }));
    expect(screen.getByText("1 Announcements")).toBeInTheDocument();
  });

  it("clears the search with the clear button", () => {
    render(<AnnouncementsClient />);
    fireEvent.change(screen.getByLabelText("Search announcements"), { target: { value: "x" } });

    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));

    expect(screen.getByLabelText("Search announcements")).toHaveValue("");
  });
});
