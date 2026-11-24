import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import TopNav from "./TopNav";
import type { AppNotification } from "@/features/notifications";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));
vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard" }));
vi.mock("react-redux", () => ({
  useSelector: () => ({ user: { id: "me", username: "me" } }),
}));
vi.mock("@/hooks/useIsMobile", () => ({ useIsMobile: () => false }));
vi.mock("@/context/MenuStateProvider", () => ({
  usePersistentMenuState: () => ({ setSelectedMenu: vi.fn() }),
}));
vi.mock("@/components/global/BrandLogo", () => ({ BrandLogo: () => null }));

const push = vi.fn();
vi.mock("@/hooks/useNavigation", () => ({ useNavigation: () => ({ push }) }));

const markRead = vi.fn();
let notifications: AppNotification[] = [];
vi.mock("@/features/notifications", () => ({
  useNotificationsQuery: () => ({ data: { notifications } }),
  useMarkNotificationReadMutation: () => ({ mutate: markRead, isPending: false }),
  useMarkAllNotificationsReadMutation: () => ({ mutate: vi.fn(), isPending: false }),
  formatNotificationTime: () => "now",
  countUnread: () => 1,
  formatBadgeCount: () => "1",
}));

vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    disconnect() {}
  },
);

const open = () => {
  fireEvent.click(screen.getByRole("button", { name: /notifications/i }));
};

describe("TopNav notifications", () => {
  beforeEach(() => {
    push.mockReset();
    markRead.mockReset();
  });

  it("opens the chat with the sender when a new-message notification is clicked", () => {
    notifications = [
      {
        id: "n1",
        title: "New message from ada",
        body: "ada sent you a message",
        type: "message",
        meta: { sender_id: "user-9" },
        read_at: null,
      },
    ];
    render(<TopNav />);
    open();

    fireEvent.click(screen.getByText("New message from ada"));

    expect(push).toHaveBeenCalledWith("/connect?chat=user-9");
    expect(markRead).toHaveBeenCalledWith("n1");
  });

  it("shows the detail dialog for other notification types", () => {
    notifications = [
      { id: "n2", title: "Welcome", body: "Hello there", type: "general", read_at: null },
    ];
    render(<TopNav />);
    open();

    fireEvent.click(screen.getByText("Welcome"));

    expect(push).not.toHaveBeenCalled();
    expect(markRead).toHaveBeenCalledWith("n2");
  });
});
