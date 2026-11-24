"use client";
import React from "react";
import dayjs from "dayjs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@lemonade/ui";
import { useSupportMessageEditsQuery } from "@/features/user/queries";
import type { MessageChange, MessageVersion } from "@/features/user/api";

type MessageHistoryDialogProps = {
  userId: string;
  // The message to show, or null while the dialog is closed.
  messageId: string | null;
  onClose: () => void;
};

// Changed words: removed in red with a line through them, added in green.
function Changes({ changes }: { changes: MessageChange[] }) {
  return (
    <p className="text-body-s break-words whitespace-pre-wrap">
      {changes.map((part, index) =>
        part.type === "removed" ? (
          <del key={index} className="rounded bg-red-100 text-red-700">
            {part.text}
          </del>
        ) : part.type === "added" ? (
          <ins key={index} className="rounded bg-green-100 text-green-800 no-underline">
            {part.text}
          </ins>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </p>
  );
}

const who = (version: MessageVersion) =>
  version.edited_by ? (version.edited_by.type === "admin" ? "Admin" : "User") : "";

// For audit: the original text, then every edit with its time, who made it and what changed.
export function MessageHistoryDialog({ userId, messageId, onClose }: MessageHistoryDialogProps) {
  const { data, isLoading, isError } = useSupportMessageEditsQuery(userId, messageId);

  return (
    <Dialog open={messageId !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit history</DialogTitle>
        </DialogHeader>
        {isLoading && <p className="text-text-grey text-body-s">Loading...</p>}
        {isError && <p className="text-body-s text-red-600">Couldn&apos;t load the history.</p>}
        {data && (
          <ol className="flex flex-col gap-4">
            {data.versions.map((version) => (
              <li key={version.version} className="flex flex-col gap-1 rounded-lg border p-3">
                <p className="text-text-grey text-meta">
                  {version.edited_by === null
                    ? "Original"
                    : `Edit ${version.version - 1} by ${who(version)}`}
                  {" · "}
                  {dayjs(version.at).format("D MMM YYYY, hh:mm:ssA")}
                </p>
                {version.changes ? (
                  <Changes changes={version.changes} />
                ) : (
                  <p className="text-body-s break-words whitespace-pre-wrap">{version.message}</p>
                )}
              </li>
            ))}
          </ol>
        )}
      </DialogContent>
    </Dialog>
  );
}
