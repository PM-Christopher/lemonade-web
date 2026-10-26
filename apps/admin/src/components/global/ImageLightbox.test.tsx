import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ImageLightbox } from "./ImageLightbox";

describe("ImageLightbox", () => {
  it("shows nothing without a picture", () => {
    render(<ImageLightbox src={null} alt="Logo" onClose={vi.fn()} />);

    expect(screen.queryByAltText("Logo")).toBeNull();
  });

  it("shows the picture larger and closes from the close button", () => {
    const onClose = vi.fn();
    render(<ImageLightbox src="https://cdn.test/a.png" alt="Volta Malt" onClose={onClose} />);

    expect(screen.getByAltText("Volta Malt")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Close image preview"));
    expect(onClose).toHaveBeenCalled();
  });
});
