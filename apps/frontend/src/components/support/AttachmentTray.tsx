"use client";
import React, { useEffect, useMemo } from "react";
import { XIcon } from "lucide-react";

interface AttachmentTrayProps {
  files: File[];
  onRemove: (index: number) => void;
  disabled?: boolean;
}

// The files picked for the next message, each with a remove button.
export function AttachmentTray({ files, onRemove, disabled }: AttachmentTrayProps) {
  const previews = useMemo(() => files.map((file) => URL.createObjectURL?.(file) ?? ""), [files]);

  useEffect(() => () => previews.forEach((url) => url && URL.revokeObjectURL?.(url)), [previews]);

  if (files.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-3 border-t px-4 pt-3" aria-label="Files to send">
      {files.map((file, index) => (
        <li key={`${file.name}-${index}`} className="relative">
          {file.type.startsWith("video/") ? (
            <video src={previews[index]} className="h-16 w-16 rounded-lg object-cover" muted />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previews[index]}
              alt={file.name}
              className="h-16 w-16 rounded-lg object-cover"
            />
          )}
          <button
            type="button"
            aria-label={`Remove ${file.name}`}
            disabled={disabled}
            className="bg-text-grey absolute -top-2 -right-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-white disabled:opacity-50"
            onClick={() => onRemove(index)}
          >
            <XIcon className="h-3 w-3" />
          </button>
        </li>
      ))}
    </ul>
  );
}
