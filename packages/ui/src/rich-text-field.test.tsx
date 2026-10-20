import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { RichTextField } from "./rich-text-field";
import { FormattedText } from "./formatted-text";

const Harness = ({
  initial = "",
  ...props
}: { initial?: string } & Partial<React.ComponentProps<typeof RichTextField>>) => {
  const [value, setValue] = useState(initial);
  return <RichTextField id="about" value={value} onChange={setValue} {...props} />;
};

const area = () => screen.getByRole("textbox") as HTMLTextAreaElement;

describe("RichTextField", () => {
  it("counts words as you type", () => {
    render(<Harness maxWords={500} />);

    fireEvent.change(area(), { target: { value: "three small words" } });

    expect(screen.getByText("3/500 words")).toBeInTheDocument();
  });

  it("bolds the selected text from the toolbar", () => {
    render(<Harness initial="make it loud" />);
    area().setSelectionRange(8, 12);

    fireEvent.click(screen.getByRole("button", { name: "Bold" }));

    expect(area().value).toBe("make it **loud**");
  });

  it("adds a link only for a safe address", () => {
    render(<Harness initial="visit us" />);
    area().setSelectionRange(6, 8);
    fireEvent.select(area());

    fireEvent.click(screen.getByRole("button", { name: "Link" }));
    fireEvent.change(screen.getByLabelText("Link address"), {
      target: { value: "javascript:alert(1)" },
    });
    expect(screen.getByRole("button", { name: "Add" })).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Link address"), {
      target: { value: "https://lemonade.test" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(area().value).toBe("visit [us](https://lemonade.test)");
  });
});

describe("RichTextField media", () => {
  it("only offers image and video buttons when an uploader is given", () => {
    const { unmount } = render(<Harness />);
    expect(screen.queryByRole("button", { name: "Add image" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add video" })).not.toBeInTheDocument();
    unmount();

    render(<Harness onUploadImage={vi.fn()} onUploadVideo={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Add image" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add video" })).toBeInTheDocument();
  });

  it("puts an uploaded image on its own line", async () => {
    const onUploadImage = vi.fn().mockResolvedValue("https://cdn.test/a.png");
    render(<Harness initial="Intro" onUploadImage={onUploadImage} />);

    fireEvent.change(screen.getByLabelText("Image file"), {
      target: { files: [new File(["x"], "a.png", { type: "image/png" })] },
    });

    await waitFor(() => expect(area().value).toBe("Intro\n![](https://cdn.test/a.png)"));
  });

  it("shows an error and keeps the text when an upload fails", async () => {
    const onUploadVideo = vi.fn().mockRejectedValue(new Error("nope"));
    render(<Harness initial="Intro" onUploadVideo={onUploadVideo} />);

    fireEvent.change(screen.getByLabelText("Video file"), {
      target: { files: [new File(["x"], "a.mp4", { type: "video/mp4" })] },
    });

    expect(await screen.findByText(/couldn't upload that video/i)).toBeInTheDocument();
    expect(area().value).toBe("Intro");
  });
});

describe("FormattedText", () => {
  it("renders formatting as elements and never as HTML", () => {
    render(<FormattedText text={"**Bold** and <script>x</script>\n- one\n- two"} />);

    expect(screen.getByText("Bold").tagName).toBe("STRONG");
    expect(screen.getByText("and <script>x</script>", { exact: false })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("opens links safely in a new tab", () => {
    render(<FormattedText text="[site](https://lemonade.test)" />);

    const link = screen.getByRole("link", { name: "site" });
    expect(link).toHaveAttribute("href", "https://lemonade.test");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("renders images and videos from media lines", () => {
    const { container } = render(
      <FormattedText text={"![a cat](https://x.test/cat.png)\n@video(https://x.test/v.mp4)"} />,
    );

    expect(screen.getByRole("img", { name: "a cat" })).toHaveAttribute(
      "src",
      "https://x.test/cat.png",
    );
    expect(container.querySelector("video")).toHaveAttribute("src", "https://x.test/v.mp4");
  });
});
