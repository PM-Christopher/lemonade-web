import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import AffiliateLinkModal from "./AffiliateLinkModal";

vi.mock("@/images/icons/close.svg", () => ({
  default: () => <svg aria-hidden="true" />,
}));
vi.mock("@/images/icons/strikeLine.svg", () => ({
  default: () => <svg aria-hidden="true" />,
}));
vi.mock("@/images/icons/copyIcon.svg", () => ({
  default: () => <svg aria-hidden="true" />,
}));

describe("AffiliateLinkModal", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://app.example.com");
    vi.stubEnv("NEXT_PUBLIC_BASE_URL", "https://api.example.com");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("shows and copies the full app link, not the API link", () => {
    const writeText = vi.fn();
    Object.assign(navigator, { clipboard: { writeText } });

    render(<AffiliateLinkModal isOpen toggle={() => {}} item="ref/abc123" />);

    expect(screen.getByText("https://app.example.com/ref/abc123")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Copy affiliate link" }));
    expect(writeText).toHaveBeenCalledWith("https://app.example.com/ref/abc123");
  });
});
