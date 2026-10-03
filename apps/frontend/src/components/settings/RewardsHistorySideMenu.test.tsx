import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import RewardsHistorySideMenu from "./RewardsHistorySideMenu";

// This app's Vitest config doesn't run .svg imports through SVGR (only the real Next.js build
// does), so a raw icon import fails to parse as a component here — same gap any .svg-importing
// component test would hit first in this app.
vi.mock("@/images/icons/close.svg", () => ({
  default: () => <span data-testid="close-icon" />,
}));

const queryMock = vi.fn();

vi.mock("@/features/settings/queries", () => ({
  useRewardsHistoryQuery: (...args: unknown[]) => queryMock(...args),
}));

describe("RewardsHistorySideMenu", () => {
  it("renders real reward history entries, not placeholder data", () => {
    queryMock.mockReturnValue({
      data: {
        affiliate_history: [
          { amount_minor: 150000, amount: "1500.00", created_at: "2026-09-01T10:00:00Z" },
          { amount_minor: 50000, amount: "500.00", created_at: "2026-08-15T10:00:00Z" },
        ],
      },
    });

    render(<RewardsHistorySideMenu isOpen={true} toggleMenu={vi.fn()} />);

    expect(screen.getByText("N1,500")).toBeInTheDocument();
    expect(screen.getByText("N500")).toBeInTheDocument();
    expect(screen.queryByText(/no rewards earned yet/i)).not.toBeInTheDocument();
  });

  it("shows a real empty state instead of fake rows when nothing has been earned", () => {
    queryMock.mockReturnValue({ data: { affiliate_history: [] } });

    render(<RewardsHistorySideMenu isOpen={true} toggleMenu={vi.fn()} />);

    expect(screen.getByText(/no rewards earned yet/i)).toBeInTheDocument();
  });
});
