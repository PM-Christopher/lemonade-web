"use client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { pusherConfig } from "@/config/pusherConfig";
import { clearTyping, markTyping } from "@/lib/typing";
import { settingsKeys } from "./queries";

// Key the "support is typing" mark is stored under.
export const SUPPORT_TYPING_KEY = "support";

/** Keeps the open support thread live: new replies, edits and "support is typing". */
export function useSupportRealtime(userId: string | undefined): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;
    const name = `private-support.user.${userId}`;
    const channel = pusherConfig().subscribe(name);

    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.support() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.supportUnread() });
    };
    const onMessage = () => {
      clearTyping(SUPPORT_TYPING_KEY);
      refresh();
    };
    const onTyping = (received: { from?: string }) => {
      if (received.from === "admin") markTyping(SUPPORT_TYPING_KEY);
    };

    channel.bind("message.sent", onMessage);
    channel.bind("message.edited", refresh);
    channel.bind("typing", onTyping);

    return () => {
      channel.unbind("message.sent", onMessage);
      channel.unbind("message.edited", refresh);
      channel.unbind("typing", onTyping);
      pusherConfig().unsubscribe(name);
    };
  }, [userId, queryClient]);
}
