import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { InactivityGuard } from "./InactivityGuard";

const logout = vi.fn();
let timeoutMinutes = 3;

vi.mock("@/hooks/useAdminLogout", () => ({ useAdminLogout: () => logout }));
vi.mock("@/features/settings/queries", () => ({
  useAdminSettingsQuery: () => ({
    data: { platform: { inactivity_timeout_minutes: timeoutMinutes } },
  }),
}));

const renderGuard = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <InactivityGuard />
    </QueryClientProvider>,
  );

const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms));

describe("InactivityGuard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    logout.mockClear();
    timeoutMinutes = 3;
  });
  afterEach(() => vi.useRealTimers());

  it("stays quiet while the admin is active", () => {
    renderGuard();
    wait(2 * 60_000);
    fireEvent.mouseMove(window);
    wait(2 * 60_000);

    expect(screen.queryByText("Are you still there?")).not.toBeInTheDocument();
  });

  it("asks after the configured time without activity and lets the admin stay", () => {
    renderGuard();
    wait(3 * 60_000);

    expect(screen.getByRole("status")).toHaveTextContent("60 seconds");
    fireEvent.click(screen.getByRole("button", { name: "Stay signed in" }));
    expect(screen.queryByText("Are you still there?")).not.toBeInTheDocument();
    expect(logout).not.toHaveBeenCalled();
  });

  it("uses the timeout from settings", () => {
    timeoutMinutes = 10;
    renderGuard();
    wait(9 * 60_000);
    expect(screen.queryByRole("button", { name: "Stay signed in" })).not.toBeInTheDocument();

    wait(60_000);
    expect(screen.getByRole("button", { name: "Stay signed in" })).toBeInTheDocument();
  });

  it("logs out from the prompt", () => {
    renderGuard();
    wait(3 * 60_000);
    fireEvent.click(screen.getByRole("button", { name: "Log out" }));

    expect(logout).toHaveBeenCalledTimes(1);
  });

  it("logs out on its own when nobody answers", () => {
    renderGuard();
    wait(3 * 60_000);
    // The countdown re-renders each second, so step through it.
    for (let second = 0; second < 61; second += 1) wait(1000);

    expect(logout).toHaveBeenCalledTimes(1);
  });
});
