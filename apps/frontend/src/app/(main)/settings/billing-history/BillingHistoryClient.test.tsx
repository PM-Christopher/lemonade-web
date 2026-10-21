import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import BillingHistoryClient from "./BillingHistoryClient";

vi.mock("@/hooks/useNavigation", () => ({
  useNavigation: () => ({ push: vi.fn(), back: vi.fn() }),
}));
vi.mock("react-redux", () => ({
  useSelector: (select: (state: unknown) => unknown) =>
    select({ auth: { subscription: { plan_price: "5000 NGN/month" } } }),
}));
vi.mock("@/components/layouts/MainLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));
vi.mock("@/features/authentication/queries", () => ({
  useBillingHistoryQuery: () => ({
    isLoading: false,
    data: {
      plan: {
        title: "Premium",
        plan_price: "5000.00/month",
        plan_price_amount: "5000.00",
        plan_price_minor: 500000,
        billing_cycle: "month",
        next_billing_date: "November 21, 2026",
      },
      histories: [
        { title: "Premium", amount: "5000.00", amount_minor: 500000, created_at: "21 Oct, 2026" },
      ],
    },
  }),
}));

describe("BillingHistoryClient", () => {
  it("shows a ₦5,000 payment as ₦5,000, not in kobo", () => {
    render(<BillingHistoryClient />);

    expect(screen.getByText("₦5,000/month")).toBeTruthy();
    expect(screen.getByText("₦5,000")).toBeTruthy();
    expect(screen.queryByText(/500,000/)).toBeNull();
  });
});
