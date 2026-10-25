import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const branding = vi.hoisted(() => ({ data: undefined as unknown }));

vi.mock("@/features/settings/queries", () => ({ useBrandingQuery: () => branding }));
vi.mock("@/lib/image-src", () => ({ getSafeImageSrc: (src?: string | null) => src ?? "" }));
vi.mock("next/image", () => ({
  default: ({ src, alt, onError }: { src: string; alt: string; onError?: () => void }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} onError={onError} />
  ),
}));

const { BrandLogo } = await import("./BrandLogo");

describe("BrandLogo", () => {
  beforeEach(() => {
    branding.data = undefined;
  });

  it("shows the built-in logo when no logo is set", () => {
    branding.data = { platform_name: "Lemonade", logo_url: null };
    render(<BrandLogo />);

    expect(screen.getByRole("img")).toHaveAttribute("src", "/images/logo.png");
  });

  it("shows the saved logo", () => {
    branding.data = { platform_name: "Lemonade", logo_url: "https://cdn.example.com/a.png" };
    render(<BrandLogo />);

    expect(screen.getByRole("img")).toHaveAttribute("src", "https://cdn.example.com/a.png");
  });

  it("falls back to the built-in logo when the saved one fails to load", () => {
    branding.data = { platform_name: "Lemonade", logo_url: "https://cdn.example.com/broken.png" };
    render(<BrandLogo />);

    fireEvent.error(screen.getByRole("img"));

    expect(screen.getByRole("img")).toHaveAttribute("src", "/images/logo.png");
  });
});
