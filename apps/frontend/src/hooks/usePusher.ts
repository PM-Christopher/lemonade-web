"use client";
import { disconnectAuthenticatedPusher, pusherCon, pusherConfig } from "@/config/pusherConfig";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { appendIncomingChatMessage, connectKeys } from "@/features/connect/queries";
import { notificationKeys } from "@/features/notifications";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import type { RootState } from "@/redux/store";
import type { OutgoingChatMessage } from "@/features/connect/api";

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
      } else if (channelName === `notifications.${user?.id}`) {
        // One refetch per server ping, no polling.
        queryClient.invalidateQueries({ queryKey: notificationKeys.all() });
        // Keeps the requests count and chat list on the Connect page current.
        queryClient.invalidateQueries({ queryKey: connectKeys.invites() });
        queryClient.invalidateQueries({ queryKey: connectKeys.chats() });
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

    channel.bind(eventName, eventHandler);

    return () => {
      channel.unbind(eventName, eventHandler);
      pusher.unsubscribe(subscribeName);
    };
  }, [channelName, eventName, dispatch, queryClient, user?.id]);

  return { data };
};
