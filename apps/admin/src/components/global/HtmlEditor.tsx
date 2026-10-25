"use client";
import React, { useRef, useState } from "react";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Underline,
} from "lucide-react";
import { SafeHtml } from "@lemonade/ui";

interface HtmlEditorProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  // Tailwind height of the writing area.
  heightClass?: string;
}

type Wrap = { open: string; close: string; sample: string };

const WRAPS: { label: string; Icon: typeof Bold; wrap: Wrap }[] = [
  { label: "Heading", Icon: Heading2, wrap: { open: "<h2>", close: "</h2>", sample: "Heading" } },
  {
    label: "Sub heading",
    Icon: Heading3,
    wrap: { open: "<h3>", close: "</h3>", sample: "Sub heading" },
  },
  {
    label: "Bold",
    Icon: Bold,
    wrap: { open: "<strong>", close: "</strong>", sample: "bold text" },
  },
  { label: "Italic", Icon: Italic, wrap: { open: "<em>", close: "</em>", sample: "italic text" } },
  {
    label: "Underline",
    Icon: Underline,
    wrap: { open: "<u>", close: "</u>", sample: "underlined text" },
  },
  {
    label: "Bulleted list",
    Icon: List,
    wrap: { open: "<ul><li>", close: "</li></ul>", sample: "Item" },
  },
  {
    label: "Numbered list",
    Icon: ListOrdered,
    wrap: { open: "<ol><li>", close: "</li></ol>", sample: "Item" },
  },
  {
    label: "Quote",
    Icon: Quote,
    wrap: { open: "<blockquote>", close: "</blockquote>", sample: "Quote" },
  },
];

const buttonClass =
  "text-text-grey hover:text-black-light cursor-pointer rounded p-1.5 disabled:opacity-40";

// A box for writing simple HTML, with buttons for the usual formatting and a safe preview.
export function HtmlEditor({ id, label, value, onChange, heightClass = "h-72" }: HtmlEditorProps) {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");

  const wrapSelection = ({ open, close, sample }: Wrap) => {
    const area = ref.current;
    const start = area?.selectionStart ?? value.length;
    const end = area?.selectionEnd ?? value.length;
    const selected = value.slice(start, end) || sample;
    onChange(`${value.slice(0, start)}${open}${selected}${close}${value.slice(end)}`);
    requestAnimationFrame(() => {
      area?.focus();
      area?.setSelectionRange(start + open.length, start + open.length + selected.length);
    });
  };

  const addLink = () => {
    const address = window.prompt("Link address (https://…)");
    if (!address) return;
    wrapSelection({
      open: `<a href="${address.replace(/"/g, "")}">`,
      close: "</a>",
      sample: "link",
    });
  };

  return (
    <div className="border-grey-20 overflow-hidden rounded-xl border">
      <div className="bg-light-grey border-grey-20 flex flex-wrap items-center gap-1 border-b px-2 py-1">
        {WRAPS.map(({ label: name, Icon, wrap }) => (
          <button
            key={name}
            type="button"
            aria-label={name}
            title={name}
            disabled={tab === "preview"}
            className={buttonClass}
            onClick={() => wrapSelection(wrap)}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
        <button
          type="button"
          aria-label="Link"
          title="Link"
          disabled={tab === "preview"}
          className={buttonClass}
          onClick={addLink}
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        <div className="ml-auto flex gap-1 text-xs font-medium">
          {(["write", "preview"] as const).map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={tab === name}
              className={`cursor-pointer rounded px-2 py-1 capitalize ${tab === name ? "bg-white shadow-sm" : "text-text-grey"}`}
              onClick={() => setTab(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      {tab === "write" ? (
        <textarea
          id={id}
          ref={ref}
          aria-label={label}
          spellCheck
          className={`text-body-s w-full resize-y bg-white p-3 font-mono focus:outline-none ${heightClass}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <div
          className={`overflow-y-auto bg-white p-4 ${heightClass}`}
          aria-label={`${label} preview`}
        >
          <SafeHtml html={value} />
        </div>
      )}
      <p className="text-text-grey border-grey-20 border-t px-3 py-1.5 text-xs">
        Only basic formatting is kept. Scripts, images and styles are removed when you save.
      </p>
    </div>
  );
}
