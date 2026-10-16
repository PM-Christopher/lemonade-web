import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { ChatOptionsMenu } from "./ChatOptionsMenu";

vi.mock("@/images/icons/moreIcon.svg", () => ({ default: () => <span data-testid="more-icon" /> }));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => vi.fn() }));

const endChat = vi.fn().mockResolvedValue({ message: "Chat ended" });
vi.mock("@/features/connect/api", () => ({
  connectApi: {
    blockUser: vi.fn().mockResolvedValue({ message: "ok" }),
    unblockUser: vi.fn().mockResolvedValue({ message: "ok" }),
    clearChat: vi.fn().mockResolvedValue({ message: "ok" }),
    endChat: (id: string) => endChat(id),
  },
}));

const renderMenu = (props: Partial<React.ComponentProps<typeof ChatOptionsMenu>> = {}) =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ChatOptionsMenu
        receiverId="u2"
        isBlockedByMe={false}
        onViewDetails={vi.fn()}
        onChatEnded={vi.fn()}
        {...props}
      />
    </QueryClientProvider>,
  );

describe("ChatOptionsMenu", () => {
  it("offers the four actions and swaps Block for Unblock", () => {
    const { unmount } = renderMenu();
    fireEvent.click(screen.getByLabelText("Chat options"));
    expect(screen.getByText("View user details")).toBeTruthy();
    expect(screen.getByText("Block user")).toBeTruthy();
    expect(screen.getByText("Delete chat")).toBeTruthy();
    expect(screen.getByText("End chat")).toBeTruthy();
    unmount();

    renderMenu({ isBlockedByMe: true });
    fireEvent.click(screen.getByLabelText("Chat options"));
    expect(screen.getByText("Unblock user")).toBeTruthy();
  });

  it("asks before ending a chat, then closes it", async () => {
    const onChatEnded = vi.fn();
    renderMenu({ onChatEnded });
    fireEvent.click(screen.getByLabelText("Chat options"));
    fireEvent.click(screen.getByText("End chat"));
    expect(endChat).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "End chat" }));
    await waitFor(() => expect(endChat).toHaveBeenCalledWith("u2"));
    await waitFor(() => expect(onChatEnded).toHaveBeenCalled());
  });
});
