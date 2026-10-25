import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HtmlEditor } from "./HtmlEditor";

function Harness({ initial = "" }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return <HtmlEditor id="x" label="Body" value={value} onChange={setValue} />;
}

describe("HtmlEditor", () => {
  it("wraps the selected text with the chosen formatting", () => {
    render(<Harness initial="Hello world" />);
    const box = screen.getByLabelText("Body") as HTMLTextAreaElement;
    box.setSelectionRange(0, 5);

    fireEvent.click(screen.getByRole("button", { name: "Bold" }));

    expect(box.value).toBe("<strong>Hello</strong> world");
  });

  it("previews only safe markup", () => {
    render(<Harness initial={"<p>Hi</p><script>alert(1)</script><img src=x onerror=alert(1)>"} />);

    fireEvent.click(screen.getByRole("button", { name: "preview" }));

    const preview = screen.getByLabelText("Body preview");
    expect(preview.querySelector("p")?.textContent).toBe("Hi");
    expect(preview.querySelector("script")).toBeNull();
    expect(preview.querySelector("img")).toBeNull();
  });
});
