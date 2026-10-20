import { describe, expect, it } from "vitest";
import {
  applyFormat,
  countWords,
  insertMedia,
  isSafeUrl,
  parseBlocks,
  parseInline,
} from "./richText";

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

  it("underlines the selection", () => {
    expect(applyFormat("mark this", 5, 9, "underline").text).toBe("mark ++this++");
  });

  it("indents and outdents every selected line, up to three levels", () => {
    expect(applyFormat("a\nb", 0, 3, "indent").text).toBe("  a\n  b");
    expect(applyFormat("  a\n  b", 0, 7, "outdent").text).toBe("a\nb");
    expect(applyFormat("      deep", 0, 10, "indent").text).toBe("      deep");
  });

  it("inserts a link around the selection", () => {
    expect(applyFormat("visit us", 6, 8, "link", "https://lemonade.test").text).toBe(
      "visit [us](https://lemonade.test)",
    );
  });
});

describe("parseInline", () => {
  it("splits bold, italic and links out of a line", () => {
    expect(parseInline("a **b** ++u++ *c* [d](https://x.test)")).toEqual([
      { type: "text", value: "a " },
      { type: "bold", value: "b" },
      { type: "text", value: " " },
      { type: "underline", value: "u" },
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
    expect(parseBlocks("intro\n- a\n  - b\n1. c")).toEqual([
      { type: "paragraph", line: { text: "intro", indent: 0 } },
      {
        type: "bullets",
        items: [
          { text: "a", indent: 0 },
          { text: "b", indent: 1 },
        ],
      },
      { type: "numbers", items: [{ text: "c", indent: 0 }] },
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

describe("media lines", () => {
  it("reads whole-line images and videos as their own blocks", () => {
    expect(
      parseBlocks("intro\n![cat](https://x.test/cat.png)\n@video(https://x.test/v.mp4)"),
    ).toEqual([
      { type: "paragraph", line: { text: "intro", indent: 0 } },
      { type: "image", url: "https://x.test/cat.png", alt: "cat" },
      { type: "video", url: "https://x.test/v.mp4" },
    ]);
  });

  it("does not treat unsafe addresses as media", () => {
    expect(parseBlocks("![x](javascript:alert(1))")).toEqual([
      { type: "paragraph", line: { text: "![x](javascript:alert(1))", indent: 0 } },
    ]);
  });

  it("inserts media on its own line at the caret", () => {
    expect(insertMedia("hello", 5, "image", "https://x.test/a.png").text).toBe(
      "hello\n![](https://x.test/a.png)",
    );
    expect(insertMedia("a\nb", 2, "video", "https://x.test/v.mp4").text).toBe(
      "a\n@video(https://x.test/v.mp4)\nb",
    );
  });
});

describe("edge cases", () => {
  it("italicises and bullets a selection", () => {
    expect(applyFormat("hi", 0, 2, "italic").text).toBe("*hi*");
    expect(applyFormat("hi", 0, 2, "bullets").text).toBe("- hi");
  });

  it("uses the address as the link text when nothing is selected", () => {
    expect(applyFormat("", 0, 0, "link", "https://a.co").text).toBe("[https://a.co](https://a.co)");
  });

  it("takes the first selected line when outdenting an unindented one", () => {
    expect(applyFormat("  a\nb", 0, 5, "outdent").text).toBe("a\nb");
  });

  it("keeps image alt text and skips blank lines", () => {
    expect(parseBlocks("![pic](https://a.co/x.png)\n\n")).toEqual([
      { type: "image", url: "https://a.co/x.png", alt: "pic" },
    ]);
  });

  it("starts a new list when the kind changes", () => {
    const blocks = parseBlocks("- a\n1. b");
    expect(blocks.map((b) => b.type)).toEqual(["bullets", "numbers"]);
  });

  it("inserts media at the start and the end of the text", () => {
    expect(insertMedia("", 0, "image", "https://a.co/x.png").text).toBe("![](https://a.co/x.png)");
    expect(insertMedia("a\n", 2, "video", "https://a.co/v.mp4").text).toBe(
      "a\n@video(https://a.co/v.mp4)",
    );
  });
});
