"use client";
import React, { useEffect, useRef, useState } from "react";
import { PaperclipIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { settingsKeys } from "@/features/settings/queries";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import MainLayout from "@/components/layouts/MainLayout";
import { BackHeader } from "@/components/global/BackHeader";
import { routes } from "@/lib/routes";
import { errorMessage } from "@/lib/api-error";
import { useAppDispatch } from "@/redux/hook";
import type { RootState } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useSupportMessagesQuery } from "@/features/settings/queries";
import type { SupportMessage } from "@/features/settings/api";
import {
  useSendSupportMessageMutation,
  useUploadSupportMediaMutation,
} from "@/features/settings/mutations";
import { AttachmentTray } from "@/components/support/AttachmentTray";
import { ACCEPTED_TYPES, MAX_ATTACHMENTS, addAttachments } from "@/components/support/attachments";

// The conversation between the user and the Lemonade support team.
const SupportClient = () => {
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = useSupportMessagesQuery({ enabled: isLoggedIn });
  const sendMutation = useSendSupportMessageMutation();
  const uploadMutation = useUploadSupportMediaMutation();
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const messages = data?.messages ?? [];
  const queryClient = useQueryClient();

  // Opening the thread marks replies as read, so the menu badge is refreshed.
  useEffect(() => {
    if (data) queryClient.invalidateQueries({ queryKey: settingsKeys.supportUnread() });
  }, [data, queryClient]);

  const busy = uploadMutation.isPending || sendMutation.isPending;
  const canSend = (text.trim() !== "" || files.length > 0) && !busy;

  const showError = (message: string) =>
    dispatch(updateToastifyReducer({ show: true, message, type: "error" }));

  const fail = (error: unknown) => showError(errorMessage(error, "Couldn't send your message."));

  const sent = () => {
    setText("");
    setFiles([]);
  };

  // Uploads the picked files first, then sends them with the text in one message.
  const send = () => {
    const message = text.trim();
    if (!canSend) return;
    const payload = (media?: SupportMessage["media"]) => ({
      ...(message ? { message } : {}),
      ...(media?.length ? { media } : {}),
    });

    if (files.length === 0) {
      sendMutation.mutate(payload(), { onSuccess: sent, onError: fail });
      return;
    }
    uploadMutation.mutate(files, {
      onSuccess: (media) => sendMutation.mutate(payload(media), { onSuccess: sent, onError: fail }),
      onError: fail,
    });
  };

  const pick = (picked: File[]) => {
    const { files: next, error } = addAttachments(files, picked);
    setFiles(next);
    if (error) showError(error);
  };

  return (
    <MainLayout>
      <section className="bg-light_grey min-h-screen pb-10">
        <BackHeader title="Support messages" href={routes.SETTINGS} />
        <div className="laptop:w-160 mx-auto mt-6 flex w-full flex-col gap-4 px-4">
          <div className="flex min-h-80 flex-col gap-3 rounded-xl bg-white p-4">
            {messages.length === 0 && (
              <p className="text-text-grey text-body-s m-auto">No messages yet.</p>
            )}
            {messages.map((item) => (
              <div
                key={item.id}
                className={`flex max-w-[80%] flex-col gap-1 rounded-xl p-3 ${
                  item.sender === "user" ? "bg-light-tint self-end" : "bg-mid-grey self-start"
                }`}
              >
                {item.media.length > 0 && (
                  <div className={`grid gap-2 ${item.media.length > 1 ? "grid-cols-2" : ""}`}>
                    {item.media.map((media) =>
                      media.type === "video" ? (
                        <video
                          key={media.url}
                          src={media.url}
                          controls
                          className="max-h-60 rounded-lg"
                        />
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
                  </div>
                )}
                {item.message && (
                  <p className="text-body-s break-words whitespace-pre-wrap">{item.message}</p>
                )}
                <p className="text-text-grey text-meta self-end leading-normal">
                  {dayjs(item.created_at).format("D MMM, hh:mmA")}
                </p>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-white">
            <AttachmentTray
              files={files}
              disabled={busy}
              onRemove={(index) => setFiles((current) => current.filter((_, i) => i !== index))}
            />
            <div className="flex items-center gap-3 p-3">
              <button
                type="button"
                aria-label="Attach pictures or videos"
                className="text-text-grey cursor-pointer disabled:opacity-50"
                disabled={busy || files.length >= MAX_ATTACHMENTS}
                onClick={() => fileInput.current?.click()}
              >
                <PaperclipIcon />
              </button>
              <input
                ref={fileInput}
                type="file"
                multiple
                accept={ACCEPTED_TYPES}
                className="hidden"
                aria-label="Attachment files"
                onChange={(e) => {
                  pick(Array.from(e.target.files ?? []));
                  e.target.value = "";
                }}
              />
              <input
                aria-label="Message"
                className="bg-light-grey text-body-s h-11 flex-1 rounded-xl px-3"
                placeholder="Write a message"
                value={text}
                maxLength={2000}
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
                className="bg-gradient-green h-11 rounded-xl px-5 font-medium text-white disabled:opacity-50"
                disabled={!canSend}
                onClick={send}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default SupportClient;
