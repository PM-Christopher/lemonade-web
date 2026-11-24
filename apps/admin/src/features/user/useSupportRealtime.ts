"use client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { pusherConfig } from "@/config/pusherConfig";
import { clearTyping, markTyping } from "@/lib/typing";
import { userKeys } from "./queries";

// Key the "user is typing" mark is stored under.
export const SUPPORT_TYPING_KEY = "support";

/** Keeps one user's support thread live for the admin: new messages, edits and "user is typing". */
export function useSupportRealtime(userId: string | number | undefined): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;
    const name = `private-support.thread.${userId}`;
    const channel = pusherConfig().subscribe(name);

    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: [...userKeys.all(), "support-chat", userId] });
    };
    const onMessage = () => {
      clearTyping(SUPPORT_TYPING_KEY);
      refresh();
    };
    const onTyping = (received: { from?: string }) => {
      if (received.from === "user") markTyping(SUPPORT_TYPING_KEY);
    };

    channel.bind("message.sent", onMessage);
    channel.bind("message.edited", refresh);
    channel.bind("typing", onTyping);

    return () => {
      channel.unbind("message.sent", onMessage);
      channel.unbind("message.edited", refresh);
      channel.unbind("typing", onTyping);
      pusherConfig().unsubscribe(name);
      clearTyping(SUPPORT_TYPING_KEY);
    };
  }, [userId, queryClient]);
}
