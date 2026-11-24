import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useSupportRealtime } from "./useSupportRealtime";
import { userKeys } from "./queries";
import { clearTyping } from "@/lib/typing";
import * as typing from "@/lib/typing";

const bound = vi.hoisted(() => ({ byEvent: {} as Record<string, (data?: unknown) => void> }));
const subscribe = vi.hoisted(() => vi.fn());
const unsubscribe = vi.hoisted(() => vi.fn());
vi.mock("@/config/pusherConfig", () => ({
  pusherConfig: () => ({
    subscribe: (name: string) => {
      subscribe(name);
      return {
        bind: (event: string, handler: (data?: unknown) => void) => {
          bound.byEvent[event] = handler;
        },
        unbind: vi.fn(),
      };
    },
    unsubscribe,
  }),
}));

const setup = (userId: string | undefined) => {
  const queryClient = new QueryClient();
  const invalidate = vi.spyOn(queryClient, "invalidateQueries");
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const view = renderHook(() => useSupportRealtime(userId), { wrapper });
  return { invalidate, view };
};

describe("useSupportRealtime (admin)", () => {
  beforeEach(() => {
    bound.byEvent = {};
    subscribe.mockReset();
    unsubscribe.mockReset();
    clearTyping("support");
  });

  it("listens on this user's support thread channel and leaves it on unmount", () => {
    const { view } = setup("u1");

    expect(subscribe).toHaveBeenCalledWith("private-support.thread.u1");

    view.unmount();
    expect(unsubscribe).toHaveBeenCalledWith("private-support.thread.u1");
  });

  it("does nothing without a user", () => {
    setup(undefined);

    expect(subscribe).not.toHaveBeenCalled();
  });

  it("refreshes the thread when a message arrives or is edited", () => {
    const { invalidate } = setup("u1");

    act(() => bound.byEvent["message.sent"]());
    act(() => bound.byEvent["message.edited"]());

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: [...userKeys.all(), "support-chat", "u1"],
    });
  });

  it("marks the user as typing only when the user side is typing", () => {
    setup("u1");
    const mark = vi.spyOn(typing, "markTyping");

    act(() => bound.byEvent["typing"]({ typing: true, from: "admin" }));
    expect(mark).not.toHaveBeenCalled();

    act(() => bound.byEvent["typing"]({ typing: true, from: "user" }));
    expect(mark).toHaveBeenCalledWith("support");
  });
});
