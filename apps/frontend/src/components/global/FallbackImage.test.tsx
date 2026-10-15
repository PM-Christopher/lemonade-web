import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { FallbackImage } from "./FallbackImage";

const FALLBACK = "/images/tribe_1.png";

const renderImage = (src?: string | null) =>
  render(<FallbackImage src={src} fallbackSrc={FALLBACK} alt="tribe" width={40} height={40} />);

const srcOf = () => decodeURIComponent(screen.getByAltText("tribe").getAttribute("src") ?? "");

describe("FallbackImage", () => {
  it("shows the image it was given", () => {
    renderImage("/images/avatar_1.png");

    expect(srcOf()).toContain("/images/avatar_1.png");
  });

  it("uses the fallback for a remote host that next/image does not allow", () => {
    renderImage("https://example.com/photo.png");

    expect(srcOf()).toContain(FALLBACK);
  });

  it("uses the fallback when there is no src", () => {
    renderImage(null);

    expect(srcOf()).toContain(FALLBACK);
  });

  it("swaps to the fallback when the image fails to load", () => {
    renderImage("/images/missing.png");

    fireEvent.error(screen.getByAltText("tribe"));

    expect(srcOf()).toContain(FALLBACK);
  });
});
