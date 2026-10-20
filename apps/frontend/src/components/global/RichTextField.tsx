"use client";
import React, { useRef, useState } from "react";
import {
  Bold,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Underline,
} from "lucide-react";
import {
  applyFormat,
  countWords,
  isSafeUrl,
  MAX_DESCRIPTION_WORDS,
  type FormatKind,
} from "@/lib/richText";

interface RichTextFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  maxWords?: number;
}

const TOOLS: { kind: Exclude<FormatKind, "link">; label: string; Icon: typeof Bold }[] = [
  { kind: "bold", label: "Bold", Icon: Bold },
  { kind: "italic", label: "Italic", Icon: Italic },
  { kind: "underline", label: "Underline", Icon: Underline },
  { kind: "bullets", label: "Bulleted list", Icon: List },
  { kind: "numbers", label: "Numbered list", Icon: ListOrdered },
  { kind: "outdent", label: "Decrease indent", Icon: IndentDecrease },
  { kind: "indent", label: "Increase indent", Icon: IndentIncrease },
];

const buttonClass = "text-text-grey hover:text-black-light cursor-pointer rounded p-1";

// Textarea with a small formatting toolbar and a word counter.
export const RichTextField = ({
  id,
  value,
  onChange,
  onBlur,
  maxWords = MAX_DESCRIPTION_WORDS,
}: RichTextFieldProps) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const selection = useRef({ start: 0, end: 0 });
  const [linkOpen, setLinkOpen] = useState(false);
  const [url, setUrl] = useState("");
  const words = countWords(value);

  const apply = (kind: FormatKind, linkUrl = "") => {
    const area = ref.current;
    const start = area?.selectionStart ?? selection.current.start;
    const end = area?.selectionEnd ?? selection.current.end;
    const edit = applyFormat(value, start, end, kind, linkUrl);
    onChange(edit.text);
    requestAnimationFrame(() => {
      area?.focus();
      area?.setSelectionRange(edit.start, edit.end);
    });
  };

  const rememberSelection = () => {
    const area = ref.current;
    if (area) selection.current = { start: area.selectionStart, end: area.selectionEnd };
  };

  const addLink = () => {
    if (!isSafeUrl(url.trim())) return;
    const area = ref.current;
    const edit = applyFormat(
      value,
      selection.current.start,
      selection.current.end,
      "link",
      url.trim(),
    );
    onChange(edit.text);
    setUrl("");
    setLinkOpen(false);
    requestAnimationFrame(() => {
      area?.focus();
      area?.setSelectionRange(edit.end, edit.end);
    });
  };

  return (
    <div className="bg-light_grey rounded-xl">
      <div className="flex items-center justify-end p-2 pb-0">
        <span className={`text-meta ${words > maxWords ? "text-red-500" : "text-text-grey"}`}>
          {words}/{maxWords} words
        </span>
      </div>
      <textarea
        id={id}
        ref={ref}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        onSelect={rememberSelection}
        className="form-font h-32.75 w-full resize-none border-0 bg-transparent px-4 pt-1 focus:ring-0 focus:outline-none"
      />
      <div className="flex items-center gap-1 border-t border-gray-200 px-2 py-1">
        {TOOLS.map(({ kind, label, Icon }) => (
          <button
            key={kind}
            type="button"
            aria-label={label}
            className={buttonClass}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => apply(kind)}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
        <button
          type="button"
          aria-label="Link"
          aria-expanded={linkOpen}
          className={buttonClass}
          onClick={() => {
            rememberSelection();
            setLinkOpen((open) => !open);
          }}
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        {linkOpen && (
          <div className="ml-1 flex flex-1 items-center gap-1">
            <input
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addLink();
                }
              }}
              placeholder="https://"
              aria-label="Link address"
              className="text-body-s min-w-0 flex-1 rounded bg-white px-2 py-1 outline-none"
            />
            <button
              type="button"
              className="text-light-green cursor-pointer px-2 text-sm font-semibold disabled:opacity-40"
              disabled={!isSafeUrl(url.trim())}
              onClick={addLink}
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
