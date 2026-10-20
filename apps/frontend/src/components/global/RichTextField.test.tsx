import { useState } from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { RichTextField } from "./RichTextField";
import { FormattedText } from "./FormattedText";

const Harness = ({ initial = "" }: { initial?: string }) => {
  const [value, setValue] = useState(initial);
  return <RichTextField id="about" value={value} onChange={setValue} />;
};

const area = () => screen.getByRole("textbox") as HTMLTextAreaElement;

describe("RichTextField", () => {
  it("counts words as you type", () => {
    render(<Harness />);

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
});
