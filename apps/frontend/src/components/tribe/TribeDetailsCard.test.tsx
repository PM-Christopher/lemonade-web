import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { TribeInterface } from "@/interfaces/TribeInterface";

vi.mock("@/images/icons/dot.svg", () => ({ default: () => <svg /> }));
vi.mock("@/images/icons/share.svg", () => ({ default: () => <svg /> }));
vi.mock("@/images/icons/addUserIcon.svg", () => ({ default: () => <svg /> }));
vi.mock("@/images/icons/edit.svg", () => ({ default: () => <svg /> }));
vi.mock("@/images/icons/delete.svg", () => ({ default: () => <svg /> }));
vi.mock("@/components/global/FallbackImage", () => ({
  FallbackImage: ({ alt }: { alt: string }) => <span>{alt}</span>,
}));

const { default: TribeDetailsCard } = await import("./TribeDetailsCard");

const tribe = {
  tribe_name: "Start-ups",
  category: "Business",
  description: "x".repeat(150),
  members: 53,
  owner: true,
  private: false,
  has_joined: true,
  monetized: 0,
  created_by: "Christine",
  created_at: "2024-03-23T00:00:00Z",
  member_list: [],
} as unknown as TribeInterface;

const renderCard = (overrides: Partial<TribeInterface> = {}, togglePrivate = vi.fn()) =>
  render(
    <TribeDetailsCard
      toggle={vi.fn()}
      toggleJoin={vi.fn()}
      share={vi.fn()}
      toggleAddMember={vi.fn()}
      tribe={{ ...tribe, ...overrides }}
      threads={[]}
      loading={false}
      togglePrivate={togglePrivate}
      isUpdatingPrivacy={false}
    />,
  );

describe("TribeDetailsCard", () => {
  it("shows the member count", () => {
    renderCard();

    expect(screen.getByText("53 members")).toBeInTheDocument();
  });

  it("says 'You' for the owner and the creator's name for everyone else", () => {
    const { unmount } = renderCard();
    expect(screen.getByText("You")).toBeInTheDocument();
    unmount();

    renderCard({ owner: false });
    expect(screen.getByText("Christine")).toBeInTheDocument();
  });

  it("lets the owner flip the private switch, and hides it from members", () => {
    const togglePrivate = vi.fn();
    const { unmount } = renderCard({}, togglePrivate);

    fireEvent.click(screen.getByRole("switch", { name: "Private tribe" }));
    expect(togglePrivate).toHaveBeenCalled();
    unmount();

    renderCard({ owner: false });
    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
  });

  it("cuts a long description at 100 characters until See more is clicked", () => {
    renderCard();

    expect(screen.queryByText(/x{101}/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "See more" }));
    expect(screen.getByText(/x{150}/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "See less" })).toBeInTheDocument();
  });
});
