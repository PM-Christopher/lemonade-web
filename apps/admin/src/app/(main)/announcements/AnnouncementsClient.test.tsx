import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import AnnouncementsClient from "./AnnouncementsClient";

const row = (id: number, title: string, status = "sent") => ({
  id,
  unique_id: `AN00${id}`,
  title,
  created_by: { name: "Demo Admin", image: null },
  content: "",
  created_at: "",
  scheduled_date: "",
  created_at_iso: "2026-10-22T20:51:00Z",
  scheduled_at: "2026-10-22T21:00:00Z",
  status,
});

vi.mock("react-redux", () => ({
  useSelector: (select: (state: unknown) => unknown) => select({ auth: { isLoggedIn: true } }),
}));
vi.mock("@/hooks/useNavigation", () => ({ useNavigation: () => ({ push: vi.fn() }) }));
vi.mock("@/features/announcements/queries", () => ({
  useAnnouncementsQuery: () => ({
    data: {
      announcements: [
        row(1, "Maintenance window"),
        row(2, "New wallet feature", "pending"),
        row(3, "Holiday notice"),
      ],
    },
  }),
}));

describe("AnnouncementsClient search", () => {
  it("filters by title, ID, creator and status", () => {
    render(<AnnouncementsClient />);
    const box = screen.getByLabelText("Search announcements");

    expect(screen.getByText("3 Announcements")).toBeInTheDocument();

    fireEvent.change(box, { target: { value: "wallet" } });
    expect(screen.getByText("1 Announcements")).toBeInTheDocument();
    expect(screen.getByText("New wallet feature")).toBeInTheDocument();

    fireEvent.change(box, { target: { value: "AN003" } });
    expect(screen.getByText("Holiday notice")).toBeInTheDocument();

    fireEvent.change(box, { target: { value: "scheduled" } });
    expect(screen.getByText("New wallet feature")).toBeInTheDocument();
    expect(screen.queryByText("Holiday notice")).not.toBeInTheDocument();

    fireEvent.change(box, { target: { value: "zzz" } });
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });
});
