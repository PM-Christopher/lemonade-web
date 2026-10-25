import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const branding = vi.hoisted(() => ({ data: undefined as unknown }));
vi.mock("@/features/branding/queries", () => ({ useBrandingQuery: () => branding }));

const { DeletionGracePeriod } = await import("./DeletionGracePeriod");

describe("DeletionGracePeriod", () => {
  it("shows 30 days until the setting loads", () => {
    branding.data = undefined;
    render(<DeletionGracePeriod />);

    expect(screen.getByText("30-day")).toBeInTheDocument();
  });

  it("shows the grace period set by admins", () => {
    branding.data = { account_deletion_grace_days: 14 };
    render(<DeletionGracePeriod />);

    expect(screen.getByText("14-day")).toBeInTheDocument();
    expect(screen.getByText(/within 14 days of deletion/)).toBeInTheDocument();
  });
});
