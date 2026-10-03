import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AffiliateProgramDetailsClient from "./AffiliateProgramDetailsClient";
import type { EventAffiliateDetailResponse } from "@/features/events/api";

vi.mock("@/components/layouts/MainLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("react-redux", () => ({
  useSelector: () => ({ isLoggedIn: true }),
}));

const queryMock = vi.fn();

vi.mock("@/features/events/queries", () => ({
  useEventAffiliateDetailQuery: (...args: unknown[]) => queryMock(...args),
}));

function mockDetail(
  overrides: Partial<EventAffiliateDetailResponse> = {},
): EventAffiliateDetailResponse {
  return {
    affiliate: {
      id: 1,
      unique_id: "AF112332",
      name: "Adebayo Akintoye",
      image: null,
      date_joined: "2026-04-24T21:45:00Z",
      programs: 1,
      tickets_sold: 7,
      total_revenue: 350000,
      account: {
        account_name: "Funmilayo Johnson",
        bank_name: "GTB",
        account_number: "0923432934",
      },
    },
    programs: [
      {
        event_name: "Halloween Party",
        start_date: "2026-03-23T16:00:00Z",
        location: "Lekki phase 1",
        affiliate_link: "event/abc?referral=xyz",
        isAffiliate: true,
        commissions: [],
        ticket_sold: [
          {
            name: "Regular",
            count: 7,
            stock: 20,
            price: 50000,
            stock_type: "limited",
            percentage_sold: 35,
          },
        ],
        breakdown: { total_commissions: 350000, ticket_sold: 7 },
      },
    ],
    ...overrides,
  };
}

describe("AffiliateProgramDetailsClient", () => {
  it("renders real affiliate totals and program data, not placeholder mock values", () => {
    queryMock.mockReturnValue({ data: mockDetail() });

    render(<AffiliateProgramDetailsClient id="affiliate-1" />);

    expect(screen.getByText("Adebayo Akintoye")).toBeInTheDocument();
    expect(screen.getByText("AF112332")).toBeInTheDocument();
    expect(screen.getAllByText("7").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/350,000/).length).toBeGreaterThan(0);
    expect(screen.getByText("Halloween Party")).toBeInTheDocument();
    expect(screen.getByText("Lekki phase 1")).toBeInTheDocument();
    // The old static placeholder always rendered three "Free Tickets" rows
    // with a fixed "30 sold" regardless of real data — guard against that.
    expect(screen.queryByText("Free Tickets")).not.toBeInTheDocument();
    expect(screen.queryByText("30")).not.toBeInTheDocument();
  });

  it("shows a real empty state instead of inventing program data when there are none", () => {
    queryMock.mockReturnValue({ data: mockDetail({ programs: [] }) });

    render(<AffiliateProgramDetailsClient id="affiliate-1" />);

    expect(screen.getByText(/no event programs yet/i)).toBeInTheDocument();
  });

  it("shows a fallback when the affiliate has no bank account on file", () => {
    queryMock.mockReturnValue({
      data: mockDetail({
        affiliate: { ...mockDetail().affiliate, account: null },
      }),
    });

    render(<AffiliateProgramDetailsClient id="affiliate-1" />);

    expect(screen.getByText(/no bank account on file/i)).toBeInTheDocument();
  });
});
