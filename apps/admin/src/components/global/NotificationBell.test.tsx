import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NotificationBell } from "./NotificationBell";

const push = vi.fn();
const markRead = vi.fn();
const markAllRead = vi.fn();

const data = {
  unread_count: 2,
  support_unread: 0,
  notifications: [
    {
      id: "n1",
      title: "New withdrawal request",
      body: "Ada requested a withdrawal of ₦5,000",
      type: "withdrawal_requested",
      meta: { link: "/wallet-management/abc" },
      read: false,
      created_at: new Date().toISOString(),
    },
    {
      id: "n2",
      title: "New dispute raised",
      body: "A dispute was raised",
      type: "dispute_raised",
      meta: { link: "/disputes" },
      read: true,
      created_at: new Date().toISOString(),
    },
  ],
};

vi.mock("@/hooks/useNavigation", () => ({ useNavigation: () => ({ push }) }));
vi.mock("@/features/notifications", () => ({
  useAdminNotificationsQuery: () => ({ data }),
  useMarkNotificationReadMutation: () => ({ mutate: markRead }),
  useMarkAllNotificationsReadMutation: () => ({ mutate: markAllRead, isPending: false }),
}));

describe("NotificationBell", () => {
  beforeEach(() => {
    push.mockReset();
    markRead.mockReset();
    markAllRead.mockReset();
  });

  it("shows the unread count on the bell", () => {
    render(<NotificationBell />);

    expect(screen.getByRole("button", { name: "Notifications, 2 unread" })).toBeInTheDocument();
  });

  it("opens an unread notification: marks it read and goes to its page", () => {
    render(<NotificationBell />);
    fireEvent.click(screen.getByRole("button", { name: /Notifications/ }));

    fireEvent.click(screen.getByText("New withdrawal request"));

    expect(markRead).toHaveBeenCalledWith("n1");
    expect(push).toHaveBeenCalledWith("/wallet-management/abc");
  });

  it("does not mark an already-read one again", () => {
    render(<NotificationBell />);
    fireEvent.click(screen.getByRole("button", { name: /Notifications/ }));

    fireEvent.click(screen.getByText("New dispute raised"));

    expect(markRead).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/disputes");
  });

  it("marks everything read", () => {
    render(<NotificationBell />);
    fireEvent.click(screen.getByRole("button", { name: /Notifications/ }));

    fireEvent.click(screen.getByRole("button", { name: "Mark all as read" }));

    expect(markAllRead).toHaveBeenCalled();
  });
});
