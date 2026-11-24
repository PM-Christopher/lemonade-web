"use client";
import { disconnectAuthenticatedPusher, pusherCon, pusherConfig } from "@/config/pusherConfig";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  appendIncomingChatMessage,
  connectKeys,
  patchChatMessage,
} from "@/features/connect/queries";
import { notificationKeys } from "@/features/notifications";
import { showPushToast } from "@/lib/pushToast";
import { clearTyping, markTyping } from "@/lib/typing";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import type { RootState } from "@/redux/store";
import type { ChatHistoryResponse, OutgoingChatMessage } from "@/features/connect/api";

export const usePusher = (channelName: string | null, eventName: string) => {
  const [data, setData] = useState<unknown>(null);
  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!channelName) {
      // No channel: disconnect so signed-out pages do not re-authorize.
      disconnectAuthenticatedPusher();
      return;
    }

    const isUserChannel = channelName === "user";
    const pusher = isUserChannel ? pusherCon() : pusherConfig();
    // Private channels use the backend's `private-` prefix.
    const subscribeName = isUserChannel ? channelName : `private-${channelName}`;
    const channel = pusher.subscribe(subscribeName);

    // Payloads vary by channel; only chat events carry a message.
    const eventHandler = (receivedData: { message?: OutgoingChatMessage }) => {
      setData(receivedData);

      if (channelName === `chat.${user?.id}` && user?.id && receivedData.message) {
        appendIncomingChatMessage(queryClient, user.id, receivedData.message);
        clearTyping(receivedData.message.sender);
        // Alert only for messages from the other person.
        if (receivedData.message.sender !== user.id) {
          const senderId = receivedData.message.sender;
          const chats = queryClient.getQueryData<ChatHistoryResponse>(connectKeys.chats())?.chats;
          const sender = chats
            ?.flatMap((chat) => [chat.sender, chat.receiver])
            .find((person) => person.id === senderId);

          showPushToast({
            id: receivedData.message.id,
            title: sender?.username ? `New message from ${sender.username}` : "New message",
            body: receivedData.message.message,
            type: "new_message",
          });
        }
      } else if (channelName === `notifications.${user?.id}`) {
        // One refetch per server ping, no polling.
        queryClient.invalidateQueries({ queryKey: notificationKeys.all() });
        // Keeps the requests count and chat list on the Connect page current.
        queryClient.invalidateQueries({ queryKey: connectKeys.invites() });
        queryClient.invalidateQueries({ queryKey: connectKeys.chats() });
        // A missed chat event must never leave an open chat stale.
        queryClient.invalidateQueries({ queryKey: connectKeys.allChat() });
      } else if (channelName === `request.${user?.id}` && eventName === "request.service") {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "New business service request",
            type: "success",
          }),
        );
      }
    };

    // The other person changed a message in an open chat.
    const editedHandler = (received: { message?: OutgoingChatMessage }) => {
      const edited = received.message;
      if (!edited || !user?.id) return;
      patchChatMessage(queryClient, edited.sender, edited.id, {
        message: edited.message,
        edited_at: edited.edited_at ?? null,
      });
      queryClient.invalidateQueries({ queryKey: connectKeys.chats() });
    };

    // The other person is typing in this chat.
    const typingHandler = (received: { from?: string }) => {
      if (received.from) markTyping(received.from);
    };

    channel.bind(eventName, eventHandler);
    if (channelName === `chat.${user?.id}`) {
      channel.bind("message.edited", editedHandler);
      channel.bind("typing", typingHandler);
    }

    return () => {
      channel.unbind(eventName, eventHandler);
      channel.unbind("message.edited", editedHandler);
      channel.unbind("typing", typingHandler);
      pusher.unsubscribe(subscribeName);
    };
  }, [channelName, eventName, dispatch, queryClient, user?.id]);

  return { data };
};
