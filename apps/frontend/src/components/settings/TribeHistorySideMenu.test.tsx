import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TribeHistorySideMenu from "./TribeHistorySideMenu";

vi.mock("@/images/icons/close.svg", () => ({ default: () => <span /> }));

const queryMock = vi.fn();
vi.mock("@/features/settings/queries", () => ({
  useTribeHistoryQuery: (...args: unknown[]) => queryMock(...args),
}));

describe("TribeHistorySideMenu", () => {
  it("names the paying member and the tribe on each entry", () => {
    queryMock.mockReturnValue({
      data: {
        tribe_history: [
          {
            amount_minor: 450000,
            amount: "4500.00",
            title: "Paid tribe join: Structural masters",
            member: "christjoe",
            tribe_name: "Structural masters",
            created: "2023-03-23T17:00:00Z",
          },
        ],
      },
    });

    render(<TribeHistorySideMenu isOpen toggleMenu={vi.fn()} />);

    expect(screen.getByText("₦4,500 - @christjoe (Structural masters)")).toBeInTheDocument();
    expect(screen.getByText(/^23, Mar 2023\./)).toBeInTheDocument();
  });

  it("only asks for the history once the panel is open", () => {
    queryMock.mockReturnValue({ data: { tribe_history: [] } });

    render(<TribeHistorySideMenu isOpen={false} toggleMenu={vi.fn()} />);

    expect(queryMock).toHaveBeenCalledWith({ enabled: false });
    expect(screen.getByText("No tribe earnings yet.")).toBeInTheDocument();
  });
});
