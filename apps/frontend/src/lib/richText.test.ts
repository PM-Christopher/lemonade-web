import { describe, expect, it } from "vitest";
import { applyFormat, countWords, isSafeUrl, parseBlocks, parseInline } from "./richText";

describe("applyFormat", () => {
  it("wraps the selection in bold and unwraps it again", () => {
    const bold = applyFormat("make it loud", 8, 12, "bold");
    expect(bold.text).toBe("make it **loud**");

    const plain = applyFormat(bold.text, bold.start, bold.end, "bold");
    expect(plain.text).toBe("make it loud");
  });

  it("numbers every selected line and removes the numbers when toggled", () => {
    const numbered = applyFormat("one\ntwo", 0, 7, "numbers");
    expect(numbered.text).toBe("1. one\n2. two");

    expect(applyFormat(numbered.text, 0, numbered.text.length, "numbers").text).toBe("one\ntwo");
  });

  it("switches a bullet line to a numbered line", () => {
    expect(applyFormat("- one", 0, 5, "numbers").text).toBe("1. one");
  });

  it("inserts a link around the selection", () => {
    expect(applyFormat("visit us", 6, 8, "link", "https://lemonade.test").text).toBe(
      "visit [us](https://lemonade.test)",
    );
  });
});

describe("parseInline", () => {
  it("splits bold, italic and links out of a line", () => {
    expect(parseInline("a **b** *c* [d](https://x.test)")).toEqual([
      { type: "text", value: "a " },
      { type: "bold", value: "b" },
      { type: "text", value: " " },
      { type: "italic", value: "c" },
      { type: "text", value: " " },
      { type: "link", value: "d", href: "https://x.test" },
    ]);
  });

  it("leaves non-http links as plain text", () => {
    expect(parseInline("[x](javascript:alert(1))")).toEqual([
      { type: "text", value: "[x](javascript:alert(1))" },
    ]);
  });
});

describe("parseBlocks", () => {
  it("groups consecutive list lines and keeps paragraphs apart", () => {
    expect(parseBlocks("intro\n- a\n- b\n1. c")).toEqual([
      { type: "paragraph", line: "intro" },
      { type: "bullets", items: ["a", "b"] },
      { type: "numbers", items: ["c"] },
    ]);
  });
});

describe("helpers", () => {
  it("counts words and checks link safety", () => {
    expect(countWords("  one two\nthree ")).toBe(3);
    expect(countWords("")).toBe(0);
    expect(isSafeUrl("https://a.test")).toBe(true);
    expect(isSafeUrl("javascript:alert(1)")).toBe(false);
  });
});
