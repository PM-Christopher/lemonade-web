import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { usePusher } from "./usePusher";
import { clearTyping } from "@/features/connect/typing";
import * as typing from "@/features/connect/typing";

// Handlers the hook binds, by event name.
const handlers = vi.hoisted(() => ({ byEvent: {} as Record<string, (data?: unknown) => void> }));
vi.mock("@/config/pusherConfig", () => ({
  disconnectAuthenticatedPusher: vi.fn(),
  pusherCon: vi.fn(),
  pusherConfig: () => ({
    subscribe: () => ({
      bind: (event: string, handler: (data?: unknown) => void) => {
        handlers.byEvent[event] = handler;
      },
      unbind: vi.fn(),
    }),
    unsubscribe: vi.fn(),
  }),
}));
vi.mock("@/redux/hook", () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: () => ({ user: { id: "u1" } }),
}));

const setup = (channel: string, event: string) => {
  const queryClient = new QueryClient();
  const invalidate = vi.spyOn(queryClient, "invalidateQueries");
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  renderHook(() => usePusher(channel, event), { wrapper });
  return { queryClient, invalidate };
};

describe("usePusher", () => {
  beforeEach(() => {
    handlers.byEvent = {};
    clearTyping("u2");
  });

  it("refetches the notification list when the server pings", () => {
    const { invalidate } = setup("notifications.u1", "notification.received");

    handlers.byEvent["notification.received"]();

    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["notifications"] });
  });

  it("also refreshes any open chat on a ping, so a missed chat event cannot leave it stale", () => {
    const { invalidate } = setup("notifications.u1", "notification.received");

    handlers.byEvent["notification.received"]();

    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["connect", "chat"] });
  });

  it("marks the sender as typing when a typing event arrives on my chat channel", () => {
    const mark = vi.spyOn(typing, "markTyping");
    setup("chat.u1", "message.sent");

    handlers.byEvent["typing"]({ typing: true, from: "u2" });

    expect(mark).toHaveBeenCalledWith("u2");
  });

  it("listens for typing and edits only on my own chat channel", () => {
    setup("notifications.u1", "notification.received");

    expect(handlers.byEvent["typing"]).toBeUndefined();
    expect(handlers.byEvent["message.edited"]).toBeUndefined();
  });

  it("stops the typing mark when that person's message arrives", () => {
    const clear = vi.spyOn(typing, "clearTyping");
    setup("chat.u1", "message.sent");

    handlers.byEvent["message.sent"]({
      message: {
        id: "m1",
        message: "hi",
        sender: "u2",
        receiver: "u1",
        media: null,
        created_at: "now",
      },
    });

    expect(clear).toHaveBeenCalledWith("u2");
  });
});
