import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { usePusher } from "./usePusher";

const handlers = vi.hoisted(() => ({ current: undefined as undefined | (() => void) }));
vi.mock("@/config/pusherConfig", () => ({
  disconnectAuthenticatedPusher: vi.fn(),
  pusherCon: vi.fn(),
  pusherConfig: () => ({
    subscribe: () => ({
      bind: (_event: string, handler: () => void) => {
        handlers.current = handler;
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

describe("usePusher notifications channel", () => {
  it("refetches the notification list when the server pings", () => {
    const queryClient = new QueryClient();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    renderHook(() => usePusher("notifications.u1", "notification.received"), { wrapper });
    handlers.current?.();

    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["notifications"] });
  });
});
