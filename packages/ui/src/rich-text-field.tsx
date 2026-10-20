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
  Image as ImageIcon,
  Underline,
  Video,
} from "lucide-react";
import { applyFormat, countWords, insertMedia, isSafeUrl, type FormatKind } from "@lemonade/domain";

interface RichTextFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  // Shows a word counter when set.
  maxWords?: number;
  // Add an image or video button by passing an uploader that returns the file's address.
  onUploadImage?: (file: File) => Promise<string>;
  onUploadVideo?: (file: File) => Promise<string>;
  // Tailwind height of the writing area.
  heightClass?: string;
}

const FORMATS: { kind: Exclude<FormatKind, "link">; label: string; Icon: typeof Bold }[] = [
  { kind: "bold", label: "Bold", Icon: Bold },
  { kind: "italic", label: "Italic", Icon: Italic },
  { kind: "underline", label: "Underline", Icon: Underline },
];

const LISTS: { kind: Exclude<FormatKind, "link">; label: string; Icon: typeof Bold }[] = [
  { kind: "bullets", label: "Bulleted list", Icon: List },
  { kind: "numbers", label: "Numbered list", Icon: ListOrdered },
  { kind: "outdent", label: "Decrease indent", Icon: IndentDecrease },
  { kind: "indent", label: "Increase indent", Icon: IndentIncrease },
];

const buttonClass =
  "text-text-grey hover:text-black-light cursor-pointer rounded p-1 disabled:opacity-40";

// Textarea with a small formatting toolbar, optional media uploads and a word counter.
export const RichTextField = ({
  id,
  value,
  onChange,
  onBlur,
  maxWords,
  onUploadImage,
  onUploadVideo,
  heightClass = "h-32.75",
}: RichTextFieldProps) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  // -1 until the writer has placed a caret, so media then goes at the end.
  const selection = useRef({ start: -1, end: -1 });
  const imageInput = useRef<HTMLInputElement | null>(null);
  const videoInput = useRef<HTMLInputElement | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const words = countWords(value);

  const rememberSelection = () => {
    const area = ref.current;
    if (area) selection.current = { start: area.selectionStart, end: area.selectionEnd };
  };

  const commit = (edit: { text: string; start: number; end: number }) => {
    const area = ref.current;
    onChange(edit.text);
    requestAnimationFrame(() => {
      area?.focus();
      area?.setSelectionRange(edit.start, edit.end);
    });
  };

  const apply = (kind: FormatKind, linkUrl = "") => {
    const area = ref.current;
    const start = area?.selectionStart ?? selection.current.start;
    const end = area?.selectionEnd ?? selection.current.end;
    commit(applyFormat(value, start, end, kind, linkUrl));
  };

  const addLink = () => {
    if (!isSafeUrl(url.trim())) return;
    commit(
      applyFormat(
        value,
        Math.max(selection.current.start, 0),
        Math.max(selection.current.end, 0),
        "link",
        url.trim(),
      ),
    );
    setUrl("");
    setLinkOpen(false);
  };

  const upload = async (
    file: File | undefined,
    kind: "image" | "video",
    uploader: ((file: File) => Promise<string>) | undefined,
  ) => {
    if (!file || !uploader) return;
    setUploading(true);
    setUploadError("");
    try {
      const address = await uploader(file);
      const caret =
        selection.current.end < 0 ? value.length : Math.min(selection.current.end, value.length);
      commit(insertMedia(value, caret, kind, address));
    } catch {
      setUploadError(`We couldn't upload that ${kind}. Try again.`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-light_grey rounded-xl">
      {maxWords !== undefined && (
        <div className="flex items-center justify-end p-2 pb-0">
          <span className={`text-meta ${words > maxWords ? "text-red-500" : "text-text-grey"}`}>
            {words}/{maxWords} words
          </span>
        </div>
      )}
      <textarea
        id={id}
        ref={ref}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        onSelect={rememberSelection}
        className={`form-font w-full resize-none border-0 bg-transparent px-4 pt-2 focus:ring-0 focus:outline-none ${heightClass}`}
      />
      {uploadError && <p className="px-4 pb-1 text-sm text-red-500">{uploadError}</p>}
      <div className="flex flex-wrap items-center gap-1 border-t border-gray-200 px-2 py-1">
        {onUploadImage && (
          <>
            <button
              type="button"
              aria-label="Add image"
              className={buttonClass}
              disabled={uploading}
              onClick={() => {
                rememberSelection();
                imageInput.current?.click();
              }}
            >
              <ImageIcon className="h-4 w-4" />
            </button>
            <input
              ref={imageInput}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              aria-label="Image file"
              onChange={(event) => {
                void upload(event.target.files?.[0], "image", onUploadImage);
                event.target.value = "";
              }}
            />
          </>
        )}
        {onUploadVideo && (
          <>
            <button
              type="button"
              aria-label="Add video"
              className={buttonClass}
              disabled={uploading}
              onClick={() => {
                rememberSelection();
                videoInput.current?.click();
              }}
            >
              <Video className="h-4 w-4" />
            </button>
            <input
              ref={videoInput}
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              className="hidden"
              aria-label="Video file"
              onChange={(event) => {
                void upload(event.target.files?.[0], "video", onUploadVideo);
                event.target.value = "";
              }}
            />
          </>
        )}
        {FORMATS.map(({ kind, label, Icon }) => (
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
        {LISTS.map(({ kind, label, Icon }) => (
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
