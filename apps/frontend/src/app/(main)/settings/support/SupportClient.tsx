"use client";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { settingsKeys } from "@/features/settings/queries";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import MainLayout from "@/components/layouts/MainLayout";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import { useNavigation } from "@/hooks/useNavigation";
import { routes } from "@/lib/routes";
import { errorMessage } from "@/lib/api-error";
import { useAppDispatch } from "@/redux/hook";
import type { RootState } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useSupportMessagesQuery } from "@/features/settings/queries";
import { useSendSupportMessageMutation } from "@/features/settings/mutations";

// The conversation between the user and the Lemonade support team.
const SupportClient = () => {
  const { push } = useNavigation();
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = useSupportMessagesQuery({ enabled: isLoggedIn });
  const sendMutation = useSendSupportMessageMutation();
  const [text, setText] = useState("");
  const messages = data?.messages ?? [];
  const queryClient = useQueryClient();

  // Opening the thread marks replies as read, so the menu badge is refreshed.
  useEffect(() => {
    if (data) queryClient.invalidateQueries({ queryKey: settingsKeys.supportUnread() });
  }, [data, queryClient]);

  const send = () => {
    const message = text.trim();
    if (!message || sendMutation.isPending) return;
    sendMutation.mutate(message, {
      onSuccess: () => setText(""),
      onError: (error) =>
        dispatch(
          updateToastifyReducer({
            show: true,
            message: errorMessage(error, "Couldn't send your message."),
            type: "error",
          }),
        ),
    });
  };

  return (
    <MainLayout>
      <section className="bg-light_grey min-h-screen pb-10">
        <div className="laptop:px-16 flex items-center justify-between bg-white p-2 px-4">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-xl p-1 pr-4 pl-1"
            onClick={() => push(routes.SETTINGS)}
          >
            <ChevronLeft />
            <p className="tracking-custom text-body-l font-sans font-semibold">Support messages</p>
          </div>
        </div>
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
                {item.message && (
                  <p className="text-body-s break-words whitespace-pre-wrap">{item.message}</p>
                )}
                <p className="text-text-grey text-meta self-end leading-normal">
                  {dayjs(item.created_at).format("D MMM, hh:mmA")}
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-white p-3">
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
              disabled={!text.trim() || sendMutation.isPending}
              onClick={send}
            >
              Send
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default SupportClient;
