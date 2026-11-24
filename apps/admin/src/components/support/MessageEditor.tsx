"use client";
import React, { useState } from "react";

type MessageEditorProps = {
  initial: string;
  maxLength: number;
  saving: boolean;
  onSave: (text: string) => void;
  onCancel: () => void;
};

// Inline box for changing the text of a message you sent.
export function MessageEditor({
  initial,
  maxLength,
  saving,
  onSave,
  onCancel,
}: MessageEditorProps) {
  const [text, setText] = useState(initial);
  const next = text.trim();
  const canSave = next !== "" && next !== initial.trim() && !saving;

  const save = () => {
    if (canSave) onSave(next);
  };

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <textarea
        aria-label="Edit message"
        autoFocus
        rows={2}
        maxLength={maxLength}
        value={text}
        disabled={saving}
        className="text-body-s w-full resize-none rounded-lg border bg-white p-2 text-left"
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") onCancel();
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            save();
          }
        }}
      />
      <div className="flex justify-end gap-3">
        <button type="button" className="text-text-grey text-meta" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className="text-meta font-semibold text-green-700 disabled:opacity-50"
          disabled={!canSave}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
