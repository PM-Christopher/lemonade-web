import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import SupportInboxClient from "./SupportInboxClient";
import type { SupportInboxResponse } from "@/features/support/api";

const inbox = vi.fn();
const mutate = vi.fn();

vi.mock("next/dynamic", () => ({ default: () => () => null }));
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("react-redux", () => ({
  useDispatch: () => vi.fn(),
  useSelector: (select: (state: unknown) => unknown) => select({ auth: { isLoggedIn: true } }),
}));
vi.mock("@/components/layouts/MainLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));
vi.mock("@/components/support/SupportChatPanel", () => ({
  SupportChatPanel: ({ userId }: { userId: string }) => <div>chat with {userId}</div>,
}));
vi.mock("@/hooks/useDebounce", () => ({
  default: <T,>(value: T) => ({ debouncedValue: value }),
}));
vi.mock("@/features/authentication/queries", () => ({
  useCurrentAdminQuery: () => ({ data: { id: "a1" } }),
}));
vi.mock("@/features/support/queries", () => ({
  useSupportInboxQuery: (...args: unknown[]) => inbox(...args),
  useSavedRepliesQuery: () => ({ data: { replies: [] } }),
}));
vi.mock("@/features/support/mutations", () => ({
  useUpdateConversationMutation: () => ({ mutate, isPending: false }),
}));

const conversation = (
  id: string,
  name: string,
  unread: number,
  status: "open" | "resolved" = "open",
) => ({
  user: { id, name, image: null, email: `${id}@example.com` },
  status,
  assignee: null,
  unread,
  last_message: { text: `Hello from ${name}`, from: "user" as const, at: "2026-10-20T10:00:00Z" },
  waiting_for_reply: true,
});

const data: SupportInboxResponse = {
  counts: { open: 2, unread: 1, resolved: 3, mine: 0 },
  conversations: [conversation("u1", "Ada Okafor", 2), conversation("u2", "Bola Ade", 0)],
};

describe("SupportInboxClient", () => {
  beforeEach(() => {
    inbox.mockReset();
    mutate.mockReset();
    inbox.mockReturnValue({ data, isLoading: false });
  });

  it("lists conversations with unread counts and opens the first one", () => {
    render(<SupportInboxClient />);

    expect(screen.getAllByText("Ada Okafor").length).toBeGreaterThan(0);
    expect(screen.getByText("Bola Ade")).toBeInTheDocument();
    expect(screen.getByText("chat with u1")).toBeInTheDocument();
  });

  it("switches the chat when another conversation is picked", () => {
    render(<SupportInboxClient />);

    fireEvent.click(screen.getByText("Hello from Bola Ade"));

    expect(screen.getByText("chat with u2")).toBeInTheDocument();
  });

  it("assigns and resolves the open conversation", () => {
    render(<SupportInboxClient />);

    fireEvent.click(screen.getByRole("button", { name: "Assign to me" }));
    expect(mutate.mock.calls[0][0]).toEqual({ userId: "u1", action: "assign" });

    fireEvent.click(screen.getByRole("button", { name: "Resolve" }));
    expect(mutate.mock.calls[1][0]).toEqual({ userId: "u1", action: "resolve" });
  });

  it("asks the server for the unread and mine lists", () => {
    render(<SupportInboxClient />);

    fireEvent.click(screen.getByRole("button", { name: /Unread/ }));
    expect(inbox).toHaveBeenLastCalledWith(
      expect.objectContaining({ unread: true, status: "open" }),
      expect.anything(),
    );

    fireEvent.click(screen.getByRole("button", { name: /Mine/ }));
    expect(inbox).toHaveBeenLastCalledWith(
      expect.objectContaining({ assignee: "me" }),
      expect.anything(),
    );
  });

  it("shows a calm message when everything is answered", () => {
    inbox.mockReturnValue({ data: { ...data, conversations: [] }, isLoading: false });
    render(<SupportInboxClient />);

    expect(screen.getByText("You're all caught up.")).toBeInTheDocument();
  });
});
