import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ConnectClient from "./ConnectClient";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("next/dynamic", () => ({ default: () => () => null }));
vi.mock("react-redux", () => ({ useSelector: () => ({ user: { id: "me" } }) }));
vi.mock("@/hooks/usePusher", () => ({ usePusher: vi.fn() }));
vi.mock("@/hooks/useAuthReady", () => ({ useAuthReady: () => true }));
vi.mock("@/hooks/useIsMobile", () => ({ useIsMobile: () => false }));
const replace = vi.fn();
vi.mock("@/hooks/useNavigation", () => ({ useNavigation: () => ({ replace }) }));
vi.mock("@/components/layouts/MainLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/Skeletons", () => ({ ChatListCardSkeleton: () => null }));
vi.mock("@/components/Jobs/ChatListCard", () => ({ default: () => null }));
vi.mock("@/components/connect/UserSearch", () => ({ default: () => null }));
vi.mock("@/components/connect/Modal/UserInfoModal", () => ({ default: () => null }));
vi.mock("@/components/connect/Modal/SettingsModal", () => ({ default: () => null }));
vi.mock("@/components/connect/EmptyChat", () => ({ default: () => <p>No chat open</p> }));
vi.mock("@/components/connect/OpenedChat", () => ({ default: () => <p>Chat is open</p> }));
vi.mock("@/images/icons/requestIcon.svg", () => ({ default: () => null }));
vi.mock("@/images/icons/gear.svg", () => ({ default: () => null }));

const chatQuery = vi.fn();
vi.mock("@/features/connect/queries", () => ({
  useChatHistoryQuery: () => ({ data: { chats: [] }, isLoading: false }),
  useConnectionQuery: () => ({ data: undefined }),
  useInvitesQuery: () => ({ data: { invites: [] } }),
  useChatQuery: (...args: unknown[]) => {
    chatQuery(...args);
    return { data: undefined };
  },
}));

describe("ConnectClient", () => {
  beforeEach(() => {
    replace.mockReset();
    chatQuery.mockReset();
  });

  it("starts with no chat open", () => {
    render(<ConnectClient />);

    expect(screen.getByText("No chat open")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("opens the chat with the person in ?chat= and clears the link", () => {
    render(<ConnectClient initialChatUserId="user-9" />);

    expect(chatQuery).toHaveBeenLastCalledWith("user-9", { enabled: true });
    expect(replace).toHaveBeenCalledWith("/connect");
  });
});
