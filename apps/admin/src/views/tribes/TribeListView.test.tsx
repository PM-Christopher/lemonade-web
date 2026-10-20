import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TribeListView from "./TribeListView";

vi.mock("@/hooks/useNavigation", () => ({ useNavigation: () => ({ push: vi.fn() }) }));
vi.mock("react-redux", () => ({
  useSelector: (select: (state: unknown) => unknown) => select({ auth: { isLoggedIn: true } }),
}));

const tribe = (overrides: Record<string, unknown>) => ({
  id: "1",
  uuid: "FR1",
  name: "Tribe",
  image: null,
  category: "Business",
  created_by: "Someone",
  members: 3,
  date_created: "23 Apr, 2024",
  slug: "tribe",
  monetized: false,
  access_fee: "0.00",
  created_by_admin: false,
  ...overrides,
});

vi.mock("@/features/tribes/queries", () => ({
  useTribeListQuery: () => ({
    data: {
      tribes: [
        tribe({ id: "1", name: "Member tribe" }),
        tribe({ id: "2", name: "TLN tribe", created_by_admin: true }),
        tribe({ id: "3", name: "Paid tribe", monetized: true, access_fee: "5000.00" }),
      ],
    },
  }),
}));

describe("TribeListView", () => {
  it("lists only member-created tribes on the Created tab", () => {
    render(<TribeListView filter="created" />);

    expect(screen.getByText("Member tribe")).toBeInTheDocument();
    expect(screen.getByText("Paid tribe")).toBeInTheDocument();
    expect(screen.queryByText("TLN tribe")).not.toBeInTheDocument();
    expect(screen.queryByText("ACCESS FEE")).not.toBeInTheDocument();
  });

  it("lists only admin-created tribes on the TLN tab", () => {
    render(<TribeListView filter="tln" />);

    expect(screen.getByText("TLN tribe")).toBeInTheDocument();
    expect(screen.queryByText("Member tribe")).not.toBeInTheDocument();
  });

  it("lists paid tribes with their access fee on the Paid tab", () => {
    render(<TribeListView filter="paid" />);

    expect(screen.getByText("ACCESS FEE")).toBeInTheDocument();
    expect(screen.getByText("Paid tribe")).toBeInTheDocument();
    expect(screen.getByText("₦5,000")).toBeInTheDocument();
    expect(screen.queryByText("Member tribe")).not.toBeInTheDocument();
  });
});
