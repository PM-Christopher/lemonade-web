"use client";
import { pusherCon, pusherConfig } from "@/config/pusherConfig";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { appendIncomingChatMessage } from "@/features/connect/queries";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import type { RootState } from "@/redux/store";
import type { OutgoingChatMessage } from "@/features/connect/api";

export const usePusher = (channelName: string | null, eventName: string) => {
  const [data, setData] = useState<unknown>(null);
  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!channelName) return;

    const isUserChannel = channelName === "user";
    const pusher = isUserChannel ? pusherCon() : pusherConfig();
    // Backend broadcasts on the "private-"-prefixed wire name (see
    // routes/channels.php); callers here pass the logical name.
    const subscribeName = isUserChannel ? channelName : `private-${channelName}`;
    const channel = pusher.subscribe(subscribeName);

    const eventHandler = (receivedData: unknown) => {
      setData(receivedData);

      if (channelName === `chat.${user?.id}` && user?.id) {
        const { message } = receivedData as { message: OutgoingChatMessage };
        appendIncomingChatMessage(queryClient, user.id, message);
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
