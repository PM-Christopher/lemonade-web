// Plain-text rich text: **bold**, *italic*, ++underline++, [text](https://link), "- " bullets,
// "1. " numbers, two-space indents, and whole-line media: ![alt](https://image) and
// @video(https://video). Stored as text and rendered by FormattedText, never as HTML.

export const MAX_DESCRIPTION_WORDS = 500;

export type FormatKind =
  "bold" | "italic" | "underline" | "bullets" | "numbers" | "link" | "indent" | "outdent";

export const MAX_INDENT = 3;

export interface Edit {
  text: string;
  start: number;
  end: number;
}

export const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

// Only http(s) links are kept.
export const isSafeUrl = (url: string) => /^https?:\/\/[^\s)]+$/i.test(url);

const wrap = (text: string, start: number, end: number, mark: string): Edit => {
  const selected = text.slice(start, end);
  const wrapped =
    text.slice(start - mark.length, start) === mark && text.slice(end, end + mark.length) === mark;

  if (wrapped) {
    return {
      text: text.slice(0, start - mark.length) + selected + text.slice(end + mark.length),
      start: start - mark.length,
      end: end - mark.length,
    };
  }
  return {
    text: text.slice(0, start) + mark + selected + mark + text.slice(end),
    start: start + mark.length,
    end: end + mark.length,
  };
};

const lineRange = (text: string, start: number, end: number) => {
  const lineStart = text.lastIndexOf("\n", start - 1) + 1;
  const newline = text.indexOf("\n", end);
  return { lineStart, lineEnd: newline === -1 ? text.length : newline };
};

// Adds or removes one two-space indent level on every selected line.
const shiftLines = (text: string, start: number, end: number, deeper: boolean): Edit => {
  const { lineStart, lineEnd } = lineRange(text, start, end);
  const next = text
    .slice(lineStart, lineEnd)
    .split("\n")
    .map((line) => {
      const level = Math.floor((line.length - line.trimStart().length) / 2);
      if (deeper) return level >= MAX_INDENT ? line : `  ${line}`;
      return line.startsWith("  ") ? line.slice(2) : line.trimStart();
    })
    .join("\n");

  return {
    text: text.slice(0, lineStart) + next + text.slice(lineEnd),
    start: lineStart,
    end: lineStart + next.length,
  };
};

// Prefixes every selected line, or removes the prefix when they all have it.
const prefixLines = (text: string, start: number, end: number, numbered: boolean): Edit => {
  const { lineStart, lineEnd } = lineRange(text, start, end);
  const lines = text.slice(lineStart, lineEnd).split("\n");
  const marker = (index: number) => (numbered ? `${index + 1}. ` : "- ");
  const pattern = numbered ? /^\d+\. / : /^- /;
  const allPrefixed = lines.every((line) => pattern.test(line));

  const next = lines
    .map((line, index) =>
      allPrefixed ? line.replace(pattern, "") : marker(index) + line.replace(/^(- |\d+\. )/, ""),
    )
    .join("\n");

  return {
    text: text.slice(0, lineStart) + next + text.slice(lineEnd),
    start: lineStart,
    end: lineStart + next.length,
  };
};

export function applyFormat(
  text: string,
  start: number,
  end: number,
  kind: FormatKind,
  url = "",
): Edit {
  switch (kind) {
    case "bold":
      return wrap(text, start, end, "**");
    case "italic":
      return wrap(text, start, end, "*");
    case "underline":
      return wrap(text, start, end, "++");
    case "indent":
      return shiftLines(text, start, end, true);
    case "outdent":
      return shiftLines(text, start, end, false);
    case "bullets":
      return prefixLines(text, start, end, false);
    case "numbers":
      return prefixLines(text, start, end, true);
    case "link": {
      const label = text.slice(start, end) || url;
      const link = `[${label}](${url})`;
      return {
        text: text.slice(0, start) + link + text.slice(end),
        start: start + link.length,
        end: start + link.length,
      };
    }
  }
}

export type InlinePart =
  | { type: "text"; value: string }
  | { type: "bold" | "italic" | "underline"; value: string }
  | { type: "link"; value: string; href: string };

const INLINE = /\*\*(.+?)\*\*|\+\+(.+?)\+\+|\*(.+?)\*|\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g;

export function parseInline(line: string): InlinePart[] {
  const parts: InlinePart[] = [];
  let last = 0;

  for (const match of line.matchAll(INLINE)) {
    if (match.index > last) parts.push({ type: "text", value: line.slice(last, match.index) });
    if (match[1] !== undefined) parts.push({ type: "bold", value: match[1] });
    else if (match[2] !== undefined) parts.push({ type: "underline", value: match[2] });
    else if (match[3] !== undefined) parts.push({ type: "italic", value: match[3] });
    else parts.push({ type: "link", value: match[4] ?? "", href: match[5] ?? "" });
    last = match.index + match[0].length;
  }
  if (last < line.length) parts.push({ type: "text", value: line.slice(last) });
  return parts;
}

export interface Line {
  text: string;
  indent: number;
}

export type Block =
  | { type: "image"; url: string; alt: string }
  | { type: "video"; url: string }
  | { type: "paragraph"; line: Line }
  | { type: "bullets" | "numbers"; items: Line[] };

export function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];

  for (const raw of text.split("\n")) {
    const spaces = raw.length - raw.trimStart().length;
    const indent = Math.min(Math.floor(spaces / 2), MAX_INDENT);
    const line = raw.trimStart();
    const image = /^!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)$/.exec(line);
    const video = /^@video\((https?:\/\/[^\s)]+)\)$/.exec(line);

    if (image) {
      blocks.push({ type: "image", url: image[2] ?? "", alt: image[1] ?? "" });
      continue;
    }
    if (video) {
      blocks.push({ type: "video", url: video[1] ?? "" });
      continue;
    }

    const bullet = /^- (.*)$/.exec(line);
    const number = /^\d+\. (.*)$/.exec(line);
    const kind = bullet ? "bullets" : number ? "numbers" : null;
    const previous = blocks[blocks.length - 1];
    const item = { text: (bullet ?? number)?.[1] ?? "", indent };

    if (kind && previous?.type === kind) {
      previous.items.push(item);
    } else if (kind) {
      blocks.push({ type: kind, items: [item] });
    } else if (line !== "") {
      blocks.push({ type: "paragraph", line: { text: line, indent } });
    }
  }
  return blocks;
}

// Puts an image or video on its own line at the caret.
export function insertMedia(
  text: string,
  caret: number,
  kind: "image" | "video",
  url: string,
): Edit {
  const line = kind === "image" ? `![](${url})` : `@video(${url})`;
  const before = text.slice(0, caret);
  const after = text.slice(caret);
  const lead = before === "" || before.endsWith("\n") ? "" : "\n";
  const tail = after === "" || after.startsWith("\n") ? "" : "\n";
  const next = `${before}${lead}${line}${tail}${after}`;
  const end = before.length + lead.length + line.length;

  return { text: next, start: end, end };
}
