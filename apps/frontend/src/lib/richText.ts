// Plain-text formatting for business descriptions: **bold**, *italic*, [text](https://link),
// "- " bullets and "1. " numbers. Stored as text, rendered by FormattedText (never as HTML).

export const MAX_DESCRIPTION_WORDS = 500;

export type FormatKind = "bold" | "italic" | "bullets" | "numbers" | "link";

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

// Prefixes every selected line, or removes the prefix when they all have it.
const prefixLines = (text: string, start: number, end: number, numbered: boolean): Edit => {
  const lineStart = text.lastIndexOf("\n", start - 1) + 1;
  const newline = text.indexOf("\n", end);
  const lineEnd = newline === -1 ? text.length : newline;
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
  | { type: "bold" | "italic"; value: string }
  | { type: "link"; value: string; href: string };

const INLINE = /\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g;

export function parseInline(line: string): InlinePart[] {
  const parts: InlinePart[] = [];
  let last = 0;

  for (const match of line.matchAll(INLINE)) {
    if (match.index > last) parts.push({ type: "text", value: line.slice(last, match.index) });
    if (match[1] !== undefined) parts.push({ type: "bold", value: match[1] });
    else if (match[2] !== undefined) parts.push({ type: "italic", value: match[2] });
    else parts.push({ type: "link", value: match[3], href: match[4] });
    last = match.index + match[0].length;
  }
  if (last < line.length) parts.push({ type: "text", value: line.slice(last) });
  return parts;
}

export type Block =
  { type: "paragraph"; line: string } | { type: "bullets" | "numbers"; items: string[] };

export function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];

  for (const line of text.split("\n")) {
    const bullet = /^- (.*)$/.exec(line);
    const number = /^\d+\. (.*)$/.exec(line);
    const kind = bullet ? "bullets" : number ? "numbers" : null;
    const previous = blocks[blocks.length - 1];

    if (kind && previous?.type === kind) {
      previous.items.push((bullet ?? number)![1]);
    } else if (kind) {
      blocks.push({ type: kind, items: [(bullet ?? number)![1]] });
    } else if (line.trim() !== "") {
      blocks.push({ type: "paragraph", line });
    }
  }
  return blocks;
}
