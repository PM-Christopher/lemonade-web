"use client";
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { ImageIcon, MessageSquareTextIcon, SendIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useSupportMessagesQuery } from "@/features/user/queries";
import {
  useSendSupportMessageMutation,
  useUploadChatMediaMutation,
} from "@/features/user/mutations";
import { errorMessage } from "@/lib/api-error";

interface SavedReply {
  id: string;
  title: string;
  body: string;
}

interface SupportChatPanelProps {
  userId: string;
  // Only fetch while the panel is on screen.
  enabled?: boolean;
  // Ready-made answers the admin can drop into the message box.
  savedReplies?: ReadonlyArray<SavedReply>;
  className?: string;
}

const MAX_LENGTH = 2000;

// The support thread between the admin team and one user: messages, composer and saved replies.
export function SupportChatPanel({
  userId,
  enabled = true,
  savedReplies = [],
  className = "",
}: SupportChatPanelProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = useSupportMessagesQuery(userId, { enabled: isLoggedIn && enabled });
  const sendMutation = useSendSupportMessageMutation(userId);
  const uploadMutation = useUploadChatMediaMutation();
  const [text, setText] = useState("");
  const [repliesOpen, setRepliesOpen] = useState(false);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const bottom = useRef<HTMLDivElement | null>(null);
  const messages = data?.messages ?? [];

  // Keeps the newest message in view.
  useEffect(() => {
    bottom.current?.scrollIntoView?.({ block: "end" });
  }, [messages.length, userId]);

  const fail = (error: unknown) =>
    dispatch(
      updateToastifyReducer({
        show: true,
        message: errorMessage(error, "Couldn't send that message."),
        type: "error",
      }),
    );

  const send = () => {
    const message = text.trim();
    if (!message || sendMutation.isPending) return;
    sendMutation.mutate({ message }, { onSuccess: () => setText(""), onError: fail });
  };

  const sendFile = (file: File | undefined) => {
    if (!file) return;
    uploadMutation.mutate(file, {
      onSuccess: (media) => sendMutation.mutate({ media: [media] }, { onError: fail }),
      onError: fail,
    });
  };

  return (
    <div className={`flex min-h-0 flex-1 flex-col ${className}`}>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-text-grey text-body-s m-auto">No messages yet.</p>
        )}
        {messages.map((item) => {
          const mine = item.sender === "admin";
          return (
            <div
              key={item.id}
              className={`flex max-w-[75%] flex-col gap-1 rounded-xl p-3 ${
                mine ? "bg-light-tint self-end" : "bg-mid-grey self-start"
              }`}
            >
              {item.media.map((media) =>
                media.type === "video" ? (
                  <video key={media.url} src={media.url} controls className="max-h-60 rounded-lg" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={media.url}
                    src={media.url}
                    alt="Attachment"
                    className="max-h-60 rounded-lg"
                  />
                ),
              )}
              {item.message && (
                <p className="text-body-s break-words whitespace-pre-wrap">{item.message}</p>
              )}
              <p className="text-text-grey text-meta self-end leading-normal">
                {dayjs(item.created_at).format("D MMM, hh:mmA")}
              </p>
            </div>
          );
        })}
        <div ref={bottom} />
      </div>
      {repliesOpen && savedReplies.length > 0 && (
        <div className="bg-light-grey flex max-h-40 flex-col gap-1 overflow-y-auto border-t p-2">
          {savedReplies.map((reply) => (
            <button
              key={reply.id}
              type="button"
              className="text-body-s cursor-pointer rounded-lg px-3 py-2 text-left hover:bg-white"
              onClick={() => {
                setText(reply.body);
                setRepliesOpen(false);
              }}
            >
              <span className="font-semibold">{reply.title}</span>
              <span className="text-text-grey ml-2 line-clamp-1">{reply.body}</span>
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-3 border-t p-4">
        {savedReplies.length > 0 && (
          <button
            type="button"
            aria-label="Saved replies"
            aria-expanded={repliesOpen}
            className="text-text-grey cursor-pointer"
            onClick={() => setRepliesOpen((open) => !open)}
          >
            <MessageSquareTextIcon />
          </button>
        )}
        <input
          aria-label="Message"
          className="bg-light-grey text-body-s h-11 flex-1 rounded-xl px-3"
          placeholder="Write a message"
          value={text}
          maxLength={MAX_LENGTH}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              send();
            }
          }}
        />
        <button
          type="button"
          aria-label="Send message"
          className="text-light-green cursor-pointer disabled:opacity-50"
          disabled={!text.trim() || sendMutation.isPending}
          onClick={send}
        >
          <SendIcon />
        </button>
        <button
          type="button"
          aria-label="Attach image or video"
          className="text-text-grey cursor-pointer disabled:opacity-50"
          disabled={uploadMutation.isPending || sendMutation.isPending}
          onClick={() => fileInput.current?.click()}
        >
          <ImageIcon />
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/png,image/jpeg,video/mp4,video/quicktime,video/webm"
          className="hidden"
          aria-label="Attachment file"
          onChange={(e) => {
            sendFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
