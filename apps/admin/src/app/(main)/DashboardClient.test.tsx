import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import DashboardClient from "./DashboardClient";

const push = vi.fn();

vi.mock("react-redux", () => ({
  useSelector: (select: (state: unknown) => unknown) => select({ auth: { isLoggedIn: true } }),
}));
vi.mock("@/hooks/useNavigation", () => ({ useNavigation: () => ({ push }) }));
vi.mock("@/components/global/DateRangePicker", () => ({ default: () => null }));
vi.mock("@/features/dashboard/queries", () => ({
  useDashboardMetricsQuery: () => ({
    data: { total_users: 1234567, pending_withdrawals: 4, open_disputes: 2 },
  }),
}));

const card = (title: string) =>
  screen.getByText(title).closest(".shadow-card-shadow") as HTMLElement;

describe("DashboardClient", () => {
  it("shows 24 cards with thousands separators", () => {
    const { container } = render(<DashboardClient />);

    expect(container.querySelectorAll(".shadow-card-shadow")).toHaveLength(24);
    expect(screen.getByText("1,234,567")).toBeInTheDocument();
  });

  it("links the withdrawals and disputes cards to their pages", () => {
    render(<DashboardClient />);

    fireEvent.click(within(card("Pending Withdrawals")).getByText("View"));
    fireEvent.click(within(card("Open Disputes")).getByText("View"));

    expect(push).toHaveBeenCalledWith("/wallet-management");
    expect(push).toHaveBeenCalledWith("/disputes");
  });
});
