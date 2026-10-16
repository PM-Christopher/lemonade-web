import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ImageLightbox } from "./ImageLightbox";

describe("ImageLightbox", () => {
  it("shows nothing without an image", () => {
    render(<ImageLightbox src={null} onClose={vi.fn()} />);
    expect(screen.queryByAltText("Chat image")).toBeNull();
  });

  it("shows the image and closes from the close button", () => {
    const onClose = vi.fn();
    render(
      <ImageLightbox src="https://res.cloudinary.com/demo/image/upload/a.jpg" onClose={onClose} />,
    );

    expect(screen.getByAltText("Chat image")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Close image preview"));
    expect(onClose).toHaveBeenCalled();
  });
});
