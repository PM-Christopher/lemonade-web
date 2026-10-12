import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import RequestCard from "./RequestCard";
import type { ChatInvite } from "@/features/connect/api";

// Vitest doesn't run .svg imports through SVGR.
vi.mock("@/images/icons/chevronRight.svg", () => ({
  default: () => <span data-testid="chevron-right-icon" />,
}));

const invite = (distance_km: number | null): ChatInvite => ({
  id: "invite-1",
  fullname: "Viewer",
  invitee: {
    lemon_id_short: "L42",
    lemon_id_full: "Lemon 42",
    username: "sender",
    industry: null,
    bio: null,
  },
  message: "Hello there",
  distance_km,
});

const renderCard = (distance_km: number | null) =>
  render(
    <RequestCard
      toggle={vi.fn()}
      toggleInviteIndex={vi.fn()}
      index={0}
      invite={invite(distance_km)}
    />,
  );

describe("RequestCard distance", () => {
  it("shows the server-computed distance", () => {
    renderCard(526);

    expect(screen.getByText("526 km away")).toBeInTheDocument();
  });

  it("hides the distance when the server has none", () => {
    renderCard(null);

    expect(screen.queryByText(/km away/)).not.toBeInTheDocument();
    expect(screen.getByText("Hello there")).toBeInTheDocument();
  });
});
